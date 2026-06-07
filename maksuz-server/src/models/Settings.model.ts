import mongoose, { Document, Schema } from "mongoose";

export interface ISettings extends Document {
  key: string;
  value: Record<string, unknown>;
  updatedAt: Date;
  createdAt: Date;
}

export interface ShippingSettings {
  flatRate: number;
  freeShippingThreshold: number;
  taxRate: number;
}

const settingsSchema = new Schema<ISettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick lookups
settingsSchema.index({ key: 1 });

export const Settings = mongoose.model<ISettings>("Settings", settingsSchema);

// Default shipping settings
export const DEFAULT_SHIPPING_SETTINGS: ShippingSettings = {
  flatRate: 5,
  freeShippingThreshold: 50,
  taxRate: 0.17,
};

