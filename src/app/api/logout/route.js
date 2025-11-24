import { NextResponse } from "next/server";

export async function POST() {
  // Cookie delete karne ke liye uski expiry 0 kar di
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0), // immediately expire
    path: "/",
  });

  return response;
}
