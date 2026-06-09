import connectDB from "@/lib/db";
import Order from "@/models/order";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const period = searchParams.get("period") || "week";

    const now = new Date();

    const startDate = new Date();

    if (period === "today") {
      startDate.setHours(0, 0, 0, 0);
    } else if (period === "week") {
      startDate.setDate(now.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
    } else {
      startDate.setDate(now.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);
    }

    const matchStage = {
      orderStatus: "DELIVERED",
      createdAt: {
        $gte: startDate,
      },
    };

    let groupStage: any;

    if (period === "today") {
      groupStage = {
        _id: {
          hour: {
            $hour: "$createdAt",
          },
        },
        revenue: {
          $sum: "$pricing.total",
        },
      };
    } else {
      groupStage = {
        _id: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
        },
        revenue: {
          $sum: "$pricing.total",
        },
      };
    }

    const revenueData = await Order.aggregate([
      {
        $match: matchStage,
      },
      {
        $group: groupStage,
      },
      {
        $sort: {
          "_id.date": 1,
          "_id.hour": 1,
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: revenueData,
    });
  } catch (error) {
     const err= error instanceof Error ? error : new Error("An unknown error occurred");
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