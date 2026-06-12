import connectDB from "@/lib/db";
import SiteContent from "@/models/site-content";
import { NextResponse } from "next/server";


// GET Site Content
export async function GET() {
  try {
    await connectDB();

    let content = await SiteContent.findOne();


    if(!content){
       content = await SiteContent.create({
        whyChooseUs:{
          title: "Why choose Us",
        },
        companyIntroduction: {
          title: "About company"
        }
       });
    }

    return NextResponse.json({
      success: true,
      message: "Site content fetched successfully",
      data: content,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch site content",
      },
      {
        status: 500,
      }
    );
  }
}


// CREATE OR UPDATE Site Content
export async function PATCH(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    let content = await SiteContent.findOne();

    if (content) {
      // Update existing document
      content = await SiteContent.findByIdAndUpdate(
        content._id,
        body,
        {
          new: true,
          runValidators: true,
        }
      );
    } else {
      // Create new document
      content = await SiteContent.create(body);
    }

    return NextResponse.json({
      success: true,
      message: content
        ? "Site content saved successfully"
        : "Operation completed",
      data: content,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save site content",
      },
      {
        status: 500,
      }
    );
  }
}