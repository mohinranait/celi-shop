
import { categorySchema } from "@/components/validations/categories";
import { getAllDescendantIds } from "@/lib/category-utils";
import connectDB from "@/lib/db";
import { Category } from "@/models/categories";
import Product from "@/models/product";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10000");
    const status = searchParams.get("status");
    const isDelete = searchParams.get("isDelete");

    const skip = (page - 1) * limit;

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    if (status === "true") query.status = true;
    if (status === "false") query.status = false;
    if (isDelete === "true") query.isDelete = true;
    if (isDelete === "false") query.isDelete = false;

    // Fetch categories
    const categories = await Category.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Category.countDocuments(query);

    // =========================
    // Add totalProducts for each category (including nested)
    // =========================
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        // Get all descendant category IDs (self + children + grandchildren)
        const descendantIds = await getAllDescendantIds(cat._id.toString());

        // Count products in all these categories
        const totalProducts = await Product.countDocuments({
          category: { $in: descendantIds.map(id => new mongoose.Types.ObjectId(id)) },
          status: true,
          isDelete: false,
        });

        return {
          ...cat,
          totalProducts,           
        };
      })
    );

    return NextResponse.json({
      success: true,
      message: "Successfull",
      data: categoriesWithCount,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error fetching categories" },
      { status: 500 }
    );
  }
}



export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();


    // validate input
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "All field are required",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { slug } = parsed.data;




    // check duplicate slug
    const existing = await Category.findOne({ slug });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug already exists",
        },
        { status: 409 }
      );
    }


    // Create path
    let level = 0;
    let path : string[] = [];

    if (body.parentId) {
      const parent = await Category.findById(body.parentId);

      if (!parent) {
        throw new Error("Parent category not found");
      }

      level = parent.level + 1;

      path = [...parent.path, parent._id];
    }


    // create category
    const category = await Category.create({
     ...body,
     level,
     path,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        data: category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Category API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}