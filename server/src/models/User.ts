import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  preferences: {
    style: string[];
    colors: string[];
    occasions: string[];
    budget: string;
  };
  measurements?: {
    height: number;
    bust: number;
    waist: number;
    hips: number;
  };
  role: 'customer' | 'admin';
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  preferences: {
    style: [{ type: String }],
    colors: [{ type: String }],
    occasions: [{ type: String }],
    budget: { type: String, enum: ['budget', 'mid-range', 'luxury', 'ultra-luxury'] }
  },
  measurements: {
    height: { type: Number },
    bust: { type: Number },
    waist: { type: Number },
    hips: { type: Number }
  },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
