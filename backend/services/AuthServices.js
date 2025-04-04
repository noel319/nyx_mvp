const User = require('../models/User')
const { 
    UnauthorizedError, 
    NotFoundError, 
    ValidationError, 
    NotImplementedError, 
    BadRequestError,
    DuplicateError 
} = require('../utils/errors')
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
const jwt = require('jsonwebtoken')
const {ROLE} = require('../config/constant')
const JWT_KEY = "jwtactive987"
const crypto = require('crypto')

// Real-time password strength checker
const checkPasswordStrength = (password) => {
    const status = {
        isValid: false,
        length: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
        strength: 0,
        message: []
    };

    // Check length
    if (password.length >= 8) {
        status.length = true;
        status.strength += 1;
    } else {
        status.message.push('Password must be at least 8 characters long');
    }

    // Check uppercase
    if (/[A-Z]/.test(password)) {
        status.hasUpperCase = true;
        status.strength += 1;
    } else {
        status.message.push('Must contain at least one uppercase letter');
    }

    // Check lowercase
    if (/[a-z]/.test(password)) {
        status.hasLowerCase = true;
        status.strength += 1;
    } else {
        status.message.push('Must contain at least one lowercase letter');
    }

    // Check number
    if (/[0-9]/.test(password)) {
        status.hasNumber = true;
        status.strength += 1;
    } else {
        status.message.push('Must contain at least one number');
    }

    // Check special character
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        status.hasSpecialChar = true;
        status.strength += 1;
    } else {
        status.message.push('Must contain at least one special character');
    }

    // Set overall validity
    status.isValid = status.length && status.hasUpperCase && status.hasLowerCase && 
                    status.hasNumber && status.hasSpecialChar;

    return status;
}

// Password validation function for registration
const validatePassword = (password) => {
    const status = checkPasswordStrength(password);
    if (!status.isValid) {
        throw new ValidationError(status.message.join(', '));
    }
    return true;
}

// Email service configuration
const createTransporter = async () => {
    const oauth2Client = new OAuth2(
        "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com",
        "OKXIYR14wBB_zumf30EC__iJ",
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w"
    });

    const accessToken = await oauth2Client.getAccessToken();

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: "OAuth2",
            user: "nodejsa@gmail.com",
            clientId: "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com",
            clientSecret: "OKXIYR14wBB_zumf30EC__iJ",
            refreshToken: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w",
            accessToken: accessToken
        },
    });
};

// Email sending utility
const sendEmail = async (to, subject, html) => {
    try {
        const transporter = await createTransporter();
        const mailOptions = {
            from: '"OASIS Auth" <nodejsa@gmail.com>',
            to,
            subject,
            generateTextFromHTML: true,
            html
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw new NotImplementedError('Failed to send email. Please try again later.');
    }
};

exports.login = async (body) => {
    let { email, password } = body

    if (!email || !password) {
        throw new ValidationError('Email and password are required');
    }

    let user = await User.findOne({ email: email })

    if (!user) {
        throw new NotFoundError('No user found with this email address');
    }
    
    if (!user.verified) {
        throw new BadRequestError('Please verify your email address before logging in');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ValidationError('Invalid password. Please try again');
    }

    // Check if password needs rehashing
    if (user.needsPasswordRehash()) {
        user.password = password; // This will trigger the pre-save hook to rehash
        await user.save();
    }

    // Create JWT token
    const token = jwt.sign(
        { 
            id: user._id,
            email: user.email, 
            role: user.role 
        }, 
        JWT_KEY, 
        { expiresIn: '24h' }
    );

    return {
        user: user.toProfileJSONFor(),
        token
    };
}

exports.register = async (header, body) => {
    let { email, password, username } = body

    if (!username || !password || !email) {
        throw new ValidationError('Username, email, and password are required');
    }

    // Check for existing user
    const existingUser = await User.findOne({
        $or: [{ email: email }, { username: username }]
    });

    if (existingUser) {
        if (existingUser.email === email) {
            throw new DuplicateError('email');
        } else {
            throw new DuplicateError('username');
        }
    }

    // Validate password strength
    validatePassword(password);

    let user = new User({
        username: username,
        password: password, // Will be hashed by pre-save hook
        email: email,
        role: ROLE.CUSTOMER,
    });

    try {
        await user.save();
    } catch (error) {
        if (error.name === 'ValidationError') {
            throw new ValidationError(error.message);
        }
        throw error;
    }

    try {
        const token = jwt.sign(
            { 
                id: user._id,
                email: user.email, 
                role: user.role 
            }, 
            JWT_KEY, 
            { expiresIn: '30m' }
        );
        const CLIENT_URL = 'http://' + header.host;

        const output = `
        <h2>Please click on below link to activate your account</h2>
        <a href="${CLIENT_URL}/auth/verify/${token}">Verify Email</a>
        <p><b>NOTE: </b> The above activation link expires in 30 minutes.</p>
        <p>If you didn't create this account, please ignore this email.</p>
        `;

        await sendEmail(
            email,
            "Account Verification: OASIS Nyxcipher Auth",
            output
        );

        return user.toProfileJSONFor();
    } catch (error) {
        throw new NotImplementedError('Failed to send verification email. Please try again later.');
    }
}

exports.verify = async (params) => {
    const {token} = params;
    
    if (!token) {
        throw new UnauthorizedError('Verification token is required');
    }

    try {
        const decodedToken = jwt.verify(token, JWT_KEY);
        const user = await User.findById(decodedToken.id);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (user.verified) {
            throw new BadRequestError('Email is already verified');
        }

        user.verified = true;
        await user.save();

        return {
            message: 'Email verified successfully',
            user: user.toProfileJSONFor()
        };
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new UnauthorizedError('Verification link has expired. Please request a new one.');
        }
        throw error;
    }
}

exports.resendVerification = async (req) => {
    const { email } = req.body;

    if (!email) {
        throw new ValidationError('Please enter an email address');
    }

    let user = await User.findOne({ email: email });

    if (!user) {
        throw new NotFoundError('No user found with this email address');
    }

    if (user.verified) {
        throw new BadRequestError('Email is already verified');
    }

    try {
        const token = jwt.sign(
            { 
                id: user._id,
                email: user.email, 
                role: user.role 
            }, 
            JWT_KEY, 
            { expiresIn: '30m' }
        );
        const CLIENT_URL = 'http://' + req.headers.host;

        const output = `
        <h2>Please click on below link to activate your account</h2>
        <a href="${CLIENT_URL}/auth/verify/${token}">Verify Email</a>
        <p><b>NOTE: </b> The above activation link expires in 30 minutes.</p>
        <p>If you didn't create this account, please ignore this email.</p>
        <p>This is a new verification email requested by you.</p>
        `;

        await sendEmail(
            email,
            "Account Verification: OASIS Nyxcipher Auth (Resend)",
            output
        );

        return { message: 'Verification email has been resent successfully' };
    } catch (error) {
        throw new NotImplementedError('Failed to send verification email. Please try again later.');
    }
}

exports.forgotPassword = async (req) => {
    const { email } = req.body;

    if (!email) {
        throw new ValidationError('Please enter an email address');
    }

    let user = await User.findOne({ email: email });

    if (!user) {
        throw new NotFoundError('No user found with this email address');
    }

    try {
        // Generate verification token
        const verificationToken = jwt.sign(
            { 
                id: user._id,
                email: user.email,
                purpose: 'password_reset'
            }, 
            JWT_KEY, 
            { expiresIn: '15m' }
        );

        const CLIENT_URL = 'http://' + req.headers.host;

        const output = `
        <h2>Password Reset Verification</h2>
        <p>You requested to reset your password. To proceed, please click the link below to verify your email:</p>
        <a href="${CLIENT_URL}/auth/verify-reset/${verificationToken}">Verify Email for Password Reset</a>
        <p><b>NOTE: </b> This verification link expires in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>For security reasons, this link can only be used once.</p>
        `;

        await sendEmail(
            email,
            "Password Reset Verification: OASIS Auth",
            output
        );

        return { message: 'Password reset verification email sent successfully' };
    } catch (error) {
        throw new NotImplementedError('Failed to send verification email. Please try again later.');
    }
}

exports.verifyResetRequest = async (params) => {
    const { token } = params;
    
    if (!token) {
        throw new UnauthorizedError('Verification token is required');
    }

    try {
        const decodedToken = jwt.verify(token, JWT_KEY);
        
        if (decodedToken.purpose !== 'password_reset') {
            throw new BadRequestError('Invalid token purpose');
        }

        const user = await User.findById(decodedToken.id);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Generate reset token
        const resetToken = await user.generatePasswordResetToken();
        await user.save();

        // Return the reset token to be used in the frontend
        return { 
            message: 'Email verified successfully',
            resetToken,
            email: user.email
        };
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new UnauthorizedError('Verification link has expired. Please request a new one.');
        }
        throw error;
    }
}

exports.reset = async (body) => {
    const { token, password } = body;

    if (!token || !password) {
        throw new ValidationError('Token and new password are required');
    }

    // Find user with valid reset token
    const user = await User.findOne({
        resetPasswordToken: crypto
            .createHash('sha256')
            .update(token)
            .digest('hex'),
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        throw new BadRequestError('Invalid or expired password reset token');
    }

    // Check if account is locked
    if (user.resetPasswordLockUntil && Date.now() < user.resetPasswordLockUntil) {
        throw new BadRequestError('Account is temporarily locked. Please try again later.');
    }

    // Validate new password
    validatePassword(password);

    // Update password and clear reset token
    user.password = password;
    await user.clearResetToken();
    await user.save();

    return { message: 'Password has been reset successfully' };
}