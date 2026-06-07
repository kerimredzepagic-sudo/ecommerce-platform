import { Schema, model, Document } from "mongoose";

export interface ISlide extends Document {
  title: string;
  subtitle?: string;
  description?: string;
  headTitle?: string; // Orange text above title (e.g., "NOVO U PONUDI.")
  backgroundType: "image" | "video";
  backgroundUrl: string;
  buttonPrimaryText?: string;
  buttonPrimaryLink?: string;
  buttonSecondaryText?: string;
  buttonSecondaryLink?: string;
  order: number;
  isActive: boolean;
  location: "shop" | "corporate";
  createdAt: Date;
  updatedAt: Date;
}

const slideSchema = new Schema<ISlide>(
  {
    title: {
      type: String,
      required: [true, "Naslov je obavezan"],
      trim: true,
      maxlength: [200, "Naslov ne može biti duži od 200 karaktera"],
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [300, "Podnaslov ne može biti duži od 300 karaktera"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Opis ne može biti duži od 500 karaktera"],
    },
    headTitle: {
      type: String,
      trim: true,
      maxlength: [100, "Gornji naslov ne može biti duži od 100 karaktera"],
    },
    backgroundType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
      required: true,
    },
    backgroundUrl: {
      type: String,
      required: [true, "Pozadinska slika ili video je obavezan"],
      trim: true,
    },
    buttonPrimaryText: {
      type: String,
      trim: true,
      maxlength: [50, "Tekst primarnog dugmeta ne može biti duži od 50 karaktera"],
    },
    buttonPrimaryLink: {
      type: String,
      trim: true,
    },
    buttonSecondaryText: {
      type: String,
      trim: true,
      maxlength: [50, "Tekst sekundarnog dugmeta ne može biti duži od 50 karaktera"],
    },
    buttonSecondaryLink: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    location: {
      type: String,
      enum: ["shop", "corporate"],
      default: "shop",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
slideSchema.index({ location: 1, isActive: 1, order: 1 });

export const Slide = model<ISlide>("Slide", slideSchema);

