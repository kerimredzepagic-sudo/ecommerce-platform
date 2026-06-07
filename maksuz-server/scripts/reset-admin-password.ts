import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import path from "path";

// Load environment variables (MONGODB_URI points at the live Atlas DB)
config({ path: path.join(__dirname, "../.env") });

const MONGODB_URI = process.env.MONGODB_URI || "";

// Credentials documented in docs/PROJECT_DOCUMENTATION.md
const ADMIN_EMAIL = "kerimredzepagic96@gmail.com";
const ADMIN_PASSWORD = "Admin123!";

async function resetAdmin() {
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI not set (check .env)");
    process.exit(1);
  }

  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected");

    const Users = mongoose.connection.collection("users");
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    const existingAdmin = await Users.findOne({ role: "admin" });

    if (!existingAdmin) {
      console.log("📝 No admin found — creating one...");
      await Users.insertOne({
        email: ADMIN_EMAIL,
        password: hashedPassword,
        firstName: "Admin",
        lastName: "Maksuz",
        role: "admin",
        isActive: true,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("✅ Admin created");
    } else {
      console.log(`📧 Existing admin: ${existingAdmin.email} — resetting email + password`);
      await Users.updateOne(
        { _id: existingAdmin._id },
        {
          $set: {
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: "admin",
            isActive: true,
            isVerified: true,
            updatedAt: new Date(),
          },
        }
      );
      console.log("✅ Admin updated");
    }

    console.log("\n📋 Admin credentials:");
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

resetAdmin();
