import connectDB from "@/lib/db";
import Order from "@/models/order";
import Product from "@/models/product";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Get order by OrderID
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;

  try {
    const order = await Order.findById(id);
    if (!order) return NextResponse.json({ error: "Not Found" }, { status: 404 });
    return NextResponse.json({ data: order });
  } catch (error) {
    console.error("Update order Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error", }, { status: 500 });
  }
}



// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectDB();

//     const body = await req.json();
//     const { id } = await params;



//     //  check order exists
//     const order = await Order.findById(id);

//     if (!order) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Order not found",
//         },
//         { status: 404 }
//       );
//     }

//     const { orderStatus, payment } = body
//     const { status } = payment;
//     // orderStatus = Cancle , Return

//     const updatedOrder = await Order.findByIdAndUpdate(
//       id,
//       {
//         $set: {
//           orderStatus,
//           "payment.status": status,
//         },
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Brand updated successfully",
//         data: updatedOrder,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Update order Error:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Internal Server Error",
//       },
//       { status: 500 }
//     );
//   }
// }


export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const body = await req.json();
    const { id } = await params;

    const { orderStatus, payment } = body;

    const order = await Order.findById(id).session(session);

    if (!order) {
      throw new Error("Order not found");
    }

    const previousStatus = order.orderStatus;

    // Restore stock only once
    const shouldRestoreStock =
      !["CANCELLED", "RETURNED"].includes(previousStatus) &&
      ["CANCELLED", "RETURNED"].includes(orderStatus);

    if (shouldRestoreStock) {
      for (const item of order.items) {
        if (!item.variationId) {
          // Single Product
          await Product.updateOne(
            {
              _id: item.productId,
            },
            {
              $inc: {
                stock: item.quantity,
                totalSold: -item.quantity,
              },
            },
            { session }
          );
        } else {
          // Variant Product
          await Product.updateOne(
            {
              _id: item.productId,
              "variations._id": item.variationId,
            },
            {
              $inc: {
                "variations.$.stock": item.quantity,
                stock: item.quantity,
                 totalSold: -item.quantity,
              },
            },
            { session }
          );
        }
      }
    }

    // Update order
    order.orderStatus = orderStatus;

    if (payment?.status) {
      order.payment.status = payment.status;
    }

    if (orderStatus === "CANCELLED") {
      order.cancelledAt = new Date();
    }

    if (orderStatus === "DELIVERED") {
      order.deliveredAt = new Date();
    }

    await order.save({ session });

    await session.commitTransaction();

    return NextResponse.json(
      {
        success: true,
        message: "Order updated successfully",
        data: order,
      },
      { status: 200 }
    );
  } catch (error: any) {
    await session.abortTransaction();

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();


    const { id } = await params;


    //  check order exists
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }



    return NextResponse.json(
      {
        success: true,
        message: "Order delete successfully",
        data: order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Order Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}