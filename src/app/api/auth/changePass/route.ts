import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/libs/mongodb";
import { messages } from "@/utils/messages";
import { headers } from "next/headers";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"

interface BodyProps {
    newPassword: string
    confirmPassword: string
}

export async function POST(request: NextRequest) {
    try {
        const body: BodyProps = await request.json();
        const { newPassword, confirmPassword } = body;

        //validacion campos
        if (!newPassword || !confirmPassword) {
            return NextResponse.json(
                {
                    message: messages.error.default
                },
                {
                    status: 400
                }
            )
        }

        await connectMongoDB();
        const headerList = headers();
        const token = (await headerList).get("token")

        //validacion de token
        if (!token) {
            return NextResponse.json(
                {
                    message: messages.error.notAuthorized
                },
                {
                    status: 400
                }
            )
        }

        try {
            const isTokenValid = jwt.verify(token, "secreto")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data } = (isTokenValid as any)?.data;
            const userFind = await User.findById(data.userId);


            if (!data || !data.userId) {
                return NextResponse.json(
                    {
                        message: messages.error.needToken
                    },
                    {
                        status: 400
                    }
                );
            }
            //validacion de existencia de usuarios
            if (!userFind) {
                return NextResponse.json(
                    {
                        message: messages.error.userNotFound
                    },
                    {
                        status: 400
                    }
                )
            }

            //validacion de nueva contraseña
            if (newPassword !== confirmPassword) {
                return NextResponse.json(
                    {
                        message: messages.error.passwordsNotMatch
                    },
                    {
                        status: 400
                    }
                )
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10)

            userFind.password = hashedPassword;

            await userFind.save();

            return NextResponse.json(
                {
                    message: messages.success.passwordChanged
                },
                {
                    status: 200
                }
            )

        } catch (error) {
            return NextResponse.json(
                {
                    message: messages.error.tokenInvalid, error
                },
                {
                    status: 400
                }
            )
        }

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
