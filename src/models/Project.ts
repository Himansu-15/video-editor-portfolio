import mongoose, { Schema, Document, Model } from 'mongoose'

import { CRAFT_ENUM, type CraftType } from '@/lib/validations/project'
export { CRAFT_ENUM, type CraftType }

export interface IProject extends Document {
  title: string
  slug: string
  category: string
  location: string
  craft: CraftType[]
  role: string
  client: string
  year: number
  description: string
  youtubeId: string
  thumbnail: string
  previewLoopUrl?: string
  beforeAfter?: {
    before?: string
    after?: string
  }
  tools: string[]
  featured: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    craft: {
      type: [
        {
          type: String,
          enum: {
            values: CRAFT_ENUM,
            message: '{VALUE} is not a supported craft type',
          },
        },
      ],
      required: [true, 'At least one craft must be specified'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'At least one craft must be specified',
      },
      index: true,
    },
    role: {
      type: String,
      default: 'Editor, Colorist, Motion Designer',
      trim: true,
    },
    client: {
      type: String,
      default: '',
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      default: () => new Date().getFullYear(),
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    youtubeId: {
      type: String,
      required: [true, 'YouTube ID is required'],
      trim: true,
    },
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail URL is required'],
      trim: true,
    },
    previewLoopUrl: {
      type: String,
      trim: true,
    },
    beforeAfter: {
      before: { type: String, trim: true },
      after: { type: String, trim: true },
    },
    tools: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)
