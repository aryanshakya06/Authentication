import { z } from "zod";

const NAME_REGEX = /^[a-zA-Z\s'.-]+$/;

const emailField = z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email");

const strongPassword = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[a-z]/, "Password must include a lowercase letter")
    .regex(/[0-9]/, "Password must include a number")
    .regex(/[^A-Za-z0-9]/, "Password must include a symbol");

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name is too short")
        .max(50, "Name is too long")
        .regex(NAME_REGEX, "Name contains invalid characters"),
    email: emailField,
    password: strongPassword
});

export const loginSchema = z.object({
    email: emailField,
    password: z.string().min(1, "Password is required")
});

export const forgotPasswordSchema = z.object({
    email: emailField
});

export const resetPasswordSchema = z.object({
    password: strongPassword
});
