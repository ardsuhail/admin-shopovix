import { NextResponse } from "next/server";
import connectDB from "@/db/connectDB";
import CustomerQuery from "@/model/CustomerQuery";

export async function GET(req){
  try {
    await connectDB()
    const queries=await CustomerQuery.find().sort({createdAt: -1})
    return NextResponse.json({success:true,queries})
  } catch (error) {
      console.error("Error fetching queries:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
      }
  }
