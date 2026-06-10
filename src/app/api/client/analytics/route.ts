import { getAuthUser } from "@/lib/authUser";
import Order from "@/models/order";
import { TOrderStatus } from "@/redux/service/orders/type";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

type TOrderAnalyticsResult = {
  overview: {
    totalOrders: number;
    totalShopping: number;
    totalSaving: number;
  }[];

  statusCounts: {
    _id: TOrderStatus;
    count: number;
  }[];
};

export async function GET() {
  try {
    const decoded = (await getAuthUser()) as {
      id: string;
      phone: string;
    };

    const userId = decoded?.id;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Invalid token",
        },
        {
          status: 401,
        }
      );
    }

    const result = await Order.aggregate<TOrderAnalyticsResult>([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          isDeleted: false,
        },
      },

      {
        $facet: {
          overview: [
            {
              $group: {
                _id: null,

                totalOrders: {
                  $sum: 1,
                },

                totalShopping: {
                  $sum: "$pricing.total",
                },

                totalSaving: {
                  $sum: "$pricing.discount",
                },
              },
            },
          ],

          statusCounts: [
            {
              $group: {
                _id: "$orderStatus",
                count: {
                  $sum: 1,
                },
              },
            },
          ],
        },
      },
    ]);

    const overview = result[0]?.overview[0] || {
      totalOrders: 0,
      totalShopping: 0,
      totalSaving: 0,
    };

    const ordersByStatus: Record<TOrderStatus, number> = {
      PENDING: 0,
      CONFIRMED: 0,
      PROCESSING: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
      RETURNED: 0,
    };

    result[0]?.statusCounts.forEach((item) => {
      ordersByStatus[item._id] = item.count;
    });

    return NextResponse.json(
      {
        success: true,
        message: "Customer analytics fetched successfully",
        data: {
          totalOrders: overview.totalOrders,
          totalShopping: overview.totalShopping,
          totalSaving: overview.totalSaving,
          ordersByStatus,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Customer analytics error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}