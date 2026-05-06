import { brandSchema } from "@/components/validations/brands";
import connectDB from "@/lib/db";
import Brand from "@/models/brand.model";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise< { id: string }> }
) {
  try {
    await connectDB();

    const body = await req.json();
     const { id } = await  params;

    //  validate input
    const parsed = brandSchema.safeParse(body);

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

    //  check brand exists
    const existingBrand = await Brand.findById(id);

    if (!existingBrand) {
      return NextResponse.json(
        {
          success: false,
          message: "Brand not found",
        },
        { status: 404 }
      );
    }

    //  check duplicate slug (exclude current id)
    if (slug  && slug !== existingBrand.slug) {
      const duplicate = await Brand.findOne({
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

    //  update brand
    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Brand updated successfully",
        data: updatedBrand,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Brand Error:", error);

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

   
     const { id } = await  params;
  

    //  check brand exists
    const brand = await Brand.findByIdAndDelete(id);

    if (!brand) {
      return NextResponse.json(
        {
          success: false,
          message: "Brand not found",
        },
        { status: 404 }
      );
    }

  

    return NextResponse.json(
      {
        success: true,
        message: "Brand updated successfully",
        data: brand,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Brand Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}


