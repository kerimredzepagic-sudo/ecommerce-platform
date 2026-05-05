import mongoose, { Document, Schema } from "mongoose";

export type PromoCodeType = "percentage" | "fixed" | "free_shipping";

export interface IPromoCode extends Document {
  code: string;
  type: PromoCodeType;
  value: number;
  minOrderAmount: number;
  maxUses: number | null;
  usedCount: number;
  usedInOrders: mongoose.Types.ObjectId[];
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const promoCodeSchema = new Schema<IPromoCode>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["percentage", "fixed", "free_shipping"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxUses: {
      type: Number,
      default: null,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    usedInOrders: [{
      type: Schema.Types.ObjectId,
      ref: 'Order',
    }],
    validFrom: {
      type: Date,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

promoCodeSchema.index({ code: 1 });
promoCodeSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });

export const PromoCode = mongoose.model<IPromoCode>("PromoCode", promoCodeSchema);
