import connectDB from "@/lib/db";
import Brand from "@/models/brand.model";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await context.params;
    const brand = await Brand.findById(id);

    if (!brand) {
      return NextResponse.json(
        {
          success: false,
          message: "Brand not found",
        },
        { status: 404 }
      );
    }

    //  TOGGLE soft delete
    brand.isDelete = !brand.isDelete;

    await brand.save();

    return NextResponse.json(
      {
        success: true,
        message: brand.isDelete
          ? "Moved to trash"
          : "Restored successfully",
        data: brand,
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