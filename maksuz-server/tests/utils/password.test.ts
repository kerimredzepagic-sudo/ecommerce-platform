import { hashPassword, comparePassword } from "../../src/utils/password";

describe("password hashing", () => {
  it("hashes a password into a bcrypt hash, not the plaintext", async () => {
    const hash = await hashPassword("s3cret-pass");
    expect(hash).not.toBe("s3cret-pass");
    expect(hash).toMatch(/^\$2[aby]\$/); // bcrypt hash prefix
  });

  it("comparePassword returns true for the correct password", async () => {
    const hash = await hashPassword("s3cret-pass");
    await expect(comparePassword("s3cret-pass", hash)).resolves.toBe(true);
  });

  it("comparePassword returns false for a wrong password", async () => {
    const hash = await hashPassword("s3cret-pass");
    await expect(comparePassword("wrong-pass", hash)).resolves.toBe(false);
  });
});
