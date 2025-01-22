import { connectMongoDB } from "@/libs/mongodb";
import User from "@/models/User";
import { messages } from "@/utils/messages";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectMongoDB();
        const users = await User.find();
        return NextResponse.json(
            {
                users
            },
            {
                status: 200
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                message: messages.error.default, error
            },
            {
                status: 400
            }
        )
    }
}