import connectDB from "@/lib/db";
import { RequestQuote } from "@/models/request-quote";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const result = await RequestQuote.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: "Request quote not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Request quote deleted successfully",
    });
  } catch (error) {
     const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}