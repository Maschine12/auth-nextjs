import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/libs/mongodb";
import User, { IUser } from "@/models/User";
import { messages } from "@/utils/messages";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
    try {
        await connectMongoDB();
        const body: IUser = await request.json();
        const { username, password } = body;
        //validacion de envio de campos
        if (!username || !password) {
            return NextResponse.json(
                { message: messages.error.needProps }
                ,
                { status: 400 }
            );
        }

        const userFind = await User.findOne({ username });

        //validacion de existencia del usuario
        if (!userFind) {
            return NextResponse.json(
                {
                    message: messages.error.userNotFound
                },
                {
                    status: 400
                }
            );
        }

        const isCorrect: boolean = await bcrypt.compare(
            password,
            userFind.password
        );

        //validacion de contraseña correcta
        if (!isCorrect) {
            return NextResponse.json(
                {
                    message: messages.error.incorrectPassword
                },
                {
                    status: 400
                }
            )
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: userPass, rest } = userFind._doc;

        const token = jwt.sign(
            { data: rest },
            "secreto",
            { expiresIn: 86400 }
        )

        const response = NextResponse.json(
            { userLogged: rest, message: messages.success.userLogged },
            { status: 200 }
        );
        response.cookies.set("auth_cookie", token, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 86400,
            path: "/"
        })
        return response;
    } catch (error) {
        return NextResponse.json(
            { message: messages.error.default, error },
            { status: 500 }
        );
    }

}