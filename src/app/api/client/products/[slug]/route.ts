import connectDB from "@/lib/db";
import Product from "@/models/product";
import { NextResponse } from "next/server";

// GET Product by SLUG
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  await connectDB();
  const {slug}  = await params;
  
  try {
    const product = await Product.findOne({slug: slug});
    if (!product) return NextResponse.json({ error: "Not Found" }, { status: 404 });
    return NextResponse.json({ data: product });
  } catch (error:any) {
     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}