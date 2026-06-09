import connectDB from "@/lib/db";
import Order from "@/models/order";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  try {
    await connectDB();


    const result = await Order.aggregate([
      {
        $match: {
          orderStatus: "DELIVERED",
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: null,

          totalSales: {
            $sum: "$pricing.total",
          },

          totalOrders: {
            $sum: 1,
          },

         

          averageOrderValue: {
            $avg: "$pricing.total",
          },
        },
      },
    ]);



    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email")
      .lean();



    return NextResponse.json({
      success: true,
      data: {
        ...result[0],

        totalProducts: 0,
        lastOrders: orders,

      },
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error("An unknown error occurred");
    return NextResponse.json(
      {
        success: false,
        message: err,
      },
      {
        status: 500,
      }
    );
  }
}