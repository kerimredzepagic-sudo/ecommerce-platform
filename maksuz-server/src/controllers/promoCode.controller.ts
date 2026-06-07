import { Request, Response, NextFunction } from "express";
import { promoCodeService } from "../services";
import { sendSuccess, sendCreated, sendError, sendPaginated, sendNotFound } from "../utils";
import { AuthenticatedRequest } from "./auth.controller";

class PromoCodeController {
  // Admin - create promo code
  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { code, type, value, minOrderAmount, maxUses, validFrom, validUntil } = req.body;

      if (!code || !type || value === undefined || !validFrom || !validUntil) {
        sendError(res, "Missing required fields", 400);
        return;
      }

      const promoCode = await promoCodeService.create({
        code,
        type,
        value,
        minOrderAmount,
        maxUses,
        validFrom: new Date(validFrom),
        validUntil: new Date(validUntil),
      });

      sendCreated(res, promoCode, "Promo kod uspješno kreiran");
    } catch (error) {
      if (error instanceof Error && error.message === "Promo code already exists") {
        sendError(res, "Promo kod već postoji", 400);
        return;
      }
      next(error);
    }
  }

  // Admin - get all promo codes
  async getAll(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page = "1", limit = "20", isActive } = req.query;

      const { promoCodes, total } = await promoCodeService.getAll({
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
      });

      sendPaginated(
        res,
        promoCodes,
        parseInt(page as string, 10),
        parseInt(limit as string, 10),
        total
      );
    } catch (error) {
      next(error);
    }
  }

  // Admin - get single promo code
  async getById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const promoCode = await promoCodeService.getById(id);

      if (!promoCode) {
        sendNotFound(res, "Promo kod nije pronađen");
        return;
      }

      sendSuccess(res, promoCode);
    } catch (error) {
      next(error);
    }
  }

  // Admin - get promo code with orders
  async getByIdWithOrders(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const promoCode = await promoCodeService.getByIdWithOrders(id);

      if (!promoCode) {
        sendNotFound(res, "Promo kod nije pronađen");
        return;
      }

      sendSuccess(res, promoCode);
    } catch (error) {
      next(error);
    }
  }

  // Admin - update promo code
  async update(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (updateData.validFrom) {
        updateData.validFrom = new Date(updateData.validFrom);
      }
      if (updateData.validUntil) {
        updateData.validUntil = new Date(updateData.validUntil);
      }

      const promoCode = await promoCodeService.update(id, updateData);

      if (!promoCode) {
        sendNotFound(res, "Promo kod nije pronađen");
        return;
      }

      sendSuccess(res, promoCode, "Promo kod uspješno ažuriran");
    } catch (error) {
      next(error);
    }
  }

  // Admin - delete promo code
  async delete(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await promoCodeService.delete(id);

      if (!deleted) {
        sendNotFound(res, "Promo kod nije pronađen");
        return;
      }

      sendSuccess(res, null, "Promo kod uspješno obrisan");
    } catch (error) {
      next(error);
    }
  }

  // Admin - toggle active status
  async toggleActive(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const promoCode = await promoCodeService.toggleActive(id);

      if (!promoCode) {
        sendNotFound(res, "Promo kod nije pronađen");
        return;
      }

      sendSuccess(res, promoCode, `Promo kod ${promoCode.isActive ? "aktiviran" : "deaktiviran"}`);
    } catch (error) {
      next(error);
    }
  }

  // Public - validate promo code
  async validate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { code, orderAmount } = req.body;

      if (!code) {
        sendError(res, "Promo kod je obavezan", 400);
        return;
      }

      const result = await promoCodeService.validateCode(code, orderAmount || 0);

      if (!result.valid) {
        sendError(res, result.error || "Nevažeći promo kod", 400);
        return;
      }

      sendSuccess(res, {
        valid: true,
        discount: result.discount,
        code: {
          code: result.code?.code,
          type: result.code?.type,
          value: result.code?.value,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const promoCodeController = new PromoCodeController();

