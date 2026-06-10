import { getAuthUser } from "@/lib/authUser";
import connectDB from "@/lib/db";
import Comment from "@/models/comment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    
    const body = await req.json();
    const authUser = await getAuthUser() as { id: string; phone: string };
    
    const userId = authUser?.id;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }
    
    
    const { productId, comment, rating } = body;
    
    if (!productId || !comment) {
      return NextResponse.json(
        { success: false, message: "Product ID and comment are required" },
        { status: 401 }
      );
    }
    
    await connectDB();
    const newComment = new Comment({ productId, userId: authUser.id, comment, rating });
    const savedComment = await newComment.save();

    if (!savedComment) {
      return NextResponse.json(
        { success: false, message: "Comment not created" },
        { status: 401 }
      );
    }



    return NextResponse.json(
      {
        success: true,
        message: "Successfully",
        data: savedComment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Comment API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}