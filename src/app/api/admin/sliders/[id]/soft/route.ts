import connectDB from "@/lib/db";
import Slider from "@/models/slider";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await context.params;
    const slider = await Slider.findById(id);

    if (!slider) {
      return NextResponse.json(
        {
          success: false,
          message: "Slider not found",
        },
        { status: 404 }
      );
    }

    //  TOGGLE soft delete
    slider.isDelete = !slider.isDelete;

    await slider.save();

    return NextResponse.json(
      {
        success: true,
        message: slider.isDelete
          ? "Moved to trash"
          : "Restored successfully",
        data: slider,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Soft Delete Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}