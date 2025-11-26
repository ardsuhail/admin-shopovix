import connectDB from "@/db/connectDB";
import Coupon from "@/model/Coupon";
import { NextResponse } from "next/server";
export async function POST(req) {

  try {
    await connectDB();
    const body = await req.json();

    const exists = await Coupon.findOne({ code: body.code.toUpperCase() });
    if (exists) {
      return NextResponse.json({ error: "Coupon already exists!" }, { status: 400 });
    }

    await Coupon.create({
      code: body.code,
      discountType: body.discountType,
      discountValue: body.discountValue,
      minOrderAmount: body.minOrderAmount,
      expiresAt: body.expiresAt
    });

    return NextResponse.json({ message: "Coupon created successfully" });
  } catch (err) {
    console.error(err)
     console.log(err)
     console.log(err.message)
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


export async function GET() {
  try {
    await connectDB();
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return NextResponse.json({ coupons });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}