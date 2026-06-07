import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectToDatabase } from "@/lib/mongodb";
import { UserModel } from "@/models/User";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const userRole = user.role || "user";

    // Generate tokens with role included
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: userRole,
    });
    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: userRole,
    });

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        data: {
          accessToken,
          refreshToken,
          user: {
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            fullName: user.firstName && user.lastName 
              ? `${user.firstName} ${user.lastName}` 
              : user.email,
            role: userRole,
            phone: user.phone,
            isActive: user.isActive !== false,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
