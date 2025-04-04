const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const {CUSTOMER} = require('../config/constant')
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const { ValidationError, DuplicateError } = require('../utils/errors');

//------------ User Schema ------------//
const UserSchema = new mongoose.Schema({
  username: {
    type: String, 
    unique: true, 
    required: [true, 'Username is required'],
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String, 
    unique: true, 
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  password: {
    type: String, 
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  role: {
    type: String, 
    default: CUSTOMER,
    enum: {
      values: ['Customer', 'Sponser', 'Owner'],
      message: 'Invalid role specified'
    }
  },
  phone_number: {
    type: String, 
    default: '',
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  verified: {
    type: Boolean, 
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  resetPasswordAttempts: {
    type: Number,
    default: 0
  },
  resetPasswordLockUntil: Date,
  resetLink: {
    type: String, 
    default: ''
  },
  cart_entry: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cart'
  }],
  kyc_verified: {
    type: Boolean, 
    default: false
  },
  address: {
    type: Object, 
    default: null,
    validate: {
      validator: function(v) {
        if (v === null) return true;
        return v.street && v.city && v.country;
      },
      message: 'Address must include street, city, and country'
    }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Custom error handling for unique fields
UserSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    next(new DuplicateError(field));
  } else {
    next(error);
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(new ValidationError('Error hashing password'));
  }
});

// Method to generate password reset token
UserSchema.methods.generatePasswordResetToken = async function() {
  // Generate random token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expiration (30 minutes from now)
  this.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
  
  // Reset attempts counter
  this.resetPasswordAttempts = 0;
  this.resetPasswordLockUntil = undefined;

  return resetToken;
};

// Method to check if reset token is valid
UserSchema.methods.isResetTokenValid = function(token) {
  if (!this.resetPasswordToken || !this.resetPasswordExpires) {
    return false;
  }

  // Check if token is expired
  if (Date.now() > this.resetPasswordExpires) {
    return false;
  }

  // Check if account is locked
  if (this.resetPasswordLockUntil && Date.now() < this.resetPasswordLockUntil) {
    return false;
  }

  // Hash the provided token and compare with stored hash
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  return this.resetPasswordToken === hashedToken;
};

// Method to increment reset attempts
UserSchema.methods.incrementResetAttempts = async function() {
  this.resetPasswordAttempts += 1;
  
  // Lock account for 1 hour if too many attempts
  if (this.resetPasswordAttempts >= 3) {
    this.resetPasswordLockUntil = Date.now() + 60 * 60 * 1000;
  }
  
  await this.save();
};

// Method to clear reset token
UserSchema.methods.clearResetToken = async function() {
  this.resetPasswordToken = undefined;
  this.resetPasswordExpires = undefined;
  this.resetPasswordAttempts = 0;
  this.resetPasswordLockUntil = undefined;
  await this.save();
};

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcryptjs.compare(candidatePassword, this.password);
  } catch (error) {
    throw new ValidationError('Error comparing passwords');
  }
};

// Method to check if password needs rehashing
UserSchema.methods.needsPasswordRehash = function() {
  return bcryptjs.getRounds(this.password) !== 10;
};

// Virtual for user's full name
UserSchema.virtual('fullName').get(function() {
  return `${this.username}`;
});

UserSchema.methods.toProfileJSONFor = function() {
  return {
    username: this.username,
    email: this.email,
    role: this.role,
    phone_number: this.phone_number,
    verified: this.verified,
    resetLink: this.resetLink,
    cart_entry: this.cart_entry,
    kyc_verified: this.kyc_verified,
    address: this.address,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

const User = mongoose.model('User', UserSchema);

module.exports = User;