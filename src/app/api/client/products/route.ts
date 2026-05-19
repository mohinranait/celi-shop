import { getAllDescendantIds } from "@/lib/category-utils";
import connectDB from "@/lib/db";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
     const { searchParams } = new URL(req.url);

    const category  = searchParams.get("category");
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type") || "latest";
    const date = searchParams.get("date");
    const skip = (page - 1) * limit;

    /**
     * 1. NewProduct
     * 2. Feature
     * 3. Top Rated
     * 4. Best Selling
     * 5. Offer Product
     * */ 




    // =========================
    // BUILD QUERY
    // =========================
    const query:   Record<string, any>  = {
      status: true,
      isDelete: false,
    };

    //  SEARCH (name or slug)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

  

    
    // date filter
    if (date) {
      const start = new Date(date);
      const end = new Date(date);

      end.setHours(23, 59, 59, 999);

      query.createdAt = {
        $gte: start,
        $lte: end,
      };
    }




    let sortOption: any = { createdAt: -1 }; 

    switch (type.toLowerCase()) {
      case "featured":
        query.isFeatured = true;
        sortOption = { createdAt: -1 };
        break;

      case "toprated":
        sortOption = { "ratings.average": -1, createdAt: -1 };
        break;

      case "bestselling":
        sortOption = { totalSold: -1, createdAt: -1 };
        break;

      case "freeshipping":
        query["shipping.isFreeShipping"] = true;
        sortOption = { createdAt: -1 };
        break;

      case "related":
      if (!category) {
        throw new Error("Category is required");
      }
        const categoryIds = await getAllDescendantIds(category);
        query.category = { $in: categoryIds };
        sortOption = { createdAt: -1 };
        break;

      case "offer":
      case "discount":
        query.$or = [
          { 
            productType: "single",
            discountPrice: { $gt: 0}
          },
          {
            productType: "variant",
            variations: { 
              $elemMatch: { offerPriceFixed: { $gt: 0 } } 
            }
          }
        ];
        sortOption = { discountPercent: -1, createdAt: -1 };
        break;

      case "latest":
      case "new":
      default:
        sortOption = { createdAt: -1 };
        break;
    }


    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);;
    return NextResponse.json({ success: true, data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }, });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}