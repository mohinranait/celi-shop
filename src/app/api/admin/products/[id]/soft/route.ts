import connectDB from "@/lib/db";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await context.params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    //  TOGGLE soft delete
    product.isDelete = !product.isDelete;

    await product.save();

    return NextResponse.json(
      {
        success: true,
        message: product.isDelete
          ? "Moved to trash"
          : "Restored successfully",
        data: product,
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