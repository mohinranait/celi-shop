
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const status = searchParams.get("status");
    const role = searchParams.get("role");
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
      status?: "Active"|"Pending"|"Banned";
      role?: "Admin" | "User";
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
    if (status ) query.status = status as "Active" | "Pending" | "Banned";
    if (role ) query.role = role as "Admin" | "User";



    
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
    const users = await User.find(query)
    .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    // =========================
    // RESPONSE
    // =========================
    return NextResponse.json({
      success: true,
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching users" },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();


    // validate input
    // const parsed = brandSchema.safeParse(body);

    // if (!parsed.success) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "Validation failed",
    //       errors: parsed.error.flatten().fieldErrors,
    //     },
    //     { status: 400 }
    //   );
    // }

    // const { slug } = parsed.data;

    // check duplicate slug
    // const existing = await User.findOne({ slug });

    // if (existing) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "Slug already exists",
    //     },
    //     { status: 409 }
    //   );
    // }

    // create user
    const user = await User.create({
     ...body
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        data: user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("User API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}