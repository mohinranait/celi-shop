import { getAuthUser } from "@/lib/authUser";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const decoded = await getAuthUser();
    let decodedUser: { id: string; phone: string };

    if (typeof decoded === "string" || !decoded || !("id" in decoded) || !("phone" in decoded)) {
      return NextResponse.json({ success: false, error: "Invalid token payload" }, { status: 401 });
    } else {
      decodedUser = { id: decoded.id, phone: decoded.phone };
    }

    await connectDB();

    const user = await User.findById(decodedUser.id).select("-password");

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Authenticated user fetched",
      payload: user,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 401 });
  }
}




