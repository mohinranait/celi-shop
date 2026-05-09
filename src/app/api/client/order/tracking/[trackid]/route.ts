import connectDB from "@/lib/db";
import Order from "@/models/order";
import { NextResponse } from "next/server";


// Get order by tracking Number
export async function GET(req: Request, { params }: { params: Promise<{ trackid: string }> }) {
  await connectDB();
  const {trackid}  = await params;
  
  try {
    const order = await Order.findOne({trackingNumber:trackid});
    if (!order) return NextResponse.json({ error: "Not Found" }, { status: 404 });
    return NextResponse.json({ data: order });
  } catch (error:any) {
     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

