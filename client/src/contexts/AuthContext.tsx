// client/src/contexts/AuthContext.tsx
import { createContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  fullName: string;
  email: string;
  isVerified: boolean;
  country?: string;
  city?: string;
  brands?: string[];
  hijabStyle?: string;
  favoriteColors?: string[];
  stylePersonality?: string[];
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ 
  children,
  navigate 
}: { 
  children: ReactNode;
  navigate: (path: string) => void;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check for token on initial render
    return !!localStorage.getItem('token');
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const checkAuth = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }
    
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });
    
    if (response.ok) {
      const userData = await response.json();
      setUser(userData.user);
      setIsAuthenticated(true);
    } else {
      // If token is invalid, clear it from storage
      console.log('Token invalid or expired, clearing storage');
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  } finally {
    setIsLoading(false);
  }
};

  // Call checkAuth when the component mounts
  useEffect(() => {
    checkAuth();
  }, []);

  // FIX: Changed function signature to match the interface
  const login = async (credentials: { email: string; password: string }) => {
    const { email, password } = credentials;
    console.log('🔑 Login attempt:', { email, hasPassword: !!password });
    
    try {
      console.log('📡 Sending login request to:', `${API_URL}/auth/login`);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      
      console.log('📥 Login response status:', response.status);
      const data = await response.json().catch(e => {
        console.error('❌ Failed to parse response as JSON:', e);
        throw new Error('Invalid server response');
      });
      
      console.log('📊 Login response data:', data);
      
      // Handle special cases that come with 200 status but require action
      if (data.setPasswordRequired) {
        console.log('ℹ️ Set password required for:', email);
        return { 
          setPasswordRequired: true, 
          email, 
          token: data.token,
          message: data.message || 'Please set a password for your account'
        };
      }
      
      if (data.socialLoginRequired) {
        console.log('ℹ️ Social login required for:', email);
        throw new Error(data.message || 'This email is registered with a social login. Please use the social login option.');
      }
      
      if (!response.ok) {
        console.warn('⚠️ Login not OK:', { status: response.status, data });
        throw new Error(data.message || `Login failed with status ${response.status}`);
      }
      
      // Handle successful login
      console.log('✅ Login response data:', data);
      
      if (!data.user) {
        console.warn('⚠️ No user data in response, using minimal user object');
        // Create a minimal user object if not provided
        data.user = {
          id: 'temp-' + Date.now(),
          email: email,
          fullName: email.split('@')[0],
          isVerified: true
        };
      }
      
      console.log('✅ Login successful for user:', data.user?.email);
      
      // Save token
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (userData: any) => {
    try {
      setIsLoading(true);
      console.log('Sending signup data:', {
        url: `${API_URL}/auth/signup`,
        data: userData
      });
      
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = Array.isArray(data.errors) 
          ? data.errors.join('. ') 
          : (data.message || data.error || 'Signup failed. Please check your input and try again.');
        throw new Error(errorMessage);
      }

      // Save token and user data
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      if (data.user) {
        setUser(data.user); 
      }
      
      // Navigate to verify email page
      navigate('/verify-email');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      setUser((prev) => prev ? { ...prev, isVerified: true } : null);
      navigate('/home');
    } catch (error) {
      console.error('Email verification failed:', error);
      throw error;
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend verification email');
      }

      return data;
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        verifyEmail,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};