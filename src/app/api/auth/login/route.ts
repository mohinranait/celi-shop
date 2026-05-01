import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, NODE_ENV } from "@/lib/envSecret";
import { loginSchema } from "@/components/validations/auth.schema";
import User from "@/models/user.model";
import connectDB from "@/lib/db";

const jwtSecret = JWT_SECRET as string;
const productionMode = NODE_ENV;

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { phone, password } = body || {};

    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const userDoc = await User.findOne({ phone });
    if (!userDoc) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(password, userDoc.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const user = userDoc.toObject() as any;
    delete user.password;

    const token = jwt.sign(
      { id: user._id, phone: user.phone, role: user.role },
      jwtSecret,
      { expiresIn: "1d" }
    );

    // ✅ এখানে main change
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      statusCode: 200,
      payload: user,
    });

    response.cookies.set("access_token", token, {
      httpOnly: true,
      secure: productionMode === "production",
      sameSite: productionMode === "production" ? "none" : "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}