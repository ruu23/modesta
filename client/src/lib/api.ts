// client/src/lib/api.ts
import axios from 'axios';

// Use Vite's import.meta.env instead of process.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const verifyEmail = async (token: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-email`, { token });
    return response.data;
  } catch (error) {
    console.error('Verification error:', error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const signup = async (userData: any) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, userData);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const resendVerificationEmail = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/resend-verification`, { email });
    return response.data;
  } catch (error) {
    console.error('Resend verification error:', error);
    throw error;
  }
};

export const getMe = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get me error:', error);
    throw error;
  }
};

export const api = {
  verifyEmail,
  login,
  signup,
  resendVerificationEmail,
  getMe
};