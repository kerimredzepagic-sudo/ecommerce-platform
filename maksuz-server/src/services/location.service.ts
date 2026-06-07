import { Location, ILocation } from "../models/Location.model";
import {
  CreateLocationInput,
  UpdateLocationInput,
  ReorderLocationsInput,
} from "../validators/location.validator";
import mongoose from "mongoose";

export class LocationService {
  // Create a new location
  async create(data: CreateLocationInput): Promise<ILocation> {
    // Get the highest order number
    const maxOrderLocation = await Location.findOne()
      .sort({ order: -1 })
      .select("order");

    const order = data.order ?? (maxOrderLocation ? maxOrderLocation.order + 1 : 0);

    const location = new Location({
      ...data,
      order,
    });

    return location.save();
  }

  // Get all locations (admin)
  async getAll(): Promise<ILocation[]> {
    return Location.find().sort({ order: 1 });
  }

  // Get active locations (public)
  async getActive(): Promise<ILocation[]> {
    return Location.find({ isActive: true }).sort({ order: 1 });
  }

  // Get location by ID
  async getById(id: string): Promise<ILocation | null> {
    return Location.findById(id);
  }

  // Update a location
  async update(id: string, data: UpdateLocationInput): Promise<ILocation | null> {
    return Location.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  // Delete a location
  async delete(id: string): Promise<ILocation | null> {
    return Location.findByIdAndDelete(id);
  }

  // Reorder locations
  async reorder(data: ReorderLocationsInput): Promise<void> {
    const bulkOps = data.locations.map((item) => ({
      updateOne: {
        filter: { _id: new mongoose.Types.ObjectId(item.id) },
        update: { $set: { order: item.order } },
      },
    }));

    await Location.bulkWrite(bulkOps);
  }

  // Toggle active status
  async toggleActive(id: string): Promise<ILocation | null> {
    const location = await Location.findById(id);
    if (!location) return null;

    location.isActive = !location.isActive;
    return location.save();
  }

  // Toggle highlight status
  async toggleHighlight(id: string): Promise<ILocation | null> {
    const location = await Location.findById(id);
    if (!location) return null;

    location.isHighlight = !location.isHighlight;
    return location.save();
  }
}

export const locationService = new LocationService();
