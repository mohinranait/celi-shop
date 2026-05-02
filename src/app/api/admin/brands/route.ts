import { brandSchema } from "@/components/validations/brands";
import connectDB from "@/lib/db";
import Brand from "@/models/brand.model";
import { NextRequest, NextResponse } from "next/server";



export async function GET() {
  try {
    await connectDB();

    const brands = await Brand.find({isDelete:false}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: brands,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching brands" },
      { status: 500 }
    );
  }
}



export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    console.log({body});
    

    // validate input
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

    // check duplicate slug
    const existing = await Brand.findOne({ slug });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug already exists",
        },
        { status: 409 }
      );
    }

    // create brand
    const brand = await Brand.create({
     ...body
    });

    return NextResponse.json(
      {
        success: true,
        message: "Brand created successfully",
        data: brand,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Brand API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}