import mongoose, { Document, Schema } from 'mongoose';

export interface IBlogPost extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: mongoose.Types.ObjectId;
  category?: mongoose.Types.ObjectId;
  tags: string[];
  
  // SEO Fields
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  
  // Publishing
  isPublished: boolean;
  publishedAt?: Date;
  scheduledAt?: Date;
  isFeatured: boolean;
  allowComments: boolean;
  
  // Engagement
  views: number;
  readingTime?: number;
  relatedPosts?: mongoose.Types.ObjectId[];
  
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, 'Blog post title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Blog post slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Blog post excerpt is required'],
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Blog post content is required'],
    },
    coverImage: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'BlogCategory',
    },
    tags: {
      type: [String],
      default: [],
    },
    
    // SEO Fields
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title cannot exceed 60 characters'],
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters'],
    },
    canonicalUrl: {
      type: String,
      trim: true,
    },
    ogImage: {
      type: String,
    },
    
    // Publishing
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    scheduledAt: {
      type: Date,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    allowComments: {
      type: Boolean,
      default: true,
    },
    
    // Engagement
    views: {
      type: Number,
      default: 0,
    },
    readingTime: {
      type: Number,
    },
    relatedPosts: [{
      type: Schema.Types.ObjectId,
      ref: 'BlogPost',
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ isPublished: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1 });
blogPostSchema.index({ tags: 1 });
blogPostSchema.index({ isFeatured: 1 });
blogPostSchema.index({ scheduledAt: 1 });
blogPostSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Calculate reading time before saving (words / 200 WPM)
blogPostSchema.pre('save', function (next) {
  // Calculate reading time
  if (this.isModified('content')) {
    const wordCount = this.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
    this.readingTime = Math.max(1, Math.ceil(wordCount / 200));
  }
  
  // Set publishedAt when publishing
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

export const BlogPost = mongoose.model<IBlogPost>('BlogPost', blogPostSchema);
