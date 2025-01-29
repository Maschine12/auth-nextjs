"use client"
import { createContext, useState } from "react"
import styles from "./styles.module.scss"
import { Input } from "./components/Input"
import { Footer } from "./components/Footer"

type FormValues = Record<string , string>

interface FormContextType {
    formValues: FormValues
    setFormValues: React.Dispatch<React.SetStateAction<FormValues>>
}

interface FormProps {
    title: string
    description?: string
    onSubmit: (values: FormValues) => void
    children: React.ReactNode
}

export const FormContext = createContext<FormContextType | undefined>(undefined);

export function Form({ title, children, onSubmit, description }: FormProps) {

    const [formValues, setFormValues] = useState<FormValues>({})

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        onSubmit(formValues)
    }
    return (
        <FormContext.Provider value={{ formValues, setFormValues }}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.descriptionContainer}>
                    <h2>{title}</h2>
                    {description && <p>{description}</p>}
                </div>
                {children}
            </form>
        </FormContext.Provider>
    )
}

Form.Input = Input
Form.Footer = Footer