"use server"
import { prisma } from "./prisma";
import bcrypt from "bcrypt";
import "dotenv/config";
import { cookies } from "next/headers";
import { setSession } from "./session";

export type AuthResult = 
  | { status: "ok"; message: string }
  | { status: "failed"; message: string };

/*
const key = new TextEncoder().encode(`${process.env.JWT_SECRET}`);

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('10 sec from now')
        .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}
  */

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
        setSession(user.name);

        return { status: "ok", message: "Login successful" };

    } catch (e) {
        console.error("Login error:", e);
        return { status: "failed", message: "Login failed" };
    }
}