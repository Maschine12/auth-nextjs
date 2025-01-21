import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/libs/mongodb";
import { messages } from "@/utils/messages";
import User from "@/models/User";
import { Resend } from "resend";
import jwt from "jsonwebtoken";

const resend = new Resend("re_MnUwYQsV_C9g5P7FQdttfLb7n9CZtEPEk");

export async function POST(request: NextRequest) {
    try {
        const body: { username: string } = await request.json();
        const { username } = body;

        await connectMongoDB();
        const userFind = await User.findOne({ username });

        if (!userFind) {
            return NextResponse.json(
                { message: messages.error.userNotFound },
                { status: 400 }
            );
        }

        const tokenData = {
            email: userFind.username,
            userId: userFind._id,
        };

        const token = jwt.sign(
            { data: tokenData },
            process.env.SECRET_KEY || "defaultSecret",
            { expiresIn: 86400 }
        );

        const forgetUrl = `http://localhost:3000/changePass?token=${token}`;

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: userFind.username,
            subject: "Cambio de contraseña",
            html: `
                <h1>Cambio de contraseña</h1>
                <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                <a href="${forgetUrl}">Restablecer contraseña</a>
            `,
        });

        return NextResponse.json(
            { message: messages.success.emailSend },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: messages.error.default, error: error },
            { status: 500 }
        );
    }
}
