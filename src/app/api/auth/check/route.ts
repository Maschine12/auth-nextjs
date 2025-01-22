import { connectMongoDB } from "@/libs/mongodb";
import { messages } from "@/utils/messages";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken"
import User from "@/models/User";

export async function GET() {
    try {
        const headerList = headers();
        const token = (await headerList).get("token");

        if (!token) {
            return NextResponse.json(
                {
                    message: messages.error.notAuthorized
                }, {
                status: 400
            }
            )
        }
        try {
            const isTokenValid = jwt.verify(token, "secreto");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data } = (isTokenValid as any)?.data;
            await connectMongoDB();
            const userFind = await User.findById(data.id)

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
            return NextResponse.json(
                {
                    isAuthorized: true, message: messages.success.userAuthorized
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