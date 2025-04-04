import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Check for saved user in localStorage on initial load
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
    setInitialized(true);
  }, []);

  // Sign up function
  const signup = async (email, password, username) => {
    setLoading(true);
    try {
      const result = await authService.signup({ email, password, username });
      
      if (result.success) {
        // Note: we don't set the user yet since they need to verify email
        setUser(result.data.user);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        setLoading(false);
        return { success: true, message: result.data.message };
      } else {
        setLoading(false);
        return { success: false, error: result.error };
      }
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // Sign in function
  const signin = async (email, password) => {
    setLoading(true);
    try {
      const result = await authService.signin({ email, password });
      
      if (result.success) {
        // Set user data from signin response
        setUser(result.data.user);
        localStorage.setItem('user', JSON.stringify(result.data.user));           

        setLoading(false);
        return { 
          success: true, 
          isVerified: result.data.user.verified,
          user: result.data.user.username
        };
      } else {
        setLoading(false);
        return { success: false, error: result.error };
      }
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // Verify email
  const verifyEmail = async (token) => {
    setLoading(true);
    try {
      const result = await authService.verifyEmail(token);
      
      if (result.success) {
        // If user is signed in, update their verification status
        if (user) {
          const updatedUser = { ...user, isEmailVerified: true };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } else if (result.data.user) {
          // If we have user data from verification, save it
          setUser(result.data.user);
          localStorage.setItem('user', JSON.stringify(result.data.user));
        }
        
        setLoading(false);
        return { 
          success: true, 
          message: result.data.message || 'Email verified successfully',
          data: result.data
        };
      } else {
        setLoading(false);
        return { success: false, error: result.error };
      }
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // Resend verification email
  const resendVerification = async (email) => {
    setLoading(true);
    try {
      const result = await authService.resendVerification(email);
      
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // Sign out function
  const signout = () => {
    authService.signout();
    setUser(null);
  };  
  const value = {
    user,
    loading,
    initialized,
    signup,
    signin,
    signout,
    verifyEmail,
    resendVerification,   
    isAuthenticated: !!user,
    isEmailVerified: user?.isEmailVerified || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};