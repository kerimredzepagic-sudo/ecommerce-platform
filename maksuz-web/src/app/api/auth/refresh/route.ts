import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import { UserModel } from "@/models/User";
import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json(
        { message: "Refresh token is required." },
        { status: 400 }
      );
    }

    // Verify the refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      return NextResponse.json(
        { message: "Invalid or expired refresh token." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Find user and verify the stored refresh token matches
    const user = await UserModel.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json(
        { message: "Invalid refresh token." },
        { status: 401 }
      );
    }

    const userRole = user.role || "user";

    // Generate new tokens with role included
    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: userRole,
    });
    const newRefreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: userRole,
    });

    // Update stored refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Tokens refreshed successfully.",
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
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
