import { attributeSchema } from "@/components/validations/attributes";
import connectDB from "@/lib/db";
import Attribute from "@/models/attributes";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const body = await req.json();
    const { id } = await params;

    //  validate input
    const parsed = attributeSchema.safeParse(body);

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

    const name = parsed.data.name;



    //  check product exists
    const existingAttr = await Attribute.findById(id);

    if (!existingAttr) {
      return NextResponse.json(
        {
          success: false,
          message: "Attribute not found",
        },
        { status: 404 }
      );
    }

    //  check duplicate slug (exclude current id)
    if (name && name !== existingAttr.name) {
      const duplicate = await Attribute.findOne({
        name,
        _id: { $ne: id },
      });

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            message: "Name already exists",
          },
          { status: 409 }
        );
      }
    }



    //  update attribute
    const attribute = await Attribute.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Attribute updated successfully",
        data: attribute,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Attribute Error:", error);

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


    //  check attribute exists
    const attribute = await Attribute.findByIdAndDelete(id);

    if (!attribute) {
      return NextResponse.json(
        {
          success: false,
          message: "Attribute not found",
        },
        { status: 404 }
      );
    }



    return NextResponse.json(
      {
        success: true,
        message: "Attribute updated successfully",
        data: attribute,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Attribute Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}


