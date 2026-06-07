import { Request, Response } from "express";
import { slideService } from "../services/slide.service";
import { toSlideDTO } from "../views/slide.view";
import {
  createSlideSchema,
  updateSlideSchema,
  reorderSlidesSchema,
} from "../validators/slide.validator";
import mongoose from "mongoose";

export class SlideController {
  // Create a new slide (Admin)
  async create(req: Request, res: Response): Promise<void> {
    try {
      const validation = createSlideSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          error: validation.error.errors[0].message,
        });
        return;
      }

      const slide = await slideService.create(validation.data);

      res.status(201).json({
        success: true,
        data: toSlideDTO(slide),
      });
    } catch (error) {
      console.error("Error creating slide:", error);
      res.status(500).json({
        success: false,
        error: "Greška pri kreiranju slajda",
      });
    }
  }

  // Get all slides (Admin)
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const location = req.query.location as "shop" | "corporate" | undefined;
      const slides = await slideService.getAll(location);

      res.json({
        success: true,
        data: slides.map(toSlideDTO),
      });
    } catch (error) {
      console.error("Error fetching slides:", error);
      res.status(500).json({
        success: false,
        error: "Greška pri dohvatanju slajdova",
      });
    }
  }

  // Get active slides by location (Public)
  async getActiveByLocation(req: Request, res: Response): Promise<void> {
    try {
      const location = req.params.location as "shop" | "corporate";

      if (!["shop", "corporate"].includes(location)) {
        res.status(400).json({
          success: false,
          error: "Nevažeća lokacija. Dozvoljene vrijednosti: shop, corporate",
        });
        return;
      }

      const slides = await slideService.getActiveByLocation(location);

      res.json({
        success: true,
        data: slides.map(toSlideDTO),
      });
    } catch (error) {
      console.error("Error fetching active slides:", error);
      res.status(500).json({
        success: false,
        error: "Greška pri dohvatanju slajdova",
      });
    }
  }

  // Get slide by ID (Admin)
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

      const slide = await slideService.getById(id);

      if (!slide) {
        res.status(404).json({
          success: false,
          error: "Slajd nije pronađen",
        });
        return;
      }

      res.json({
        success: true,
        data: toSlideDTO(slide),
      });
    } catch (error) {
      console.error("Error fetching slide:", error);
      res.status(500).json({
        success: false,
        error: "Greška pri dohvatanju slajda",
      });
    }
  }

  // Update a slide (Admin)
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

      const validation = updateSlideSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          error: validation.error.errors[0].message,
        });
        return;
      }

      const slide = await slideService.update(id, validation.data);

      if (!slide) {
        res.status(404).json({
          success: false,
          error: "Slajd nije pronađen",
        });
        return;
      }

      res.json({
        success: true,
        data: toSlideDTO(slide),
      });
    } catch (error) {
      console.error("Error updating slide:", error);
      res.status(500).json({
        success: false,
        error: "Greška pri ažuriranju slajda",
      });
    }
  }

  // Delete a slide (Admin)
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

      const slide = await slideService.delete(id);

      if (!slide) {
        res.status(404).json({
          success: false,
          error: "Slajd nije pronađen",
        });
        return;
      }

      res.json({
        success: true,
        message: "Slajd uspješno obrisan",
      });
    } catch (error) {
      console.error("Error deleting slide:", error);
      res.status(500).json({
        success: false,
        error: "Greška pri brisanju slajda",
      });
    }
  }

  // Reorder slides (Admin)
  async reorder(req: Request, res: Response): Promise<void> {
    try {
      const validation = reorderSlidesSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          error: validation.error.errors[0].message,
        });
        return;
      }

      await slideService.reorder(validation.data);

      res.json({
        success: true,
        message: "Redoslijed slajdova uspješno ažuriran",
      });
    } catch (error) {
      console.error("Error reordering slides:", error);
      res.status(500).json({
        success: false,
        error: "Greška pri promjeni redoslijeda slajdova",
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

      const slide = await slideService.toggleActive(id);

      if (!slide) {
        res.status(404).json({
          success: false,
          error: "Slajd nije pronađen",
        });
        return;
      }

      res.json({
        success: true,
        data: toSlideDTO(slide),
      });
    } catch (error) {
      console.error("Error toggling slide status:", error);
      res.status(500).json({
        success: false,
        error: "Greška pri promjeni statusa slajda",
      });
    }
  }
}

export const slideController = new SlideController();

