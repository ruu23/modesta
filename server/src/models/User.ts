// server/src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  _passwordConfirm?: string; // Internal storage for virtual field
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  country?: string;
  city?: string;
  brands?: string[];
  hijabStyle?: string;
  favoriteColors?: string[];
  stylePersonality?: string[];
  createdAt: Date;
  updatedAt: Date;
  role: 'user' | 'admin';
  
  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
  createEmailVerificationToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: [50, 'Name must be less than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false // Don't return password by default
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    country: String,
    city: String,
    brands: [String],
    hijabStyle: String,
    favoriteColors: [String],
    stylePersonality: [String],
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for password confirmation
userSchema.virtual('passwordConfirm')
  .get(function(this: IUser) { 
    return this._passwordConfirm; 
  })
  .set(function(this: IUser, value: string) { 
    this._passwordConfirm = value; // Store in internal field
  });

// Validate password confirmation and hash password before saving
userSchema.pre<IUser>('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  try {
    // Validate password confirmation
    if (this._passwordConfirm && this.password !== this._passwordConfirm) {
      const error = new Error('Passwords do not match');
      return next(error);
    }
    
    // Hash the password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Clear passwordConfirm field
    this._passwordConfirm = undefined;
    
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Update passwordChangedAt when password is modified (except on creation)
userSchema.pre<IUser>('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  
  // Set passwordChangedAt to 1 second in the past to ensure JWT is created after
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

// Instance method to check if password is correct
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp: number): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changedTimestamp;
  }
  return false; // Not changed
};

// Create password reset token
userSchema.methods.createPasswordResetToken = function(): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  return resetToken;
};

// Create email verification token
userSchema.methods.createEmailVerificationToken = function(): string {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
    
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  return verificationToken;
};

const User = mongoose.model<IUser>('User', userSchema);

export { User };