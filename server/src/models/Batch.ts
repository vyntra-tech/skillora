import mongoose, { Document, Schema } from 'mongoose';

export interface IBatch extends Document {
  year: string;
  status: 'active' | 'inactive';
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const BatchSchema = new Schema<IBatch>(
  {
    year: { type: String, required: true, unique: true, trim: true },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Batch = mongoose.model<IBatch>('Batch', BatchSchema);

