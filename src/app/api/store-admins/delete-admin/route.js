import AdminSignup from "@/model/AdminSignup";
import { NextResponse } from "next/server";
import connectDB from "@/db/connectDB";


export async function DELETE(req){
    try {
        await connectDB()
            const { adminId } = await req.json();
        const Admin=await AdminSignup.findByIdAndDelete(adminId)
        if(!Admin){
            return NextResponse.json({
                success:false,
                error:true,
                message:"Admin Not Found"
            })
        }
        return NextResponse.json({
            success:true,
            error:false,
            message:"Admin Deleted Successfully"
     
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