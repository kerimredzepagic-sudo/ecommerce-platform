import mongoose, { Document, Schema } from "mongoose";

export interface IEmailChangeRequest extends Document {
  userId: mongoose.Types.ObjectId;
  currentEmail: string;
  newEmail: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const emailChangeRequestSchema = new Schema<IEmailChangeRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    currentEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    newEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index - document deleted when expiresAt is reached
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient lookups
emailChangeRequestSchema.index({ userId: 1, newEmail: 1 });

export const EmailChangeRequest = mongoose.model<IEmailChangeRequest>(
  "EmailChangeRequest",
  emailChangeRequestSchema
);

