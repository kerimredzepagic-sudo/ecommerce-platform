import mongoose from "mongoose";
import { productService } from "../../src/services/product.service";
import { Category } from "../../src/models";
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

function baseProduct(overrides: Record<string, unknown> = {}) {
  return {
    name: "Bagremov Med",
    description: "Prirodni bagremov med",
    price: 20,
    category: categoryId,
    stock: 10,
    isActive: true,
    ...overrides,
  };
}

describe("productService.create", () => {
  it("generates a slug from the product name", async () => {
    const product = await productService.create(baseProduct());
    expect(product.slug).toBe("bagremov-med");
  });

  it("gives a unique slug when the base slug already exists", async () => {
    const first = await productService.create(baseProduct());
    const second = await productService.create(baseProduct());
    expect(second.slug).not.toBe(first.slug);
    expect(second.slug).toMatch(/^bagremov-med-/);
  });
});

describe("productService.getAll filtering", () => {
  it("filters by price range", async () => {
    await productService.create(baseProduct({ name: "Cheap", price: 10 }));
    await productService.create(baseProduct({ name: "Mid", price: 25 }));
    await productService.create(baseProduct({ name: "Pricey", price: 50 }));

    const { products, total } = await productService.getAll({
      minPrice: 20,
      maxPrice: 40,
    });

    expect(total).toBe(1);
    expect(products[0].name).toBe("Mid");
  });

  it("filters out-of-stock products when inStock is set", async () => {
    await productService.create(baseProduct({ name: "InStock", stock: 5 }));
    await productService.create(baseProduct({ name: "OutOfStock", stock: 0 }));

    const { products } = await productService.getAll({ inStock: true });

    const names = products.map((p) => p.name);
    expect(names).toContain("InStock");
    expect(names).not.toContain("OutOfStock");
  });
});
