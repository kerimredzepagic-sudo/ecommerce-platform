import mongoose from "mongoose";
import { Order, IOrder, IOrderItem, Product, PromoCode, User } from "../models";
import { emailService } from "./email.service";
import { ApiError } from "../middleware/error.middleware";

export interface PromoCodeInput {
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
  discountAmount: number;
}

export interface CreateOrderInput {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
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
  // Helper method to validate and apply promo code
  private async validateAndApplyPromoCode(
    code: string,
    subtotal: number,
  ): Promise<PromoCodeInput | null> {
    const promoCode = await PromoCode.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!promoCode) return null;

    const now = new Date();
    if (now < promoCode.validFrom || now > promoCode.validUntil) return null;
    if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses)
      return null;
    if (subtotal < promoCode.minOrderAmount) return null;

    let discountAmount = 0;
    if (promoCode.type === "percentage") {
      discountAmount = subtotal * (promoCode.value / 100);
    } else if (promoCode.type === "fixed") {
      discountAmount = Math.min(promoCode.value, subtotal);
    }
    // free_shipping doesn't have a discount amount - handled separately

    return {
      code: promoCode.code,
      type: promoCode.type,
      value: promoCode.value,
      discountAmount,
    };
  }

  // Update promo code usage after order creation
  private async updatePromoCodeUsage(
    code: string,
    orderId: mongoose.Types.ObjectId,
  ): Promise<void> {
    await PromoCode.findOneAndUpdate(
      { code: code.toUpperCase() },
      {
        $inc: { usedCount: 1 },
        $push: { usedInOrders: orderId },
      },
    );
  }

  // Send order confirmation emails to customer and admin
  private async sendOrderConfirmationEmails(
    order: IOrder,
    customerEmail: string,
    customerName: string,
  ): Promise<void> {
    const orderData = {
      orderNumber: order.orderNumber || "N/A",
      items: order.items.map((item) => ({
        name: item.name || "Proizvod",
        price: item.price || 0,
        quantity: item.quantity || 1,
        image: item.image,
      })),
      subtotal: order.subtotal || 0,
      shipping: order.shipping || 0,
      tax: order.tax || 0,
      total: order.total || 0,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod || "cash",
      promoCode:
        order.promoCode && order.promoCode.code
          ? {
              code: order.promoCode.code,
              discountAmount: order.promoCode.discountAmount || 0,
            }
          : undefined,
      createdAt: order.createdAt || new Date(),
    };

    // Send emails in parallel (don't await to avoid blocking the order response)
    Promise.all([
      emailService.sendOrderConfirmationToCustomer(customerEmail, orderData),
      emailService.sendNewOrderNotificationToAdmin(
        orderData,
        customerEmail,
        customerName,
      ),
    ]).catch((error) => {
      console.error("Failed to send order confirmation emails:", error);
    });
  }

  async create(userId: string, input: CreateOrderInput): Promise<IOrder> {
    // Fetch products and validate
    const productIds = input.items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      throw new ApiError("Jedan ili više proizvoda nije pronađeno", 400);
    }

    // Build order items and calculate totals
    const orderItems: IOrderItem[] = [];
    let subtotal = 0;

    for (const item of input.items) {
      const product = products.find((p) => p._id.toString() === item.productId);
      if (!product) continue;

      // Check stock only if backorders are not allowed
      if (!product.allowBackorder) {
        // Check if product is out of stock (stock <= 0)
        if (
          product.stock !== undefined &&
          product.stock !== null &&
          product.stock <= 0
        ) {
          throw new ApiError(`Proizvod "${product.name}" nije na zalihama`, 400);
        }

        // Check if there's insufficient stock for the requested quantity
        if (
          product.trackInventory &&
          product.stock !== undefined &&
          product.stock !== null &&
          product.stock < item.quantity
        ) {
          throw new ApiError(
            `Nedovoljna količina na zalihama za proizvod "${product.name}". Dostupno: ${product.stock}`,
            400,
          );
        }
      }

      const orderItem: IOrderItem = {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0]?.url,
      };

      orderItems.push(orderItem);
      subtotal += product.price * item.quantity;
    }

    // Validate and apply promo code if provided
    let appliedPromo: PromoCodeInput | null = null;
    if (input.promoCode) {
      appliedPromo = await this.validateAndApplyPromoCode(
        input.promoCode,
        subtotal,
      );
    }

    // Calculate shipping and tax
    let shipping = subtotal >= 50 ? 0 : 5; // Free shipping over 50 KM

    // Apply free shipping promo if applicable
    if (appliedPromo?.type === "free_shipping") {
      shipping = 0;
    }

    // Calculate discount
    const discountAmount = appliedPromo?.discountAmount || 0;

    const tax = (subtotal - discountAmount) * 0.17; // 17% VAT on discounted amount
    const total = subtotal - discountAmount + shipping + tax;

    // Create order
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
      promoCode: appliedPromo
        ? {
            code: appliedPromo.code,
            type: appliedPromo.type,
            value: appliedPromo.value,
            discountAmount: appliedPromo.discountAmount,
          }
        : undefined,
    });

    // Update promo code usage
    if (appliedPromo) {
      await this.updatePromoCodeUsage(appliedPromo.code, order._id);
    }

    // Reduce stock
    for (const item of input.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Get user info for email
    const user = await User.findById(userId);
    if (user) {
      const customerName = `${user.firstName} ${user.lastName}`;
      this.sendOrderConfirmationEmails(order, user.email, customerName);
    }

    return order.populate("user", "firstName lastName email");
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

  async getUserOrders(
    userId: string,
    query: OrderQuery,
  ): Promise<{ orders: IOrder[]; total: number }> {
    const { page = 1, limit = 10, status } = query;

    const filter: Record<string, unknown> = { user: userId };
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("items.product", "name slug images")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter),
    ]);

    return { orders, total };
  }

  async getAllOrders(
    query: OrderQuery,
  ): Promise<{ orders: IOrder[]; total: number }> {
    const { page = 1, limit = 20, status } = query;

    const filter: Record<string, unknown> = {};
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("user", "firstName lastName email")
        .populate("items.product", "name slug images")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter),
    ]);

    return { orders, total };
  }

  async updateStatus(
    id: string,
    status: IOrder["status"],
  ): Promise<IOrder | null> {
    return Order.findByIdAndUpdate(id, { status }, { new: true })
      .populate("user", "firstName lastName email")
      .populate("items.product", "name slug images");
  }

  async updatePaymentStatus(
    id: string,
    paymentStatus: IOrder["paymentStatus"],
  ): Promise<IOrder | null> {
    const updateData: Record<string, unknown> = { paymentStatus };

    // If payment is confirmed, also confirm the order
    if (paymentStatus === "paid") {
      updateData.status = "confirmed";
    }

    return Order.findByIdAndUpdate(id, updateData, { new: true })
      .populate("user", "firstName lastName email")
      .populate("items.product", "name slug images");
  }

  async updateTracking(
    id: string,
    trackingNumber: string,
  ): Promise<IOrder | null> {
    return Order.findByIdAndUpdate(id, { trackingNumber }, { new: true })
      .populate("user", "firstName lastName email")
      .populate("items.product", "name slug images");
  }

  async cancelOrder(id: string): Promise<IOrder | null> {
    const order = await Order.findById(id);
    if (!order) return null;

    if (["shipped", "delivered"].includes(order.status)) {
      throw new ApiError("Nije moguće otkazati narudžbu koja je već poslana ili isporučena", 400);
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    order.status = "cancelled";
    await order.save();

    return order.populate("user", "firstName lastName email");
  }

  async getUserOrderStats(userId: string): Promise<{
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalSpent: number;
  }> {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const [totalOrders, pendingOrders, completedOrders, totalSpentResult] =
      await Promise.all([
        Order.countDocuments({ user: userObjectId }),
        Order.countDocuments({
          user: userObjectId,
          status: { $in: ["pending", "confirmed", "processing", "shipped"] },
        }),
        Order.countDocuments({ user: userObjectId, status: "delivered" }),
        Order.aggregate([
          { $match: { user: userObjectId, status: { $ne: "cancelled" } } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
      ]);

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalSpent: totalSpentResult[0]?.total || 0,
    };
  }

  // Guest order creation (no user account required)
  async createGuestOrder(input: CreateGuestOrderInput): Promise<IOrder> {
    // Fetch products and validate
    const productIds = input.items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      throw new ApiError("Jedan ili više proizvoda nije pronađeno", 400);
    }

    // Build order items and calculate totals
    const orderItems: IOrderItem[] = [];
    let subtotal = 0;

    for (const item of input.items) {
      const product = products.find((p) => p._id.toString() === item.productId);
      if (!product) continue;

      // Check stock only if backorders are not allowed
      if (!product.allowBackorder) {
        // Check if product is out of stock (stock <= 0)
        if (
          product.stock !== undefined &&
          product.stock !== null &&
          product.stock <= 0
        ) {
          throw new ApiError(`Proizvod "${product.name}" nije na zalihama`, 400);
        }

        // Check if there's insufficient stock for the requested quantity
        if (
          product.trackInventory &&
          product.stock !== undefined &&
          product.stock !== null &&
          product.stock < item.quantity
        ) {
          throw new ApiError(
            `Nedovoljna količina na zalihama za proizvod "${product.name}". Dostupno: ${product.stock}`,
            400,
          );
        }
      }

      const orderItem: IOrderItem = {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0]?.url,
      };

      orderItems.push(orderItem);
      subtotal += product.price * item.quantity;
    }

    // Validate and apply promo code if provided
    let appliedPromo: PromoCodeInput | null = null;
    if (input.promoCode) {
      appliedPromo = await this.validateAndApplyPromoCode(
        input.promoCode,
        subtotal,
      );
    }

    // Calculate shipping
    let shipping = subtotal >= 50 ? 0 : 5; // Free shipping over 50 KM

    // Apply free shipping promo if applicable
    if (appliedPromo?.type === "free_shipping") {
      shipping = 0;
    }

    // Calculate discount
    const discountAmount = appliedPromo?.discountAmount || 0;

    const tax = (subtotal - discountAmount) * 0.17; // 17% VAT on discounted amount
    const total = subtotal - discountAmount + shipping + tax;

    // Create order without user (guest order)
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
      promoCode: appliedPromo
        ? {
            code: appliedPromo.code,
            type: appliedPromo.type,
            value: appliedPromo.value,
            discountAmount: appliedPromo.discountAmount,
          }
        : undefined,
    });

    // Update promo code usage
    if (appliedPromo) {
      await this.updatePromoCodeUsage(appliedPromo.code, order._id);
    }

    // Reduce stock
    for (const item of input.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Send confirmation emails for guest order
    this.sendOrderConfirmationEmails(order, input.guestEmail, input.guestName);

    return order;
  }

  // Admin analytics - aggregated order statistics
  async getOrderAnalytics(): Promise<{
    pending: { count: number; value: number };
    today: { count: number; revenue: number };
    thisMonth: { count: number; revenue: number };
    allTime: { count: number; revenue: number };
    ordersByStatus: Array<{ status: string; count: number; value: number }>;
    topCustomers: Array<{
      userId: string;
      name: string;
      email: string;
      orderCount: number;
      totalSpent: number;
      lastOrderDate: Date;
    }>;
  }> {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Run all aggregations in parallel
    const [
      pendingStats,
      todayStats,
      monthStats,
      allTimeStats,
      ordersByStatus,
      topCustomers,
    ] = await Promise.all([
      // Pending orders (pending, confirmed, processing, shipped)
      Order.aggregate([
        {
          $match: {
            status: { $in: ["pending", "confirmed", "processing", "shipped"] },
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            value: { $sum: "$total" },
          },
        },
      ]),

      // Today's orders
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfToday },
            status: { $ne: "cancelled" },
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            revenue: { $sum: "$total" },
          },
        },
      ]),

      // This month's orders
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfMonth },
            status: { $ne: "cancelled" },
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            revenue: { $sum: "$total" },
          },
        },
      ]),

      // All time stats (excluding cancelled)
      Order.aggregate([
        {
          $match: {
            status: { $ne: "cancelled" },
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            revenue: { $sum: "$total" },
          },
        },
      ]),

      // Orders by status
      Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            value: { $sum: "$total" },
          },
        },
        {
          $project: {
            status: "$_id",
            count: 1,
            value: 1,
            _id: 0,
          },
        },
        { $sort: { count: -1 } },
      ]),

      // Top customers (by total spent)
      Order.aggregate([
        {
          $match: {
            user: { $ne: null },
            status: { $ne: "cancelled" },
          },
        },
        {
          $group: {
            _id: "$user",
            orderCount: { $sum: 1 },
            totalSpent: { $sum: "$total" },
            lastOrderDate: { $max: "$createdAt" },
          },
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        { $unwind: "$userInfo" },
        {
          $project: {
            userId: "$_id",
            name: {
              $concat: ["$userInfo.firstName", " ", "$userInfo.lastName"],
            },
            email: "$userInfo.email",
            orderCount: 1,
            totalSpent: 1,
            lastOrderDate: 1,
            _id: 0,
          },
        },
      ]),
    ]);

    return {
      pending: {
        count: pendingStats[0]?.count || 0,
        value: pendingStats[0]?.value || 0,
      },
      today: {
        count: todayStats[0]?.count || 0,
        revenue: todayStats[0]?.revenue || 0,
      },
      thisMonth: {
        count: monthStats[0]?.count || 0,
        revenue: monthStats[0]?.revenue || 0,
      },
      allTime: {
        count: allTimeStats[0]?.count || 0,
        revenue: allTimeStats[0]?.revenue || 0,
      },
      ordersByStatus,
      topCustomers,
    };
  }

  // Public order tracking (returns limited info, no auth required)
  async getByOrderNumberPublic(orderNumber: string): Promise<{
    orderNumber: string;
    status: IOrder["status"];
    paymentStatus: IOrder["paymentStatus"];
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      image?: string;
    }>;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    shippingAddress: {
      firstName: string;
      lastName: string;
      city: string;
      country: string;
    };
    createdAt: Date;
  } | null> {
    const order = await Order.findOne({ orderNumber }).populate(
      "items.product",
      "name slug images",
    );

    if (!order) return null;

    return {
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
      shippingAddress: {
        firstName: order.shippingAddress.firstName,
        lastName: order.shippingAddress.lastName,
        city: order.shippingAddress.city,
        country: order.shippingAddress.country,
      },
      createdAt: order.createdAt,
    };
  }
}

export const orderService = new OrderService();
