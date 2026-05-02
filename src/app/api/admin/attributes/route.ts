import { attributeSchema } from "@/components/validations/attributes";
import connectDB from "@/lib/db";
import Attribute from "@/models/attributes";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const status = searchParams.get("status"); // true / false / all
    const isDelete = searchParams.get("isDelete"); // true / false / all
    const date = searchParams.get("date");

    const skip = (page - 1) * limit;

    // =========================
    // BUILD QUERY
    // =========================
    const query:  {
      name?: string;
      slug?: string;
       createdAt?: {
        $gte?: Date;
        $lte?: Date;
      };
      status?: boolean;
      isDelete?: boolean;
       $or?: {
        name?: { $regex: string; $options: string };
        slug?: { $regex: string; $options: string };
      }[];
    } = {};

    //  SEARCH (name or slug)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    //  STATUS FILTER
    if (status === "true") query.status = true;
    if (status === "false") query.status = false;

    // 🗑 SOFT DELETE FILTER
    if (isDelete === "true") query.isDelete = true;
    if (isDelete === "false") query.isDelete = false;

    
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
    

    // =========================
    // DB QUERY
    // =========================
    const attributes = await Attribute.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Attribute.countDocuments(query);

    // =========================
    // RESPONSE
    // =========================
    return NextResponse.json({
      success: true,
      data: attributes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching attributes" },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();


    // validate input
    const parsed = attributeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }



    // create attribute
    const attribute = await Attribute.create({
     ...body
    });

    return NextResponse.json(
      {
        success: true,
        message: "Attribute created successfully",
        data: attribute,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Attribute API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}