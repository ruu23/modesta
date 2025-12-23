// server/src/utils/validators.ts
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateSignup = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail({ 
      gmail_remove_dots: false,
      gmail_remove_subaddress: false,
      outlookdotcom_remove_subaddress: false,
      yahoo_remove_subaddress: false,
      icloud_remove_subaddress: false
    }),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain a number')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  // Add validation for other fields as needed
  body('country').optional().isString(),
  body('city').optional().isString(),
  body('brands').optional().isArray(),
  body('hijabStyle').optional().isString(),
  body('favoriteColors').optional().isArray(),
  body('stylePersonality').optional().isArray(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array().map(err => err.msg) 
      });
    }
    next();
  },
];
export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail({ 
      gmail_remove_dots: false,
      gmail_remove_subaddress: false,
      outlookdotcom_remove_subaddress: false,
      yahoo_remove_subaddress: false,
      icloud_remove_subaddress: false
    }),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => err.msg),
      });
    }

    next();
  },
];
