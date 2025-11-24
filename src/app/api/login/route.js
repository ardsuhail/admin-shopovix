import AdminSignup from "@/model/AdminSignup";
import connectDB from "@/db/connectDB";
import bcrypt from 'bcrypt'
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        await connectDB()
        const body = await req.json()
        const { email, password } = body
        const admin = await AdminSignup.findOne({ email })
        if (!admin) {
            return NextResponse.json({
                success: false,
                error: true,
                message: "Admin Not Found"
            })
        }
        const ComparePassword = await bcrypt.compare(password, admin.password)
        if (!ComparePassword) {
            return NextResponse.json({
                success: false,
                error: true,
                message: "Invalid Password"
            })
        }
        const token = jwt.sign(
            { email: admin.email, userName: admin.userName, id: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const response = NextResponse.json({
            success: true,
            error: false,
            message: "Login Successfully",
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24,
            path: "/",
        });
        return response;

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            error: true,
            message: "Server Error please Try Again later"
        })
    }
}