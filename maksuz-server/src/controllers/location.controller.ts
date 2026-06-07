import { Request, Response } from "express";
import { locationService } from "../services/location.service";
import { toLocationDTO } from "../views/location.view";
import {
  createLocationSchema,
  updateLocationSchema,
  reorderLocationsSchema,
} from "../validators/location.validator";
import mongoose from "mongoose";

export class LocationController {
  // Create a new location (Admin)
  async create(req: Request, res: Response): Promise<void> {
    try {
      const validation = createLocationSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          error: validation.error.errors[0].message,
        });
        return;
      }

      const location = await locationService.create(validation.data);

      res.status(201).json({
        success: true,
        data: toLocationDTO(location),
      });
    } catch (error) {
      console.error("Error creating location:", error);
      res.status(500).json({
        success: false,
        error: "Greška pri kreiranju poslovnice",
      });
    }
  }

  // Get all locations (Admin)
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const locations = await locationService.getAll();

      res.json({
        success: true,
        data: locations.map(toLocationDTO),
      });
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({
        success: false,
        error: "Greška pri dohvatanju poslovnica",
      });
    }
  }

  // Get active locations (Public)
  async getActive(req: Request, res: Response): Promise<void> {
    try {
      const locations = await locationService.getActive();

      res.json({
        success: true,
        data: locations.map(toLocationDTO),
      });
    } catch (error) {
      console.error("Error fetching active locations:", error);
      res.status(500).json({
        success: false,
        error: "Greška pri dohvatanju poslovnica",
      });
    }
  }

  // Get location by ID (Admin)
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          error: "Nevažeći ID format",
        });
        return;
      }

      const location = await locationService.getById(id);

      if (!location) {
        res.status(404).json({
          success: false,
          error: "Poslovnica nije pronađena",
        });
        return;
      }

      res.json({
        success: true,
        data: toLocationDTO(location),
      });
    } catch (error) {
      console.error("Error fetching location:", error);
      res.status(500).json({
        success: false,
        error: "Greška pri dohvatanju poslovnice",
      });
    }
  }

  // Update a location (Admin)
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          error: "Nevažeći ID format",
        });
        return;
      }

      const validation = updateLocationSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          error: validation.error.errors[0].message,
        });
        return;
      }

      const location = await locationService.update(id, validation.data);

      if (!location) {
        res.status(404).json({
          success: false,
          error: "Poslovnica nije pronađena",
        });
        return;
      }

      res.json({
        success: true,
        data: toLocationDTO(location),
      });
    } catch (error) {
      console.error("Error updating location:", error);
      res.status(500).json({
        success: false,
        error: "Greška pri ažuriranju poslovnice",
      });
    }
  }

  // Delete a location (Admin)
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          error: "Nevažeći ID format",
        });
        return;
      }

      const location = await locationService.delete(id);

      if (!location) {
        res.status(404).json({
          success: false,
          error: "Poslovnica nije pronađena",
        });
        return;
      }

      res.json({
        success: true,
        message: "Poslovnica uspješno obrisana",
      });
    } catch (error) {
      console.error("Error deleting location:", error);
      res.status(500).json({
        success: false,
        error: "Greška pri brisanju poslovnice",
      });
    }
  }

  // Reorder locations (Admin)
  async reorder(req: Request, res: Response): Promise<void> {
    try {
      const validation = reorderLocationsSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          error: validation.error.errors[0].message,
        });
        return;
      }

      await locationService.reorder(validation.data);

      res.json({
        success: true,
        message: "Redoslijed poslovnica uspješno ažuriran",
      });
    } catch (error) {
      console.error("Error reordering locations:", error);
      res.status(500).json({
        success: false,
        error: "Greška pri promjeni redoslijeda poslovnica",
      });
    }
  }

  // Toggle active status (Admin)
  async toggleActive(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          error: "Nevažeći ID format",
        });
        return;
      }

      const location = await locationService.toggleActive(id);

      if (!location) {
        res.status(404).json({
          success: false,
          error: "Poslovnica nije pronađena",
        });
        return;
      }

      res.json({
        success: true,
        data: toLocationDTO(location),
      });
    } catch (error) {
      console.error("Error toggling location status:", error);
      res.status(500).json({
        success: false,
        error: "Greška pri promjeni statusa poslovnice",
      });
    }
  }

  // Toggle highlight status (Admin)
  async toggleHighlight(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          error: "Nevažeći ID format",
        });
        return;
      }

      const location = await locationService.toggleHighlight(id);

      if (!location) {
        res.status(404).json({
          success: false,
          error: "Poslovnica nije pronađena",
        });
        return;
      }

      res.json({
        success: true,
        data: toLocationDTO(location),
      });
    } catch (error) {
      console.error("Error toggling location highlight:", error);
      res.status(500).json({
        success: false,
        error: "Greška pri promjeni istaknutosti poslovnice",
      });
    }
  }
}

export const locationController = new LocationController();
