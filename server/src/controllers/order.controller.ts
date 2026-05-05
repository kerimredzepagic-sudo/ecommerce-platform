import { Request, Response, NextFunction } from "express";
import { orderService } from "../services";
import { toOrderDTO, toOrderListDTOs } from "../views";
import { sendSuccess, sendCreated, sendError, sendPaginated, sendNotFound } from "../utils";
import { AuthenticatedRequest } from "./auth.controller";

class OrderController {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) { sendError(res, "Unauthorized", 401); return; }
      const order = await orderService.create(req.user.userId, req.body);
      sendCreated(res, toOrderDTO(order), "Order created successfully");
    } catch (error) { next(error); }
  }

  async getUserOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) { sendError(res, "Unauthorized", 401); return; }
      const { page = "1", limit = "10", status } = req.query;
      const { orders, total } = await orderService.getUserOrders(req.user.userId, {
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        status: status as any,
      });
      sendPaginated(res, toOrderListDTOs(orders), parseInt(page as string, 10), parseInt(limit as string, 10), total);
    } catch (error) { next(error); }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const order = await orderService.getById(id);
      if (!order) { sendNotFound(res, "Order not found"); return; }
      if (req.user?.role !== "admin" && order.user?._id.toString() !== req.user?.userId) {
        sendError(res, "Forbidden", 403); return;
      }
      sendSuccess(res, toOrderDTO(order));
    } catch (error) { next(error); }
  }

  async getAllOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = "1", limit = "20", status } = req.query;
      const { orders, total } = await orderService.getAllOrders({
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        status: status as any,
      });
      sendPaginated(res, toOrderListDTOs(orders), parseInt(page as string, 10), parseInt(limit as string, 10), total);
    } catch (error) { next(error); }
  }

  async getAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const analytics = await orderService.getOrderAnalytics();
      sendSuccess(res, analytics);
    } catch (error) { next(error); }
  }

  async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await orderService.updateStatus(id, status);
      if (!order) { sendNotFound(res, "Order not found"); return; }
      sendSuccess(res, toOrderDTO(order), "Order status updated successfully");
    } catch (error) { next(error); }
  }

  async updatePaymentStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { paymentStatus } = req.body;
      const order = await orderService.updatePaymentStatus(id, paymentStatus);
      if (!order) { sendNotFound(res, "Order not found"); return; }
      sendSuccess(res, toOrderDTO(order), "Payment status updated successfully");
    } catch (error) { next(error); }
  }

  async updateTracking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { trackingNumber } = req.body;
      const order = await orderService.updateTracking(id, trackingNumber);
      if (!order) { sendNotFound(res, "Order not found"); return; }
      sendSuccess(res, toOrderDTO(order), "Tracking number updated successfully");
    } catch (error) { next(error); }
  }

  async cancelOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const existingOrder = await orderService.getById(id);
      if (!existingOrder) { sendNotFound(res, "Order not found"); return; }
      if (req.user?.role !== "admin" && existingOrder.user?.toString() !== req.user?.userId) {
        sendError(res, "Forbidden", 403); return;
      }
      const order = await orderService.cancelOrder(id);
      if (!order) { sendNotFound(res, "Order not found"); return; }
      sendSuccess(res, toOrderDTO(order), "Order cancelled successfully");
    } catch (error) { next(error); }
  }

  async createGuestOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await orderService.createGuestOrder(req.body);
      sendCreated(res, { orderNumber: order.orderNumber, status: order.status, total: order.total, createdAt: order.createdAt }, "Order created successfully");
    } catch (error) { next(error); }
  }

  async trackOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderNumber } = req.params;
      const orderInfo = await orderService.getByOrderNumberPublic(orderNumber);
      if (!orderInfo) { sendNotFound(res, "Order not found"); return; }
      sendSuccess(res, orderInfo);
    } catch (error) { next(error); }
  }
}

export const orderController = new OrderController();
