// server/src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User';
import { sendVerificationEmail } from '../services/emailService';

// Extend Express Request type to include user
interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ id }, secret, { expiresIn: '30d' });
};

const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Register
const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      email, 
      password, 
      fullName, 
      country, 
      city, 
      brands, 
      hijabStyle, 
      favoriteColors, 
      stylePersonality 
    } = req.body;
    
    // FIX 1: Only lowercase and trim - DON'T remove dots
    const normalizedEmail = email.toLowerCase().trim();

    // FIX 2: Use normalizedEmail for all checks
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      res.status(400).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();

    // FIX 3: Use normalizedEmail when creating user
    const user = await User.create({
      fullName,
      email: normalizedEmail, // Use normalized email
      password: hashedPassword,
      isVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      country,
      city,
      brands,
      hijabStyle,
      favoriteColors,
      stylePersonality
    });

    // Send verification email with enhanced error handling
    try {
      console.log('Attempting to send verification email to:', user.email);
      await sendVerificationEmail(user.email, verificationToken);
      console.log('✓ Verification email sent successfully to:', user.email);
      console.log('✓ Verification URL:', `${process.env.CLIENT_URL || 'http://localhost:8080'}/verify-email?token=${verificationToken}`);
    } catch (emailError: any) {
      console.error('❌ Failed to send verification email:', emailError);
      console.error('Error details:', {
        message: emailError.message,
        stack: emailError.stack,
        response: emailError.response?.data || 'No response data'
      });
      // Continue with registration even if email fails, but log the error
      console.warn('Continuing with registration despite email error');
    }

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isVerified: user.isEmailVerified,
        country: user.country,
        city: user.city,
        brands: user.brands,
        hijabStyle: user.hijabStyle,
        favoriteColors: user.favoriteColors,
        stylePersonality: user.stylePersonality
      },
      message: 'Registration successful! Please check your email to verify your account.'
    });
  } catch (error) {
    console.error('Registration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
};

// Login
const login = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    console.log('Login attempt:', { email: req.body?.email, hasPassword: !!req.body?.password });
    const { email, password } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide an email' 
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // If user exists but has no password
    if (!user.password) {
      // If no password was provided in the login attempt
      if (!password) {
        return res.status(200).json({
          success: false,
          message: 'Please set a password for your account',
          setPasswordRequired: true,
          email: user.email
        });
      }
      
      // If password was provided but user has no password set
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();
      
      // Generate token and log the user in
      const token = generateToken(user._id.toString());
      
      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          isVerified: user.isEmailVerified,
          country: user.country,
          city: user.city,
          brands: user.brands,
          hijabStyle: user.hijabStyle,
          favoriteColors: user.favoriteColors,
          stylePersonality: user.stylePersonality
        }
      });
    }

    // If user has a password, verify it
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = generateToken(user._id.toString());

    console.log('✅ Login successful for user:', user.email);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isVerified: user.isEmailVerified,
        country: user.country,
        city: user.city,
        brands: user.brands,
        hijabStyle: user.hijabStyle,
        favoriteColors: user.favoriteColors,
        stylePersonality: user.stylePersonality
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', error);
    
    return res.status(500).json({ 
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
};

// Verify Email
const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    // Find user by verification token
    const user = await User.findOne({ 
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() } // Check if token is not expired
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired verification token' 
      });
    }

    // Update user's email verification status
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    console.log('✓ Email verified successfully for:', user.email);

    res.json({ 
      success: true, 
      message: 'Email verified successfully' 
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to verify email' 
    });
  }
};

// Resend Verification Email
const resendVerificationEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    
    // FIX 7: Normalize email for resend
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
      return;
    }

    if (user.isEmailVerified) {
      res.status(400).json({ 
        success: false,
        message: 'Email is already verified' 
      });
      return;
    }

    const verificationToken = generateVerificationToken();
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await user.save();

    await sendVerificationEmail(user.email, verificationToken);
    console.log('✓ Verification email resent to:', user.email);

    res.json({ 
      success: true,
      message: 'Verification email resent successfully' 
    });
  } catch (error) {
    console.error('Resend verification email error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ 
      success: false,
      message: 'Error resending verification email',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
};

// Get Current User
const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};



export const setPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user?.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user has a password, verify current password
    if (user.password) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Set password error:', error);
    res.status(500).json({ message: 'Error updating password' });
  }
};

export {
  register,
  login,
  verifyEmail,
  resendVerificationEmail,
  getMe,
};