"use server"
import { prisma } from "./prisma";
import bcrypt from "bcrypt";
import "dotenv/config";
import { cookies } from "next/headers";
//import { setSession } from "./session";
import { encrypt } from "./session";

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
        
        // set session cookie
        const expires = new Date(Date.now() + 100*1000);
        const session = await encrypt( {username: user.name, expires} );
        console.log("set session: ", session);
        (await cookies()).set("session", session, {expires, httpOnly: true})

        return { status: "ok", message: "Login successful" };

    } catch (e) {
        console.error("Login error:", e);
        return { status: "failed", message: "Login failed" };
    }
}