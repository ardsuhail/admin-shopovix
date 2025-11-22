import Customer from "@/model/Customer";
import Order from "@/model/Order";
import connectDB from "@/db/connectDB";
// import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { createShiprocketOrder } from "../../../../utils/shiprocket";




// ✅ Helper function for image URL
function getImageUrl(product) {
  if (!product) return "";

  if (Array.isArray(product.image)) {
    return product.image[0]?.url || product.image[0]?.src || product.image[0] || "";
  }

  return product.image?.url || product.image?.src || product.image || "";
}

// ✅ GET Latest Customer
export async function GET(req) {
  try {
    await connectDB();

    const customer = await Customer.find().sort({ createdAt: -1 });

    if (!customer) {
      return NextResponse.json({
        success: false,
        message: "No customer found"
      });
    }

    return NextResponse.json({
      success: true,
      customer
    });

  } catch (err) {
    console.error("GET Customer Error:", err);
    return NextResponse.json({
      success: false,
      message: err.message
    }, { status: 500 });
  }
}