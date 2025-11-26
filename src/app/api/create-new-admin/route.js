import AdminSignup from "@/model/AdminSignup";
import { NextResponse } from "next/server";
import connectDB from "@/db/connectDB";
import bcrypt from 'bcrypt'
export async function POST(req){
    try {
        await connectDB()
        const body=await req.json()
        const {userName,email,password}=body
        if(!userName || !email || !password){
            return NextResponse.json({
                success:false,
                error:true,
                message:'all fields are required'
            })
        }
        const existingAdmin=await AdminSignup.findOne({email})
        if(existingAdmin){
            return NextResponse.json({success:false,error:true,message:"Admin Already exists"})
        }

         const hashedPassword=await bcrypt.hash(password,10)
        const newAdmin=await AdminSignup.create({
            userName,
            email,
            password:hashedPassword
        })
        return NextResponse.json({
            success:true,
            error:false,
            message:'Admin Created Successfully',
            
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success:false,
            error:true,
            message:'Server Error Please try again'
        })
    }
}





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