import { getAuthUser } from "@/lib/authUser";
import connectDB from "@/lib/db";
import Comment from "@/models/comment";
import "@/models/user.model";
import "@/models/product"
import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/product";

// get all comments
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const isFeature = searchParams.get("isFeature");
    const status = searchParams.get("isApproved");
    const star = searchParams.get("rating");
    const productId = searchParams.get("productId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    let query: any = {};
    if (search) {
      query.$or = [
        { comment: { $regex: search, $options: "i" } },
      ];
    }
    if (status) query.isApproved = status;
    if (isFeature) query.isFeature = isFeature;
    if (star) query.rating = parseInt(star);
    if (productId) query.productId = productId;

    const total = await Comment.countDocuments(query);
    const comments = await Comment.find(query)
      .populate("productId", "name")
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      data: comments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}


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

    await Product.findByIdAndUpdate(productId, {})

    if (!savedComment) {
      return NextResponse.json(
        { success: false, message: "Comment not created" },
        { status: 401 }
      );
    }


    // Update product review 
    const product = await Product.findById(productId).select("ratings");

    if (product) {
      const oldTotal = product.ratings.totalReviews || 0;
      const oldAverage = product.ratings.average || 0;

      const newTotal = oldTotal + 1;
      const newAverage = Number(
        ((oldAverage * oldTotal + rating) / newTotal).toFixed(1)
      );

      await Product.findByIdAndUpdate(productId, {
        $inc: {
          "ratings.totalReviews": 1,
        },
        $set: {
          "ratings.average": newAverage,
        },
      });
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