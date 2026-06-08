
import connectDB from '@/lib/db';
import Faq from '@/models/faq';
import { NextRequest, NextResponse } from 'next/server';

// GET all FAQs
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;


    const query: {
      title?: string;
      status?: boolean;
      isDelete?: boolean;
      $or?: {
        title?: { $regex: string; $options: string };
      }[];
    } = {};

    //  SEARCH (name or slug)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
      ];
    }

    //  STATUS FILTER
    if (status === "true") query.status = true;
    if (status === "false") query.status = false;





    const faqs = await Faq.find(query).sort({ priority: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);;

    return NextResponse.json(
      { success: true, data: faqs },
      { status: 200 }
    );
  } catch (error) {


    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// CREATE a new FAQ
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { title, contents, priority, status } = body;

    if (!title || !contents || !Array.isArray(contents) || contents.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Title and at least one content item are required' },
        { status: 400 }
      );
    }

    const faq = new Faq({
      title,
      contents,
      priority: priority || 10,
      status: status !== undefined ? status : true,
    });

    await faq.save();

    return NextResponse.json(
      { success: true, data: faq },
      { status: 201 }
    );
  } catch (error) {
     const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error:errorMessage },
      { status: 500 }
    );
  }
}