import connectDB from "@/lib/db";
import { Category } from "@/models/categories";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await context.params;
    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    //  TOGGLE soft delete
    category.isDelete = !category.isDelete;

    await category.save();

    return NextResponse.json(
      {
        success: true,
        message: category.isDelete
          ? "Moved to trash"
          : "Restored successfully",
        data: category,
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