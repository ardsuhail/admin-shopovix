import connectDB from "@/db/connectDB";
import Coupon from "@/model/Coupon";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    await connectDB();
    const { couponId } = await req.json();
    
    const coupon = await Coupon.findByIdAndDelete(couponId);
    
    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Coupon deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}