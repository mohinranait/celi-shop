import { getAuthUser } from "@/lib/authUser";
import connectDB from "@/lib/db";
import Order from "@/models/order";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDB();


    const decoded = await getAuthUser() as { id: string; phone: string };

    const userId = decoded?.id;
    // console.log({userId});
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const isDelete = searchParams.get("isDelete");

    const skip = (page - 1) * limit;

    /* ----------------------------- FILTER QUERY ---------------------------- */

    const filter: any = {
      isDeleted: false,
    };

    if (userId) {
      filter.userId = userId;
    }



    // SOFT DELETE FILTER
    if (isDelete === "true") filter.isDeleted = true;
    if (isDelete === "false") filter.isDeleted = false;




    /* ------------------------------ DATABASE ------------------------------- */

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email")
      .lean();

    const totalOrders = await Order.countDocuments(filter);

    /* ------------------------------ RESPONSE ------------------------------- */

    return NextResponse.json({
      success: true,
      data: orders,
      meta: {
        total: totalOrders,
        page,
        limit,
        totalPages: Math.ceil(totalOrders / limit),
      },
    });
  } catch (error: unknown) {
    const err= error instanceof Error ? error : new Error("An unknown error occurred");
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to fetch orders",
      },
      { status: 500 }
    );
  }
}