// server/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

// Export the AuthRequest interface for use in other files
export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

/**
 * Protect routes - verify JWT token and check if user exists
 */
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // 1. Get token from header, cookie, or query string
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
      // Get token from cookie
      token = req.cookies.jwt;
    }

    // 2. Check if token exists
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'You are not logged in! Please log in to get access.'
      });
      return;
    }

    // 3. Verify token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    // 4. Verify token
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // 5. Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
      return;
    }

    // 6. Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat as number)) {
      res.status(401).json({
        success: false,
        message: 'User recently changed password! Please log in again.'
      });
      return;
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = { id: currentUser._id.toString() };
    res.locals.user = currentUser;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    let message = 'You are not logged in! Please log in to get access.';
    if (error instanceof jwt.TokenExpiredError) {
      message = 'Your token has expired! Please log in again.';
    } else if (error instanceof jwt.JsonWebTokenError) {
      message = 'Invalid token! Please log in again.';
    }
    
    res.status(401).json({
      success: false,
      message
    });
  }
};

/**
 * Admin middleware - verify user has admin role
 * Must be used after the protect middleware
 */
export const admin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user) {
    const user = await User.findById(req.user.id);
    if (user && user.role === 'admin') {
      return next();
    }
  }
  res.status(403).json({ message: 'Not authorized as admin' });
};