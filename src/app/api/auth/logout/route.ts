import { NextResponse } from "next/server";

// Logout user
export async function DELETE() {
  try {

    
    // Clear the access_token cookie by setting it with past expiry
    const response = NextResponse.json(
      { message: "User logout", success: true },
      { status: 200 }
    );

    response.cookies.set({
      name: "access_token",
      value: "",
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      expires: new Date(0), 
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Logout failed", success: false },
      { status: 500 }
    );
  }
}