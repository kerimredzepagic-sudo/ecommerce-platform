import mongoose from "mongoose";
import { Order, IOrder, IOrderItem, Product, PromoCode, User } from "../models";
import { ApiError } from "../middleware/error.middleware";

export interface CreateOrderInput {
  items: Array<{ productId: string; quantity: number }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  notes?: string;
  promoCode?: string;
}

export interface CreateGuestOrderInput extends CreateOrderInput {
  guestEmail: string;
  guestName: string;
}

export interface OrderQuery {
  page?: number;
  limit?: number;
  status?: IOrder["status"];
  userId?: string;
}

class OrderService {
  private async validateAndApplyPromoCode(
    code: string,
    subtotal: number,
  ): Promise<{ code: string; type: string; value: number; discountAmount: number } | null> {
    const promoCode = await PromoCode.findOne({ code: code.toUpperCase(), isActive: true });
    if (!promoCode) return null;

    const now = new Date();
    if (now < promoCode.validFrom || now > promoCode.validUntil) return null;
    if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) return null;
    if (subtotal < promoCode.minOrderAmount) return null;

    let discountAmount = 0;
    if (promoCode.type === "percentage") {
      discountAmount = subtotal * (promoCode.value / 100);
    } else if (promoCode.type === "fixed") {
      discountAmount = Math.min(promoCode.value, subtotal);
    }

    return { code: promoCode.code, type: promoCode.type, value: promoCode.value, discountAmount };
  }

  async create(userId: string, input: CreateOrderInput): Promise<IOrder> {
    const productIds = input.items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      throw new ApiError("One or more products not found", 400);
    }

    const orderItems: IOrderItem[] = [];
    let subtotal = 0;

    for (const item of input.items) {
      const product = products.find((p) => p._id.toString() === item.productId);
      if (!product) continue;

      if (!product.allowBackorder && product.trackInventory && product.stock < item.quantity) {
        throw new ApiError(`Insufficient stock for "${product.name}". Available: ${product.stock}`, 400);
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0]?.url,
      });

      subtotal += product.price * item.quantity;
    }

    let appliedPromo: any = null;
    if (input.promoCode) {
      appliedPromo = await this.validateAndApplyPromoCode(input.promoCode, subtotal);
    }

    let shipping = subtotal >= 50 ? 0 : 5;
    if (appliedPromo?.type === "free_shipping") shipping = 0;

    const discountAmount = appliedPromo?.discountAmount || 0;
    const tax = (subtotal - discountAmount) * 0.17;
    const total = subtotal - discountAmount + shipping + tax;

    const order = await Order.create({
      user: userId,
      items: orderItems,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress: input.shippingAddress,
      billingAddress: input.billingAddress,
      paymentMethod: input.paymentMethod,
      notes: input.notes,
      promoCode: appliedPromo ? { code: appliedPromo.code, type: appliedPromo.type, value: appliedPromo.value, discountAmount: appliedPromo.discountAmount } : undefined,
    });

    if (appliedPromo) {
      await PromoCode.findOneAndUpdate(
        { code: appliedPromo.code.toUpperCase() },
        { $inc: { usedCount: 1 }, $push: { usedInOrders: order._id } },
      );
    }

    for (const item of input.items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    return order.populate("user", "firstName lastName email");
  }

  async createGuestOrder(input: CreateGuestOrderInput): Promise<IOrder> {
    const productIds = input.items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      throw new ApiError("One or more products not found", 400);
    }

    const orderItems: IOrderItem[] = [];
    let subtotal = 0;

    for (const item of input.items) {
      const product = products.find((p) => p._id.toString() === item.productId);
      if (!product) continue;

      if (!product.allowBackorder && product.trackInventory && product.stock < item.quantity) {
        throw new ApiError(`Insufficient stock for "${product.name}". Available: ${product.stock}`, 400);
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0]?.url,
      });

      subtotal += product.price * item.quantity;
    }

    let appliedPromo: any = null;
    if (input.promoCode) {
      appliedPromo = await this.validateAndApplyPromoCode(input.promoCode, subtotal);
    }

    let shipping = subtotal >= 50 ? 0 : 5;
    if (appliedPromo?.type === "free_shipping") shipping = 0;

    const discountAmount = appliedPromo?.discountAmount || 0;
    const tax = (subtotal - discountAmount) * 0.17;
    const total = subtotal - discountAmount + shipping + tax;

    const order = await Order.create({
      guestEmail: input.guestEmail,
      guestName: input.guestName,
      items: orderItems,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress: input.shippingAddress,
      billingAddress: input.billingAddress,
      paymentMethod: input.paymentMethod,
      notes: input.notes,
      promoCode: appliedPromo ? { code: appliedPromo.code, type: appliedPromo.type, value: appliedPromo.value, discountAmount: appliedPromo.discountAmount } : undefined,
    });

    if (appliedPromo) {
      await PromoCode.findOneAndUpdate(
        { code: appliedPromo.code.toUpperCase() },
        { $inc: { usedCount: 1 }, $push: { usedInOrders: order._id } },
      );
    }

    for (const item of input.items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    return order;
  }

  async getById(id: string): Promise<IOrder | null> {
    return Order.findById(id)
      .populate("user", "firstName lastName email")
      .populate("items.product", "name slug images");
  }

  async getByOrderNumber(orderNumber: string): Promise<IOrder | null> {
    return Order.findOne({ orderNumber })
      .populate("user", "firstName lastName email")
      .populate("items.product", "name slug images");
  }

  async getUserOrders(userId: string, query: OrderQuery): Promise<{ orders: IOrder[]; total: number }> {
    const { page = 1, limit = 10, status } = query;
    const filter: Record<string, unknown> = { user: userId };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(filter).populate("items.product", "name slug images").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);

    return { orders, total };
  }

  async getAllOrders(query: OrderQuery): Promise<{ orders: IOrder[]; total: number }> {
    const { page = 1, limit = 20, status } = query;
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(filter).populate("user", "firstName lastName email").populate("items.product", "name slug images").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);

    return { orders, total };
  }

  async updateStatus(id: string, status: IOrder["status"]): Promise<IOrder | null> {
    return Order.findByIdAndUpdate(id, { status }, { new: true })
      .populate("user", "firstName lastName email")
      .populate("items.product", "name slug images");
  }

  async updatePaymentStatus(id: string, paymentStatus: IOrder["paymentStatus"]): Promise<IOrder | null> {
    const updateData: Record<string, unknown> = { paymentStatus };
    if (paymentStatus === "paid") updateData.status = "confirmed";

    return Order.findByIdAndUpdate(id, updateData, { new: true })
      .populate("user", "firstName lastName email")
      .populate("items.product", "name slug images");
  }

  async updateTracking(id: string, trackingNumber: string): Promise<IOrder | null> {
    return Order.findByIdAndUpdate(id, { trackingNumber }, { new: true })
      .populate("user", "firstName lastName email");
  }

  async cancelOrder(id: string): Promise<IOrder | null> {
    const order = await Order.findById(id);
    if (!order) return null;

    if (["shipped", "delivered"].includes(order.status)) {
      throw new ApiError("Cannot cancel an order that has been shipped or delivered", 400);
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }

    order.status = "cancelled";
    await order.save();

    return order.populate("user", "firstName lastName email");
  }

  async getOrderAnalytics(): Promise<any> {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [todayStats, monthStats, allTimeStats, ordersByStatus] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfToday }, status: { $ne: "cancelled" } } },
        { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfMonth }, status: { $ne: "cancelled" } } },
        { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 }, value: { $sum: "$total" } } },
        { $project: { status: "$_id", count: 1, value: 1, _id: 0 } },
      ]),
    ]);

    return {
      today: { count: todayStats[0]?.count || 0, revenue: todayStats[0]?.revenue || 0 },
      thisMonth: { count: monthStats[0]?.count || 0, revenue: monthStats[0]?.revenue || 0 },
      allTime: { count: allTimeStats[0]?.count || 0, revenue: allTimeStats[0]?.revenue || 0 },
      ordersByStatus,
    };
  }

  async getByOrderNumberPublic(orderNumber: string): Promise<any | null> {
    const order = await Order.findOne({ orderNumber });
    if (!order) return null;

    return {
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      items: order.items.map((item) => ({ name: item.name, quantity: item.quantity, price: item.price, image: item.image })),
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
      shippingAddress: { firstName: order.shippingAddress.firstName, lastName: order.shippingAddress.lastName, city: order.shippingAddress.city, country: order.shippingAddress.country },
      createdAt: order.createdAt,
    };
  }
}

export const orderService = new OrderService();
