import mongoose, { Document, Schema } from "mongoose";

// Product image with metadata
export interface IProductImage {
  url: string;
  alt?: string;
  isPrimary: boolean;
}

// Product variant
export interface IProductVariant {
  id: string;
  name: string;
  sku?: string;
  price?: number;
  stock: number;
  attributes: Array<{ key: string; value: string }>;
  images: string[];
}

// Nutritional value entry
export interface INutritionalValue {
  name: string;
  value: string;
  unit?: string;
}

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;

  // Pricing
  price: number;
  compareAtPrice?: number;
  saleStartDate?: Date;
  saleEndDate?: Date;

  // Organization
  category: mongoose.Types.ObjectId;
  tags: string[];
  brand?: string;
  line?: "originals" | "premium" | "health" | "energy";

  // Media
  images: IProductImage[];

  // Inventory
  sku?: string;
  barcode?: string; // GTIN, UPC, EAN, ISBN
  stock: number;
  trackInventory: boolean;
  lowStockThreshold: number;
  allowBackorder: boolean;

  // Tax
  taxStatus?: "taxable" | "shipping" | "none";
  taxClass?: string;

  // Nutritional Information (for food products)
  nutritionalValues: INutritionalValue[];
  nutritionalInfo?: string; // Rich text HTML content for nutritional information

  // Status
  isActive: boolean;
  isFeatured: boolean;

  // Shipping
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };

  // Variants
  variants: IProductVariant[];
  hasVariants: boolean;

  // Custom attributes
  attributes: Map<string, string>;

  // SEO
  metaTitle?: string;
  metaDescription?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const productImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    alt: { type: String },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

const productVariantSchema = new Schema<IProductVariant>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    sku: { type: String },
    price: { type: Number },
    stock: { type: Number, default: 0 },
    attributes: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    images: [{ type: String }],
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Naziv proizvoda je obavezan"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug proizvoda je obavezan"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Opis proizvoda je obavezan"],
    },
    shortDescription: {
      type: String,
      trim: true,
    },

    // Pricing
    price: {
      type: Number,
      required: [true, "Cijena proizvoda je obavezna"],
      min: [0, "Cijena ne može biti negativna"],
    },
    compareAtPrice: {
      type: Number,
      min: [0, "Stara cijena ne može biti negativna"],
    },
    saleStartDate: {
      type: Date,
    },
    saleEndDate: {
      type: Date,
    },

    // Organization
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Kategorija proizvoda je obavezna"],
    },
    tags: {
      type: [String],
      default: [],
    },
    brand: {
      type: String,
      trim: true,
    },
    line: {
      type: String,
      enum: ["originals", "premium", "health", "energy"],
      default: null,
    },

    // Media
    images: {
      type: [productImageSchema],
      default: [],
    },

    // Inventory
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    barcode: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Zaliha ne može biti negativna"],
    },
    trackInventory: {
      type: Boolean,
      default: true,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },
    allowBackorder: {
      type: Boolean,
      default: false,
    },

    // Tax
    taxStatus: {
      type: String,
      enum: ["taxable", "shipping", "none"],
      default: "taxable",
    },
    taxClass: {
      type: String,
      trim: true,
    },

    // Nutritional Information
    nutritionalValues: {
      type: [
        {
          name: { type: String, required: true },
          value: { type: String, required: true },
          unit: { type: String },
        },
      ],
      default: [],
    },
    // Nutritional Information (Rich Text)
    nutritionalInfo: {
      type: String,
      trim: true,
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Shipping
    weight: {
      type: Number,
      min: [0, "Težina ne može biti negativna"],
    },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
    },

    // Variants
    variants: {
      type: [productVariantSchema],
      default: [],
    },
    hasVariants: {
      type: Boolean,
      default: false,
    },

    // Custom attributes
    attributes: {
      type: Map,
      of: String,
      default: new Map(),
    },

    // SEO
    metaTitle: {
      type: String,
      maxlength: [60, "Meta naslov može imati maksimalno 60 karaktera"],
    },
    metaDescription: {
      type: String,
      maxlength: [160, "Meta opis može imati maksimalno 160 karaktera"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ line: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ isActive: 1, line: 1 });
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ saleStartDate: 1, saleEndDate: 1 });

// Virtual for checking if product is on sale
productSchema.virtual("isOnSale").get(function () {
  if (!this.compareAtPrice || this.compareAtPrice <= this.price) {
    return false;
  }

  const now = new Date();

  // If sale dates are set, check if we're within the sale period
  if (this.saleStartDate && now < this.saleStartDate) {
    return false;
  }
  if (this.saleEndDate && now > this.saleEndDate) {
    return false;
  }

  return true;
});

// Virtual for discount percentage
productSchema.virtual("discountPercentage").get(function () {
  if (!this.compareAtPrice || this.compareAtPrice <= this.price) {
    return 0;
  }
  return Math.round(
    ((this.compareAtPrice - this.price) / this.compareAtPrice) * 100
  );
});

// Virtual for total stock (including variants)
productSchema.virtual("totalStock").get(function () {
  if (this.hasVariants && this.variants.length > 0) {
    return this.variants.reduce((sum, variant) => sum + variant.stock, 0);
  }
  return this.stock;
});

// Virtual for primary image URL
productSchema.virtual("primaryImage").get(function () {
  const primary = this.images.find((img) => img.isPrimary);
  if (primary) return primary.url;
  if (this.images.length > 0) return this.images[0].url;
  return null;
});

// Ensure virtuals are included in JSON
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

export const Product = mongoose.model<IProduct>("Product", productSchema);
