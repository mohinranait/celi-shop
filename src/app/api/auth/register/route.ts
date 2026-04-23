import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, phone, password } = body;

    // validation
    if (!name || !phone || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    await connectDB()


      // Duplicate check
    const isExists = await User.findOne({ phone });
    if (isExists) {
      return NextResponse.json(
        { success: false, error: "This phone already exists" },
        { status: 409 }
      );
    }



    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create user
    const userDoc = await User.create({
      ...body,
      password: hashedPassword,
    });

   const { password: _, ...user } = userDoc.toObject(); 

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}