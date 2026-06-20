import connectDB from "@/lib/db";
import Order from "@/models/order";
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



export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const body = await req.json();
    const { id } = await params;



    //  check order exists
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    const { orderStatus, payment } = body
    const { status } = payment;

    console.log({ status, orderStatus });


    //  update order
    // const updatedOrder = await Order.findByIdAndUpdate(
    //   id,
    //   { ...order, orderStatus, payment: {...order.payment, status } },
    //   { new: true, runValidators: true }
    // );
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        $set: {
          orderStatus,
          "payment.status": status,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Brand updated successfully",
        data: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update order Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}