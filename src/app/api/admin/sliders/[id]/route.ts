
import { sliderSchema } from "@/components/validations/slider";
import connectDB from "@/lib/db";
import Slider from "@/models/slider";
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
    const parsed = sliderSchema.safeParse(body);

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



   

    //  update slider
    const updatedSlider = await Slider.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Slider updated successfully",
        data: updatedSlider,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Slider Error:", error);

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
  

    //  check slider exists
    const slider = await Slider.findByIdAndDelete(id);

    if (!slider) {
      return NextResponse.json(
        {
          success: false,
          message: "Slider not found",
        },
        { status: 404 }
      );
    }

  

    return NextResponse.json(
      {
        success: true,
        message: "Slider updated successfully",
        data: slider,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Slider Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}


