import mongoose from "mongoose";

// Mock the email service so order creation never tries to send real SMTP mail.
jest.mock("../../src/services/email.service", () => ({
  emailService: {
    sendOrderConfirmationToCustomer: jest.fn().mockResolvedValue(undefined),
    sendNewOrderNotificationToAdmin: jest.fn().mockResolvedValue(undefined),
  },
}));

import { orderService } from "../../src/services/order.service";
import { Product, PromoCode, Category } from "../../src/models";
import { connectTestDB, clearTestDB, closeTestDB } from "../setup/db";

let categoryId: string;

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

beforeEach(async () => {
  await clearTestDB();
  const category = await Category.create({
    name: "Med",
    slug: "med",
    level: 1,
    ancestors: [],
  });
  categoryId = (category._id as mongoose.Types.ObjectId).toString();
});

async function makeProduct(overrides: Record<string, unknown> = {}) {
  return Product.create({
    name: "Bagremov Med",
    slug: `bagremov-med-${Math.random().toString(36).slice(2)}`,
    description: "Prirodni bagremov med",
    price: 20,
    category: categoryId,
    stock: 10,
    trackInventory: true,
    allowBackorder: false,
    isActive: true,
    images: [{ url: "https://example.com/med.png", isPrimary: true }],
    ...overrides,
  });
}

const shippingAddress = {
  firstName: "Amar",
  lastName: "Hodzic",
  street: "Ferhadija 1",
  city: "Sarajevo",
  postalCode: "71000",
  country: "BiH",
  phone: "+38761000000",
};

function guestInput(productId: string, quantity: number, promoCode?: string) {
  return {
    guestEmail: "guest@example.com",
    guestName: "Guest Buyer",
    items: [{ productId, quantity }],
    shippingAddress,
    paymentMethod: "cash",
    promoCode,
  };
}

describe("orderService.createGuestOrder — stock", () => {
  it("decrements product stock by the ordered quantity", async () => {
    const product = await makeProduct({ stock: 10 });
    await orderService.createGuestOrder(
      guestInput((product._id as mongoose.Types.ObjectId).toString(), 3),
    );

    const updated = await Product.findById(product._id);
    expect(updated?.stock).toBe(7);
  });

  it("rejects an order when there is insufficient stock", async () => {
    const product = await makeProduct({ stock: 2 });
    await expect(
      orderService.createGuestOrder(
        guestInput((product._id as mongoose.Types.ObjectId).toString(), 5),
      ),
    ).rejects.toThrow(/Nedovoljna količina/);
  });
});

describe("orderService promo-code Strategy", () => {
  it("applies a percentage discount", async () => {
    const product = await makeProduct({ price: 100, stock: 10 });
    await PromoCode.create({
      code: "SAVE10",
      type: "percentage",
      value: 10,
      isActive: true,
      validFrom: new Date(Date.now() - 1000),
      validUntil: new Date(Date.now() + 1000 * 60 * 60),
      minOrderAmount: 0,
    });

    const order = await orderService.createGuestOrder(
      guestInput(
        (product._id as mongoose.Types.ObjectId).toString(),
        1,
        "SAVE10",
      ),
    );

    // subtotal 100, 10% off -> discount 10
    expect(order.promoCode?.discountAmount).toBe(10);
    expect(order.subtotal).toBe(100);
  });

  it("applies a free-shipping promo by zeroing the shipping cost", async () => {
    // subtotal below 50 normally costs 5 shipping
    const product = await makeProduct({ price: 20, stock: 10 });
    await PromoCode.create({
      code: "FREESHIP",
      type: "free_shipping",
      value: 0,
      isActive: true,
      validFrom: new Date(Date.now() - 1000),
      validUntil: new Date(Date.now() + 1000 * 60 * 60),
      minOrderAmount: 0,
    });

    const order = await orderService.createGuestOrder(
      guestInput(
        (product._id as mongoose.Types.ObjectId).toString(),
        1,
        "FREESHIP",
      ),
    );

    expect(order.shipping).toBe(0);
  });

  it("ignores an expired promo code", async () => {
    const product = await makeProduct({ price: 100, stock: 10 });
    await PromoCode.create({
      code: "OLD",
      type: "percentage",
      value: 50,
      isActive: true,
      validFrom: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      validUntil: new Date(Date.now() - 1000 * 60 * 60 * 24), // expired yesterday
      minOrderAmount: 0,
    });

    const order = await orderService.createGuestOrder(
      guestInput((product._id as mongoose.Types.ObjectId).toString(), 1, "OLD"),
    );

    // promo not applied -> no discount recorded (Mongoose may return an empty subdoc)
    expect(order.promoCode?.discountAmount).toBeFalsy();
    expect(order.promoCode?.code).toBeUndefined();
  });
});
