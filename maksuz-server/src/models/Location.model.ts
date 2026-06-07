import { Schema, model, Document } from "mongoose";

export interface IWorkingHours {
  weekdays: string;
  saturday: string;
  sunday: string;
}

export interface ILocation extends Document {
  name: string;
  subtitle?: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  workingHours: IWorkingHours;
  image?: string;
  mapUrl?: string;
  features: string[];
  isHighlight: boolean;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const workingHoursSchema = new Schema<IWorkingHours>(
  {
    weekdays: {
      type: String,
      required: [true, "Radno vrijeme za radne dane je obavezno"],
      trim: true,
      default: "08:00 - 20:00",
    },
    saturday: {
      type: String,
      required: [true, "Radno vrijeme za subotu je obavezno"],
      trim: true,
      default: "08:00 - 16:00",
    },
    sunday: {
      type: String,
      required: [true, "Radno vrijeme za nedjelju je obavezno"],
      trim: true,
      default: "Zatvoreno",
    },
  },
  { _id: false }
);

const locationSchema = new Schema<ILocation>(
  {
    name: {
      type: String,
      required: [true, "Naziv poslovnice je obavezan"],
      trim: true,
      maxlength: [100, "Naziv ne može biti duži od 100 karaktera"],
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [50, "Podnaslov ne može biti duži od 50 karaktera"],
    },
    address: {
      type: String,
      required: [true, "Adresa je obavezna"],
      trim: true,
      maxlength: [200, "Adresa ne može biti duža od 200 karaktera"],
    },
    city: {
      type: String,
      required: [true, "Grad je obavezan"],
      trim: true,
      maxlength: [100, "Grad ne može biti duži od 100 karaktera"],
    },
    phone: {
      type: String,
      required: [true, "Telefon je obavezan"],
      trim: true,
      maxlength: [50, "Telefon ne može biti duži od 50 karaktera"],
    },
    email: {
      type: String,
      required: [true, "Email je obavezan"],
      trim: true,
      lowercase: true,
      maxlength: [100, "Email ne može biti duži od 100 karaktera"],
    },
    workingHours: {
      type: workingHoursSchema,
      required: true,
      default: () => ({
        weekdays: "08:00 - 20:00",
        saturday: "08:00 - 16:00",
        sunday: "Zatvoreno",
      }),
    },
    image: {
      type: String,
      trim: true,
    },
    mapUrl: {
      type: String,
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    isHighlight: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
locationSchema.index({ isActive: 1, order: 1 });

export const Location = model<ILocation>("Location", locationSchema);
