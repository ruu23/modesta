import axios from '../utils/axiosConfig';

export const verifyEmail = async (token: string) => {
  try {
    const response = await axios.post('/auth/verify-email', { token });
    return response.data;
  } catch (error) {
    console.error('Verification error:', error);
    throw error;
  }
};