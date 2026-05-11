import { appSettingsSchema } from "@/components/validations/app-setting";
import connectDB from "@/lib/db";
import AppSetting from "@/models/app-setting";
import { NextRequest, NextResponse } from "next/server";


// GET - Fetch Settings
export async function GET() {
  try {
    await connectDB();
    let settings = await AppSetting.findOne();

    if (!settings) {
      settings = await AppSetting.create({
        siteName: "My Ecommerce",
        contactEmail: "admin@yourstore.com",
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// PUT - Update Settings
export async function PATCH(req: NextRequest) {
  try {


    const body = await req.json();
    console.log({body});
    
    const validatedData = appSettingsSchema.parse(body);
    console.log({validatedData});

    await connectDB();

    const settings = await AppSetting.findOneAndUpdate(
      {},
      { 
        ...validatedData,
      },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: "Settings updated successfully",
      data: settings 
    });
  } catch (error: any) {
    console.log(error);
    
    return NextResponse.json({ 
      error: error.errors || error.message 
    }, { status: 400 });
  }
}