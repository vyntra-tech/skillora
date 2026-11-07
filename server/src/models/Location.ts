import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation extends Document {
  city: string;
  state: string;
  country: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  displayOrder: number;
  isPopular: boolean;
  jobsCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<ILocation>(
  {
    city: { type: String, required: true, trim: true },
    state: { type: String, default: '', trim: true },
    country: { type: String, default: 'India', trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
    displayOrder: { type: Number, default: 0 },
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Location = mongoose.model<ILocation>('Location', LocationSchema);

