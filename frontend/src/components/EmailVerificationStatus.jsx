import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const EmailVerificationStatus = ({ isVerified, email, onResendVerification, isResending }) => {
  if (isVerified) {
    return (
      <div className="bg-[#00CC9A]/10 border border-[#00CC9A] rounded-md px-4 py-3 mb-6 flex items-start">
        <div className="flex-shrink-0 mr-3 mt-1">
          <svg className="w-5 h-5 text-[#00CC9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-[#00CC9A] font-medium">Email Verified</p>
          <p className="text-[#8A8D93] text-sm">Your email address has been verified.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FF3E5B]/10 border border-[#FF3E5B] rounded-md px-4 py-3 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3 mt-1">
          <svg className="w-5 h-5 text-[#FF3E5B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-[#FF3E5B] font-medium">Email Not Verified</p>
          <p className="text-[#8A8D93] text-sm mb-3">
            Please verify your email address to access all features. 
            We've sent a verification link to <span className="text-white">{email}</span>.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              className="text-sm py-1 px-3"
              onClick={onResendVerification}
              disabled={isResending}
            >
              {isResending ? 'Sending...' : 'Resend Email'}
            </Button>
            <Link to="/verify-email" className="text-[#00E8FF] text-sm hover:underline">
              Need help?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationStatus;