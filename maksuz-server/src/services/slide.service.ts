import { Slide, ISlide } from "../models/Slide.model";
import {
  CreateSlideInput,
  UpdateSlideInput,
  ReorderSlidesInput,
} from "../validators/slide.validator";
import mongoose from "mongoose";

export class SlideService {
  // Create a new slide
  async create(data: CreateSlideInput): Promise<ISlide> {
    // Get the highest order number for this location
    const maxOrderSlide = await Slide.findOne({ location: data.location })
      .sort({ order: -1 })
      .select("order");

    const order = data.order ?? (maxOrderSlide ? maxOrderSlide.order + 1 : 0);

    const slide = new Slide({
      ...data,
      order,
    });

    return slide.save();
  }

  // Get all slides (admin)
  async getAll(location?: "shop" | "corporate"): Promise<ISlide[]> {
    const query = location ? { location } : {};
    return Slide.find(query).sort({ order: 1 });
  }

  // Get active slides by location (public)
  async getActiveByLocation(location: "shop" | "corporate"): Promise<ISlide[]> {
    return Slide.find({ location, isActive: true }).sort({ order: 1 });
  }

  // Get slide by ID
  async getById(id: string): Promise<ISlide | null> {
    return Slide.findById(id);
  }

  // Update a slide
  async update(id: string, data: UpdateSlideInput): Promise<ISlide | null> {
    return Slide.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  // Delete a slide
  async delete(id: string): Promise<ISlide | null> {
    return Slide.findByIdAndDelete(id);
  }

  // Reorder slides
  async reorder(data: ReorderSlidesInput): Promise<void> {
    const bulkOps = data.slides.map((item) => ({
      updateOne: {
        filter: { _id: new mongoose.Types.ObjectId(item.id) },
        update: { $set: { order: item.order } },
      },
    }));

    await Slide.bulkWrite(bulkOps);
  }

  // Toggle active status
  async toggleActive(id: string): Promise<ISlide | null> {
    const slide = await Slide.findById(id);
    if (!slide) return null;

    slide.isActive = !slide.isActive;
    return slide.save();
  }
}

export const slideService = new SlideService();

