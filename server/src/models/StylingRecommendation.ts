import mongoose, { Schema, Document } from 'mongoose';

export interface IStylingRecommendation extends Document {
  userId: mongoose.Types.ObjectId;
  occasion: string;
  season: string;
  budget: string;
  stylePreferences: string[];
  recommendations: {
    outfit: {
      productIds: mongoose.Types.ObjectId[];
      description: string;
      totalPrice: number;
    }[];
    reasoning: string;
  };
  imageUrl?: string;
  feedback?: {
    rating: number;
    comment: string;
  };
  createdAt: Date;
}

const StylingRecommendationSchema = new Schema<IStylingRecommendation>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  occasion: { type: String, required: true },
  season: { type: String },
  budget: { type: String },
  stylePreferences: [{ type: String }],
  recommendations: {
    outfit: [{
      productIds: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
      description: { type: String },
      totalPrice: { type: Number }
    }],
    reasoning: { type: String }
  },
  imageUrl: { type: String },
  feedback: {
    rating: { type: Number },
    comment: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IStylingRecommendation>('StylingRecommendation', StylingRecommendationSchema);
