import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: string[];
  material: string;
  brand: string;
  stock: number;
  tags: string[];
  modestyLevel: 'high' | 'medium' | 'flexible';
  occasions: string[];
  style: string[];
  featured: boolean;
  ratings: {
    average: number;
    count: number;
  };
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String },
  price: { type: Number, required: true },
  images: [{ type: String }],
  sizes: [{ type: String }],
  colors: [{ type: String }],
  material: { type: String },
  brand: { type: String },
  stock: { type: Number, default: 0 },
  tags: [{ type: String }],
  modestyLevel: { type: String, enum: ['high', 'medium', 'flexible'] },
  occasions: [{ type: String }],
  style: [{ type: String }],
  featured: { type: Boolean, default: false },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IProduct>('Product', ProductSchema);
