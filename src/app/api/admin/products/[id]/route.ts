import { productSchema } from "@/components/validations/product";
import connectDB from "@/lib/db";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const product = await Product.findById(params.id);
  if (!product) return NextResponse.json({ error: "Not Found" }, { status: 404 });
  return NextResponse.json({ data: product });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise< { id: string }> }
) {
  try {
    await connectDB();

    const body = await req.json();
     const { id } = await  params;

    //  validate input
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { slug } = parsed.data;

    //  check product exists
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    //  check duplicate slug (exclude current id)
    if (slug  && slug !== existingProduct.slug) {
      const duplicate = await Product.findOne({
        slug,
        _id: { $ne: id },
      });

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            message: "Slug already exists",
          },
          { status: 409 }
        );
      }
    }

    //  update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        data: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Product Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

   
     const { id } = await params;
  

    //  check product exists
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

  

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        data: product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Product Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}