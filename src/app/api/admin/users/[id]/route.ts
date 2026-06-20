
import { userSchema } from "@/components/validations/user.schema";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";





export async function GET(
  req: NextRequest,
  { params }: { params: Promise< { id: string }> }
) {
  try {
    await connectDB();

     const { id } = await  params;

   
    //  check user exists
    const existingUser = await User.findById(id).select('-password');

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

   

   
    return NextResponse.json(
      {
        success: true,
        message: "Successfully",
        data: existingUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update User Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
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
    const parsed = userSchema.safeParse(body);

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

    const { phone } = parsed.data;

    //  check user exists
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    //  check duplicate user (exclude current id)
    if (phone  && phone !== existingUser.phone) {
      const duplicate = await User.findOne({
        phone,
        _id: { $ne: id },
      });

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            message: "Phone already exists",
          },
          { status: 409 }
        );
      }
    }

    //  update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update User Error:", error);

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
  

    //  check user exists
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

  

    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully",
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update User Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}


