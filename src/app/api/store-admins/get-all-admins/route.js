import AdminSignup from "@/model/AdminSignup";
import { NextResponse } from "next/server";
import connectDB from "@/db/connectDB";


export async function GET(req){
    try {
        await connectDB()
        const admins=await AdminSignup.find().sort({createdAt: -1})
        return NextResponse.json({
            sucess:true,
            error:false,
            admins
        })
    } catch (error) {
        console.log(error)
        console.log(error.message)
        return NextResponse.json({
            success:false,
            error:true,
            message:"Server Error Please Try Again Later"
        })
    }
}