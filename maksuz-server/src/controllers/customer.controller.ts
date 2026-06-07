import { Response, NextFunction } from "express";
import { customerService } from "../services";
import { sendSuccess, sendPaginated, sendNotFound } from "../utils";
import { AuthenticatedRequest } from "./auth.controller";

class CustomerController {
  async getAll(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        page = "1",
        limit = "20",
        search,
        sortBy = "totalSpent",
        sortOrder = "desc",
      } = req.query;

      const { customers, total } = await customerService.getAll({
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        search: search as string | undefined,
        sortBy: sortBy as "totalSpent" | "orderCount" | "lastOrderDate",
        sortOrder: sortOrder as "asc" | "desc",
      });

      sendPaginated(
        res,
        customers,
        parseInt(page as string, 10),
        parseInt(limit as string, 10),
        total
      );
    } catch (error) {
      next(error);
    }
  }

  async getByEmail(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.params;

      const customer = await customerService.getByEmail(decodeURIComponent(email));

      if (!customer) {
        sendNotFound(res, "Kupac nije pronađen");
        return;
      }

      sendSuccess(res, customer);
    } catch (error) {
      next(error);
    }
  }
}

export const customerController = new CustomerController();

