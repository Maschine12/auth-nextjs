"use client";
import React from "react";
import styles from "./styles.module.scss";

interface InputProps {
    type?: "text" | "password";
    name: string;
    label: string;
    placeholder?: string;
    value: string;
    onChange: (name: string, value: string) => void;
}

export function Input({ label, name, placeholder, type, value, onChange }: InputProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        onChange(name, value);
    };

    return (
        <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor={name}>
                {label}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className={styles.input}
            />
        </div>
    );
}
