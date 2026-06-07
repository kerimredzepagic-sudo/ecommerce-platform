import { slugify, generateUniqueSlug } from "../../src/utils/slugify";

describe("slugify", () => {
  it("lowercases and hyphenates spaces", () => {
    expect(slugify("Med od Bagrema")).toBe("med-od-bagrema");
  });

  it("strips special characters", () => {
    expect(slugify("Med & Propolis 100%!")).toBe("med-propolis-100");
  });

  it("collapses repeated hyphens into one", () => {
    expect(slugify("a   b")).toBe("a-b");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  -Premium-  ")).toBe("premium");
  });

  it("generateUniqueSlug appends a base-36 suffix to the base slug", () => {
    const unique = generateUniqueSlug("med");
    expect(unique).toMatch(/^med-[a-z0-9]+$/);
    expect(unique).not.toBe("med");
  });
});
