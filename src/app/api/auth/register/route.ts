import { NextRequest, NextResponse } from "next/server";
import { isValidEmail } from "@/utils/isValidEmail";
import { connectMongoDB } from "@/libs/mongodb";
import { messages } from "@/utils/messages";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        await connectMongoDB();
        const body = await request.json();
        const { email, password, confirmPassword } = body;

        // Validar los datos del usuario
        if (!email || !password || !confirmPassword) {
            return NextResponse.json({ message: messages.error.needProps }, { status: 400 });
        }
        if (!isValidEmail(email)) {
            return NextResponse.json({ message: messages.error.emailNotValid }, { status: 400 });
        }
        if (password !== confirmPassword) {
            return NextResponse.json({ message: messages.error.passwordsNotMatch }, { status: 400 });
        }

        // Verificar si el usuario ya existe
        const userFind = await User.findOne({ email });
        if (userFind) {
            return NextResponse.json({ message: messages.error.emailExist }, { status: 400 });
        }

        // Crear y guardar el nuevo usuario
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ username: email, password: hashedPassword });
        const savedUser = await newUser.save();

        // Generar token
        const secret = process.env.JWT_SECRET || "defaultSecret";
        const token = jwt.sign({ data: savedUser._id }, secret, { expiresIn: "1d" });

        // Configurar respuesta con cookie
        const response = NextResponse.json(
            { newUser: savedUser, message: messages.success.userCreated },
            { status: 200 }
        );
        response.cookies.set("auth_cookie", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 86400,
            path: "/",
        });

        return response;
    } catch (error) {
        console.log("Error al crear el usuario:", error); // Muestra detalles del error en consola
        return NextResponse.json({ message: messages.error.default }, { status: 500 });
    }
}
