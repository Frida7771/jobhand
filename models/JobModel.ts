import mongoose, { Schema } from 'mongoose';
import { IJob } from '../types/index.js';

const JobSchema = new Schema<IJob>(
  {
    company: {
      type: String,
      required: [true, 'company name is required'],
      maxlength: [50, 'company name cannot be more than 50 characters'],
    },
    position: {
      type: String,
      required: [true, 'position is required'],
      maxlength: [100, 'position cannot be more than 100 characters'],
    },
    jobLocation: {
      type: String,
      required: [true, 'job location is required'],
      default: 'my city',
    },
    jobStatus: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'internship'],
      default: 'full-time',
    },
    createdBy: {
      type: String,
      required: [true, 'createdBy is required'],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IJob>('Job', JobSchema);
