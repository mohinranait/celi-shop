
import connectDB from "@/lib/db";
import AppModel from "@/models/app-config";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch the configuration
export async function GET() {
  try {
    await connectDB();

    // Get the single configuration document
    let config = await AppModel.findOne();

    if (!config) {
      // Create default config if none exists
      config = await AppModel.create({
        email: { user: "", password: "", status: false },
        cloudinary: { name: "", key: "", secret: "", status: false },
      });
    }

    return NextResponse.json({ success: true, data: config }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch configuration" },
      { status: 500 },
    );
  }
}

// POST: Update the configuration (entire document)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { section, data, status } = body;

    // Fetch the existing config document
    let config = await AppModel.findOne();

    const email =
      section === "email"
        ? { ...data, status: status !== undefined ? status : config?.email?.status }
        : undefined;
    const cloudinary =
      section === "cloudinary"
        ? { ...data, status: status !== undefined ? status : config?.cloudinary?.status }
        : undefined;

    if (!config) {
      // Create default if none exists
      config = await AppModel.create({
        email,
        cloudinary,
      });
    }
    

    // Update the entire document with the provided body
    if (email) {
      config.email = email;
    }

    if (cloudinary) {
      config.cloudinary = cloudinary;
    }

    await config.save();

    return NextResponse.json(
      {
        success: true,
        message: "Configuration updated successfully",
        data: config,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update configuration" },
      { status: 500 },
    );
  }
}