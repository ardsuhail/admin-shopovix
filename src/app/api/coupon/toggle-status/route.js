import connectDB from "@/db/connectDB";
import Coupon from "@/model/Coupon";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    await connectDB();
    const { couponId, isActive } = await req.json();
    
    const coupon = await Coupon.findByIdAndUpdate(
      couponId,
      { isActive },
      { new: true }
    );
    
    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Coupon updated successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}