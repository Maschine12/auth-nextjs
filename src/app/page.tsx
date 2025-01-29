"use client";
import { Form } from "@/components/form";

export default function Home() {
    const handleSubmit = (values: Record<string, string>) => {
        console.log(values);
    };

    return (
        <Form onSubmit={handleSubmit} title="Login">
            <Form.Input label="Email" name="email" placeholder="Ingrese su correo electrónico" type="text" value="" onChange={(name, value) => console.log(name, value)}/>
            <Form.Input label="Contraseña" name="passworn" placeholder="*************" type="password" value="" onChange={(name, value) => console.log(name, value)}/>
            <Form.Footer
                description="¿Olvidaste tu contraseña? "
                textLink="Recuperar Cuenta"
                link="http://localhost:3000/change-password"

            />
        </Form>
    );
}
