import mongoose, { Schema, Document, Model } from 'mongoose'

export type EmailStatus = 'sent' | 'skipped' | 'failed'

export interface IInquiry extends Document {
  name: string
  email: string
  projectType: string
  budgetRange: string
  message: string
  emailStatus: EmailStatus
  emailError?: string
  ip?: string
  createdAt: Date
  updatedAt: Date
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      maxlength: [150, 'Email cannot exceed 150 characters'],
    },
    projectType: {
      type: String,
      required: [true, 'Project type is required'],
      trim: true,
    },
    budgetRange: {
      type: String,
      required: [true, 'Budget range is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    emailStatus: {
      type: String,
      enum: ['sent', 'skipped', 'failed'],
      default: 'skipped',
    },
    emailError: {
      type: String,
      default: '',
    },
    ip: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

export const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema)
