import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import path from "path";

// Load environment variables
config({ path: path.join(__dirname, "../.env") });

const MONGODB_URI = process.env.MONGODB_URI || "";
const NEW_ADMIN_EMAIL = "kerimredzepagic96@gmail.com";
const NEW_ADMIN_PASSWORD = "Admin123!";

async function updateAdminEmail() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const User = mongoose.connection.collection("users");

    // Hash password
    const hashedPassword = await bcrypt.hash(NEW_ADMIN_PASSWORD, 12);

    // Find admin user
    const admin = await User.findOne({ role: "admin" });

    if (!admin) {
      console.log("❌ No admin user found in database");
      console.log("\n📝 Creating admin user...");

      await User.insertOne({
        email: NEW_ADMIN_EMAIL,
        password: hashedPassword,
        firstName: "Admin",
        lastName: "Maksuz",
        role: "admin",
        isActive: true,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("✅ Admin user created!");
    } else {
      console.log(`📧 Current admin email: ${admin.email}`);
      console.log(`🔑 Current password exists: ${!!admin.password}`);

      // Update email AND password
      await User.updateOne(
        { role: "admin" },
        {
          $set: {
            email: NEW_ADMIN_EMAIL,
            password: hashedPassword,
            isVerified: true,
            isActive: true,
            updatedAt: new Date(),
          },
        }
      );

      console.log(`✅ Admin updated!`);
    }

    console.log(`\n📋 Admin Credentials:`);
    console.log(`   Email: ${NEW_ADMIN_EMAIL}`);
    console.log(`   Password: ${NEW_ADMIN_PASSWORD}`);

    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

updateAdminEmail();
