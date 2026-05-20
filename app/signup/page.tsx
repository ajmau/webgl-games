"use client";

import Link from "next/link";
import { useState } from "react";
import { signup } from "@/lib/auth";
import { BasicCard } from "../components/BasicCard";

export default function LoginPage() {
  const [error, setError] = useState("");

  async function signupUser(formData) {

    setError("");

    const username = formData.get("username");
    const password = formData.get("password");
    const passwordCheck = formData.get("passwordCheck");

    if (password !== passwordCheck) {
        setError("Passwords not matching!");
        return;
    }

    try {
        if (username && password) {
            signup(username, password)
        }
    } catch (e) {
        if (e instanceof Error) {
            setError(e.message);
        }
    }

    //redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 font-sans">
      <BasicCard>
        <h1 className="text-3xl font-bold text-center mb-6">Signup</h1>
        <form action={signupUser} className="space-y-4">
          <div>
            <label className="block mb-1">Username:</label>
            <input
              type="username"
              name="username"
              required
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label className="block mb-1">Password:</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label className="block mb-1">Password:</label>
            <input
              type="password"
              name="passwordCheck"
              required
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
 
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 mt-2 bg-gray-600 hover:bg-gray-500 rounded-md text-gray-100 font-bold transition"
          >
            Login
          </button>
        </form>
        <Link href="/login">Already have an account?</Link>
      </BasicCard>
    </div>
  );
}