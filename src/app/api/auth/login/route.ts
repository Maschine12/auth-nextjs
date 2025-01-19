import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/libs/mongodb";
import User, { IUser } from "@/models/User";
import { messages } from "@/utils/messages";
import bcrypt from "bcryptjs";
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
        if(!isCorrect){
            return NextResponse.json(
                {
                    message: messages.error.incorrectPassword
                },
                {
                    status:400
                }
            )
        }



        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {

    }

}