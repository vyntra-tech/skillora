import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'EDITOR' | 'MODERATOR';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: 'active' | 'blocked';
  avatar?: string;
  bio?: string;
  phone?: string;
  resumeUrl?: string;
  savedJobs: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'SUPER_ADMIN', 'EDITOR', 'MODERATOR'],
      default: 'USER',
    },
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    phone: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    savedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
  },
  { timestamps: true }
);

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);

