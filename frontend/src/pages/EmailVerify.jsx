import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const EmailVerify = () => {
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verificationData, setVerificationData] = useState(null);

  const { verifyEmail, resendVerification, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get verification token from URL query parameters
  useEffect(() => {
    const verifyToken = async () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get('token');
      
      if (!token) {
        setStatus('prompt');
        setMessage('No verification token provided. Please check your email for the verification link or request a new one.');
        return;
      }
      
      setStatus('loading');
      setMessage('Verifying your email...');
      
      try {
        const result = await verifyEmail(token);
        
        if (result.success) {
          // Store verification data from backend response
          setVerificationData(result.data);
          
          setStatus('success');
          setMessage(result.message || 'Your email has been successfully verified!');
          
          // Automatically redirect to project page after successful verification
          setTimeout(() => {
            navigate('/home');
          }, 2000);
        } else {
          setStatus('error');
          setMessage(result.error || 'Failed to verify email. The token may be invalid or expired.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again later.');
      }
    };
    
    verifyToken();
    
    // Pre-fill email from user context if available
    if (user && user.email) {
      setEmail(user.email);
    }
  }, [location.search, verifyEmail, user, navigate]);

  // Handle countdown for resend cooldown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleResendVerification = async () => {
    if (!email || resendDisabled) return;
    
    setResendDisabled(true);
    setCountdown(60); // 60 seconds cooldown
    
    try {
      const result = await resendVerification(email);
      
      if (result.success) {
        setStatus('prompt');
        setMessage('Verification email sent! Please check your inbox and spam folder.');
      } else {
        setStatus('error');
        setMessage(result.error || 'Failed to send verification email. Please try again later.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An unexpected error occurred. Please try again later.');
    }
  };

  const handleContinue = () => {
    navigate('/home');
  };

  // Render different content based on status
  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-t-[#00E8FF] border-r-[#00E8FF] border-b-transparent border-l-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-4">Verifying Your Email</h2>
            <p className="text-[#8A8D93] mb-4">Please wait while we verify your email address...</p>
          </div>
        );
        
      case 'success':
        return (
          <div className="text-center">
            <div className="bg-[#00E8FF]/20 rounded-full p-4 inline-block mb-6">
              <svg className="w-16 h-16 text-[#00E8FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Email Verified!</h2>
            <p className="text-[#8A8D93] mb-8">{message}</p>
            {verificationData && verificationData.user && (
              <div className="bg-[#1A1E26] border border-[#2A2E36] rounded-md p-4 mb-6 text-left">
                <h3 className="text-lg font-semibold text-white mb-2">Verification Details:</h3>
                <p className="text-[#8A8D93] mb-1">Email: {verificationData.user.email}</p>
                <p className="text-[#8A8D93] mb-1">Username: {verificationData.user.username}</p>
                <p className="text-[#8A8D93]">Status: <span className="text-[#00E8FF]">Verified</span></p>
              </div>
            )}
            <p className="text-[#8A8D93] mb-4">Redirecting to project page...</p>
            <Button variant="primary" onClick={handleContinue} className="py-3">
              Continue to Projects
            </Button>
          </div>
        );
        
      case 'error':
        return (
          <div className="text-center">
            <div className="bg-[#FF3E5B]/20 rounded-full p-4 inline-block mb-6">
              <svg className="w-16 h-16 text-[#FF3E5B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Verification Failed</h2>
            <p className="text-[#FF3E5B] mb-8">{message}</p>
            <div className="mb-6">
              <label className="block text-[#8A8D93] mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                className="w-full bg-[#1A1E26] border border-[#2A2E36] rounded-md px-4 py-2 text-white placeholder-[#5A5D63] focus:outline-none focus:ring-1 focus:ring-[#00E8FF] focus:border-[#00E8FF]"
              />
            </div>
            <Button 
              variant="primary" 
              onClick={handleResendVerification} 
              disabled={resendDisabled}
              className="py-3 w-full"
            >
              {resendDisabled 
                ? `Resend Verification (${countdown}s)` 
                : "Resend Verification Email"}
            </Button>
          </div>
        );
        
      case 'prompt':
      default:
        return (
          <div className="text-center">
            <div className="bg-[#00E8FF]/20 rounded-full p-4 inline-block mb-6">
              <svg className="w-16 h-16 text-[#00E8FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Verify Your Email</h2>
            <p className="text-[#8A8D93] mb-8">{message}</p>
            <div className="mb-6">
              <label className="block text-[#8A8D93] mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                className="w-full bg-[#1A1E26] border border-[#2A2E36] rounded-md px-4 py-2 text-white placeholder-[#5A5D63] focus:outline-none focus:ring-1 focus:ring-[#00E8FF] focus:border-[#00E8FF]"
              />
            </div>
            <Button 
              variant="primary" 
              onClick={handleResendVerification} 
              disabled={resendDisabled}
              className="py-3 w-full"
            >
              {resendDisabled 
                ? `Resend Verification (${countdown}s)` 
                : "Resend Verification Email"}
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0E15] text-white">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[#1A1E26] border border-[#2A2E36] rounded-lg p-8">
          {renderContent()}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EmailVerify;