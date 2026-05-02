import connectDB from "@/lib/db";
import Attribute from "@/models/attributes";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await context.params;
    const attribute = await Attribute.findById(id);

    if (!attribute) {
      return NextResponse.json(
        {
          success: false,
          message: "Attribute not found",
        },
        { status: 404 }
      );
    }

    //  TOGGLE soft delete
    attribute.isDelete = !attribute.isDelete;

    await attribute.save();

    return NextResponse.json(
      {
        success: true,
        message: attribute.isDelete
          ? "Moved to trash"
          : "Restored successfully",
        data: attribute,
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