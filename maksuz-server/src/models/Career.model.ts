import mongoose, { Document, Schema } from 'mongoose';

export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship';

export interface ICareer extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  shortDescription: string;
  fullDescription: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  coverImage?: string;
  isActive: boolean;
  isFeatured: boolean;
  publishedAt?: Date;
  expiresAt?: Date;
  metaTitle?: string;
  metaDescription?: string;
  order: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const careerSchema = new Schema<ICareer>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      default: 'full-time',
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },
    fullDescription: {
      type: String,
      required: [true, 'Full description is required'],
    },
    requirements: {
      type: [String],
      default: [],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title cannot exceed 60 characters'],
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters'],
    },
    order: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
careerSchema.index({ slug: 1 });
careerSchema.index({ isActive: 1, publishedAt: -1 });
careerSchema.index({ department: 1 });
careerSchema.index({ location: 1 });
careerSchema.index({ employmentType: 1 });
careerSchema.index({ isFeatured: 1 });
careerSchema.index({ order: 1 });
careerSchema.index({ title: 'text', shortDescription: 'text', fullDescription: 'text' });

// Set publishedAt when activating
careerSchema.pre('save', function (next) {
  if (this.isModified('isActive') && this.isActive && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export const Career = mongoose.model<ICareer>('Career', careerSchema);
