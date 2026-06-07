import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import { UserModel } from "@/models/User";
import { verifyAccessToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "No token provided." },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify the access token
    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch {
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Remove refresh token from database
    await UserModel.findByIdAndUpdate(payload.userId, {
      refreshToken: null,
    });

    return NextResponse.json(
      { message: "Logout successful." },
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

