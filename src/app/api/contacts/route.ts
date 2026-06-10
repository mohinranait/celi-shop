import { contactFormSchema } from "@/components/validations/contact";
import connectDB from "@/lib/db";
import Contact from "@/models/contact.modal";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();


    // validate input
    const parsed = contactFormSchema.safeParse(body);

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



    // create contact
    const contact = await Contact.create({
     ...body
    });

    return NextResponse.json(
      {
        success: true,
        message: "Successfully",
        data: contact,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}