import { getAuthUser } from "@/lib/authUser";
import connectDB from "@/lib/db";
import Comment from "@/models/comment";
import "@/models/user.model"
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest,
  { params }: { params: Promise<{ id: string }> }) {
  try {

    const { id } = await params;

    const { searchParams } = new URL(req.url,);

    const productId = id;
    const userId = searchParams.get("userId") || null
    const accessMode = searchParams.get("accessMode") || "public" // auth, public

    // const page = parseInt(searchParams.get("page") || "1");
    // const limit = parseInt(searchParams.get("limit") || "10");


    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 401 }
      );
    }


    const query: any = { productId };

    // Authenticated user can cee her comments
    if (accessMode === 'auth') {
      // Commenter user can see her comments
      query.userId = userId;
    } else if (accessMode === 'admin') {
      // Admin can see all comments
      query['$or'] = [{ isApproved: false }, { isApproved: true }];
    } else {
      // Unauthenticated user can see only approved comments
      query.isApproved = true;
    }

    await connectDB();

    const comments = await Comment.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        message: "Successfully",
        data: comments,
      },
      { status: 201 }
    );

  } catch (error) {
    const err = error instanceof Error ? error : new Error("An unknown error occurred");
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to fetch orders",
      },
      { status: 500 }
    );
  }
}



export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const body = await req.json();
    const { id } = await params;

    const authUser = await getAuthUser() as { id: string; phone: string; role: string };


    const commentId = id;

    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { comment } = body;



    if (!comment) {
      return NextResponse.json(
        { success: false, message: "Product ID and comment are required" },
        { status: 401 }
      );
    }


    // find comment
    const existComment = await Comment.findById(commentId);


    if (!existComment) {
      return NextResponse.json(
        { success: false, message: "Comment not found" },
        { status: 401 }
      );
    }


    // check user permission
    if (
      authUser.role !== 'admin' &&
      authUser.role !== 'manager' &&
      authUser.id.toString() !== existComment.userId.toString()
    ) {
      return NextResponse.json(
        { success: false, message: "Can't update comments without permission" },
        { status: 401 }
      );

    }

    const commentUpdate = await Comment.findByIdAndUpdate(commentId, {...body}, { new: true, runValidators: true });

    if (!commentUpdate) {
      return NextResponse.json(
        { success: false, message: "Comment not created" },
        { status: 401 }
      );
    };



    return NextResponse.json(
      {
        success: true,
        message: "Successfully",
        data: commentUpdate,
      },
      { status: 201 }
    );



  } catch (error) {
    console.error("Update comment Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}