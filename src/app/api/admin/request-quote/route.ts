import connectDB from "@/lib/db";
import { RequestQuote } from "@/models/request-quote";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const date = searchParams.get("date");

    const skip = (page - 1) * limit;

    // =========================
    // BUILD QUERY
    // =========================
   const query: Record<string, any> = {};

    //  SEARCH (name or slug)
    if (search) {
      query.$or = [
        {
          "request.name": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "request.phone": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "request.whatsappNumber": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "location.district": {
            $regex: search,
            $options: "i",
          },
        },
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

    const result = await RequestQuote.find(query)
      .populate("productId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);;

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const result = await RequestQuote.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Request quote created successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}