"use client";
import { Form } from "@/components/form";

export default function Home() {
    const handleSubmit = (values: Record<string, string>) => {
        console.log(values);
    };

    return (
        <Form onSubmit={handleSubmit} title="Login">
            <Form.Input
                label="Email"
                name="email"
                placeholder="Enter your email"
                type="text"
                value=""
                onChange={(name, value) => console.log(name, value)}
            />
        </Form>
    );
}
