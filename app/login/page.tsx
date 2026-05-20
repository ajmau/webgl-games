"use client";
import Link from "next/link";
import { useState } from "react";
import { login } from "@/lib/auth";
import { redirect } from "next/navigation";
import {  BasicCard } from "../components/BasicCard";

export default function LoginPage() {
  const [error, setError] = useState("");

  async function loginUser(formData) {

    setError("");

    const username = formData.get("username");
    const password = formData.get("password");

    if (username && password) {
        const result = await login(username, password);
        if (result.status === "failed") {
            setError(result.message);
            return;
        }

        if (result.status === "ok") {
            redirect("/");
        }

    } else {
        setError("Please provide Username and Password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 font-sans">
      <BasicCard>
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
        <form action={loginUser} className="space-y-4">
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
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 mt-2 bg-gray-600 hover:bg-gray-500 rounded-md text-gray-100 font-bold transition"
          >
            Login
          </button>
        </form>
        <Link href="/signup">Don't have an account?</Link>
      </BasicCard>
    </div>
  );
}