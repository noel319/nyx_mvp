import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Logo from '../components/Logo';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { VALIDATION_MESSAGES } from '../constants';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const { signin } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = VALIDATION_MESSAGES.required;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = VALIDATION_MESSAGES.email;
    }
    
    if (!formData.password) {
      newErrors.password = VALIDATION_MESSAGES.required;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setLoginError('');
    
    try {
      const result = await signin(formData.email, formData.password);
      
      if (result.success) {
        // Check if user's email is verified
        if (result.isVerified) {
          navigate('/dashboard');
        } else {          
          navigate('/verify-email');
        }
      } else {
        setLoginError(result.error || 'Failed to sign in. Please check your credentials.');
      }
    } catch (error) {
      setLoginError('An unexpected error occurred. Please try again.');
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0E15] text-white">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo className="mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
            <p className="text-[#8A8D93]">Access your Nyx Cipher account</p>
          </div>
          
          {loginError && (
            <div className="bg-[#FF3E5B]/10 border border-[#FF3E5B] text-[#FF3E5B] px-4 py-3 rounded-md mb-6">
              {loginError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-600 bg-[#1A1E26] text-[#00E8FF] focus:ring-[#00E8FF]"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-[#8A8D93]">
                  Remember me
                </label>
              </div>
              
              <a 
                href="#" 
                className="text-sm text-[#00E8FF] hover:underline"
              >
                Forgot password?
              </a>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              fullWidth
              className="py-3 text-lg border-2"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            <div className="text-center mt-4">
              <span className="text-[#8A8D93]">Don't have an account? </span>
              <Link to="/signup" className="text-[#00E8FF] hover:underline">
                Sign Up
              </Link>
            </div>
          </form>
          
          <div className="mt-8 border-t border-[#1A1E26] pt-6">
            <p className="text-center text-sm text-[#8A8D93] mb-4">
              Or continue with
            </p>
            
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                fullWidth 
                className="justify-center space-x-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span>Google</span>
              </Button>
              
              <Button 
                variant="outline" 
                fullWidth 
                className="justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.23 9.84c-.55 0-1.08.2-1.51.58-.34.31-.57.7-.68 1.13-.04.14-.06.28-.06.43 0 .82.4 1.54 1.02 1.98l.01.01c.4.29.89.44 1.44.44.03 0 .05 0 .08-.01h.04c.67-.05 1.24-.32 1.67-.77.21-.22.38-.48.49-.77.11-.29.16-.6.16-.94 0-.14-.01-.28-.04-.42a2.33 2.33 0 0 0-.61-1.21c-.23-.25-.5-.44-.8-.58a2.71 2.71 0 0 0-1.21-.25zm-14.46.3A2.33 2.33 0 0 0 .51 13.5l1.88-7.3c.22-.9 1.05-1.53 1.97-1.53h8.75c-.73-.8-1.81-1.33-3.01-1.38L10 3.28H4.4c-1.68 0-3.15 1.13-3.63 2.76l-2.51 9.89c-.1.39-.08.81.08 1.2.3.76.98 1.31 1.8 1.4l.06.01h.08l6.08-.16-2.18-8.13c-.06-.23-.09-.46-.09-.7 0-.36.08-.72.23-1.06.35-.77 1.07-1.31 1.92-1.38l.07-.01h8.04c.09 0 .18.01.26.02.37.04.72.16 1.03.35.4.24.74.59.95 1.02.11.22.18.45.22.69.04.24.05.49.05.74 0 .24-.03.46-.08.68-.02.09-.04.16-.06.24 1.13.28 1.98 1.15 2.13 2.36.86-.8 2-1.28 3.26-1.28.73 0 1.41.17 2.03.46.62.29 1.15.72 1.57 1.24.41.53.72 1.14.9 1.8.08.31.12.63.12.96 0 .56-.1 1.1-.31 1.6-.2.5-.5.96-.89 1.36-.76.8-1.8 1.28-2.96 1.35h-.1c-.93 0-1.78-.25-2.48-.75-1.19.93-2.65 1.42-4.19 1.42h-11.1c-.07 0-.13-.01-.2-.02-.08-.01-.15-.03-.23-.05-1.45-.15-2.64-1.16-2.95-2.57-.07-.33-.1-.68-.07-1.02l.48-1.84-2.92.05zM7.84 9.13c-.08 0-.17.01-.25.04-.31.07-.58.3-.71.67-.06.16-.08.32-.08.49 0 .17.02.33.06.5l1.58 5.85 4.27-.09c1-.03 1.91-.34 2.66-.86-.55-.5-.91-1.21-.99-2.01-.51.61-1.22 1.05-2.04 1.19-.19.03-.39.05-.59.05-.87 0-1.65-.33-2.21-.94-.57-.6-.85-1.43-.85-2.3a3.7 3.7 0 0 1 .96-2.41c.63-.67 1.5-1.09 2.45-1.18h.12l-4.38.01z" />
                </svg>
                <span>Metamask</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SignIn;