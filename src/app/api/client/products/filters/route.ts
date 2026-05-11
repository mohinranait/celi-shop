
import { NextRequest, NextResponse } from "next/server";

import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Product from "@/models/product";
import "@/models/brand.model";   
import "@/models/categories"; 
import { getAllDescendantIds } from "@/lib/category-utils";



export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = req.nextUrl;

  const category  = searchParams.get("category");
  const brandParam = searchParams.get("brand");
  const minPrice  = searchParams.get("minPrice");
  const maxPrice  = searchParams.get("maxPrice");
  const minRating = searchParams.get("minRating");
  const sort      = searchParams.get("sort") || "default";
  const page      = parseInt(searchParams.get("page") || "1");
  const limit     = parseInt(searchParams.get("limit") || "20");

  const brands = brandParam
    ? brandParam.split(",").map((b) => b.trim()).filter((b) => b.length === 24)
    : [];

  const filter: Record<string, any> = {
    isDelete: false,
    status: true,
  };

  // Category + সব descendants
  if (category) {
    const categoryIds = await getAllDescendantIds(category);
    filter.category = { $in: categoryIds };
  }

  if (brands.length > 0) {
    filter.brand = { $in: brands.map((b) => new mongoose.Types.ObjectId(b)) };
  }

  if (minPrice || maxPrice) {
    const priceFilter: Record<string, number> = {};
    if (minPrice) priceFilter.$gte = Number(minPrice);
    if (maxPrice) priceFilter.$lte = Number(maxPrice);

    filter.$or = [
      { productType: "single", price: priceFilter },
      { productType: "variant", "variations.price": priceFilter },
    ];
  }

  if (minRating) {
    filter["ratings.average"] = { $gte: Number(minRating) };
  }

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    price_asc:  { price: 1 },
    price_desc: { price: -1 },
    rating:     { "ratings.average": -1 },
    newest:     { createdAt: -1 },
    default:    { isFeatured: -1, createdAt: -1 },
  };
  const sortQuery = sortMap[sort] || sortMap.default;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("brand", "name logo")
      .populate("category", "name")
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return NextResponse.json({
    success: true,
    data: products,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}