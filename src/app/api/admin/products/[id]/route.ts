import connectDB from "@/lib/db";
import Product from "@/models/product";
import { NextResponse } from "next/server";


export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const product = await Product.findById(params.id);
  if (!product) return NextResponse.json({ error: "Not Found" }, { status: 404 });
  return NextResponse.json({ data: product });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await req.json();
  const updatedProduct = await Product.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json({ data: updatedProduct });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await Product.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Deleted successfully" });
}
