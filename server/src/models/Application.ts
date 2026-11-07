import mongoose, { Document, Schema } from 'mongoose';

export type ApplicationStatus = 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';

export interface IApplication extends Document {
  candidateId?: mongoose.Types.ObjectId;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  jobId: mongoose.Types.ObjectId;
  jobTitle: string;
  companyId: mongoose.Types.ObjectId;
  companyName: string;
  resumeUrl: string;
  coverLetter?: string;
  status: ApplicationStatus;
  notes?: string;
  appliedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    candidateId: { type: Schema.Types.ObjectId, ref: 'User' },
    candidateName: { type: String, required: true, trim: true },
    candidateEmail: { type: String, required: true, trim: true, lowercase: true },
    candidatePhone: { type: String, default: '' },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    jobTitle: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    companyName: { type: String, required: true },
    resumeUrl: { type: String, required: true },
    coverLetter: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
      default: 'Applied',
    },
    notes: { type: String, default: '' },
    appliedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ApplicationSchema.index({ jobId: 1, candidateEmail: 1 }, { unique: true });

export const Application = mongoose.model<IApplication>('Application', ApplicationSchema);

