
import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/db";
import Product from "@/models/product";
import { getAllDescendantIds } from "@/lib/category-utils";

export async function GET(req: NextRequest) {
  await connectDB();

  const category = req.nextUrl.searchParams.get("category");

  const matchStage: Record<string, any> = {
    isDelete: false,
    status: true,
    brand: { $exists: true, $ne: null, },
  };

  // category দিলে descendants সহ filter করো
  if (category) {
    const categoryIds = await getAllDescendantIds(category);
    matchStage.category = { $in: categoryIds };
  }

  // const brands = await Product.aggregate([
  //   { $match: matchStage },
  //   { $group: { _id: "$brand" } },
  //   {
  //     $lookup: {
  //       from: "brands",
  //       localField: "_id",
  //       foreignField: "_id",
  //       as: "brand",
  //     },
  //   },
  //   { $unwind: "$brand" },
  //   {
  //     $project: {
  //       _id: "$brand._id",
  //       name: "$brand.name",
  //       logo: "$brand.logo",
  //     },
  //   },
  //   { $sort: { name: 1 } },
  // ]);
  const brands = await Product.aggregate([
    { $match: matchStage },

    {
      $group: {
        _id: "$brand",
      },
    },

    {
      $lookup: {
        from: "brands",
        let: { brandId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$_id", "$$brandId"] },
                  { $eq: ["$isDelete", false] },
                  { $eq: ["$status", true] },
                ],
              },
            },
          },
        ],
        as: "brand",
      },
    },

    {
      $unwind: "$brand",
    },

    {
      $project: {
        _id: "$brand._id",
        name: "$brand.name",
        logo: "$brand.logo",
      },
    },

    {
      $sort: {
        name: 1,
      },
    },
  ]);

  return NextResponse.json({ success: true, data: brands });
}