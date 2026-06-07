import { Request, Response, NextFunction } from "express";
import { settingsService } from "../services";
import { sendSuccess, sendError } from "../utils";
import { AuthenticatedRequest } from "./auth.controller";

class SettingsController {
  // Public - get shipping settings for checkout
  async getShippingSettings(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const settings = await settingsService.getShippingSettings();
      sendSuccess(res, settings);
    } catch (error) {
      next(error);
    }
  }

  // Admin only - update shipping settings
  async updateShippingSettings(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { flatRate, freeShippingThreshold, taxRate } = req.body;

      // Validate input
      if (flatRate !== undefined && (typeof flatRate !== "number" || flatRate < 0)) {
        sendError(res, "Flat rate must be a positive number", 400);
        return;
      }

      if (freeShippingThreshold !== undefined && (typeof freeShippingThreshold !== "number" || freeShippingThreshold < 0)) {
        sendError(res, "Free shipping threshold must be a positive number", 400);
        return;
      }

      if (taxRate !== undefined && (typeof taxRate !== "number" || taxRate < 0 || taxRate > 1)) {
        sendError(res, "Tax rate must be between 0 and 1", 400);
        return;
      }

      const settings = await settingsService.updateShippingSettings({
        flatRate,
        freeShippingThreshold,
        taxRate,
      });

      sendSuccess(res, settings, "Shipping settings updated successfully");
    } catch (error) {
      next(error);
    }
  }
}

export const settingsController = new SettingsController();

