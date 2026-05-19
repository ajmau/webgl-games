"use server"
import { prisma } from "./prisma";
import bcrypt from "bcrypt";

export type AuthResult = 
  | { status: "ok"; message: string }
  | { status: "failed"; message: string };

export async function signup(username: string, password: string): Promise<AuthResult> {
    try {
        const existingUser = await prisma.user.findUnique({ where: { name: username } });
        if (existingUser) {
            return { status: "failed", message: "Username already exists" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name: username, password: hashedPassword }
        });

        console.log("Created user: ", { id: user.id, name: user.name });
        return { status: "ok", message: "User created" };

    } catch (e) {
        console.error("Signup error:", e);
        return { status: "failed", message: "Signup failed" };
    }
}

export async function login(username: string, password: string): Promise<AuthResult> {
    try {
        const user = await prisma.user.findUnique({ where: { name: username } });
        if (!user || !user.password) {
            return { status: "failed", message: "Invalid credentials" };
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return { status: "failed", message: "Invalid credentials" };
        }

        console.log("User logged in:", { id: user.id, name: user.name });
        return { status: "ok", message: "Login successful" };

    } catch (e) {
        console.error("Login error:", e);
        return { status: "failed", message: "Login failed" };
    }
}