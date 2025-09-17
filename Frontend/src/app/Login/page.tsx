"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/ContextAPI";
import { useModal } from "@/components/ModalProvider";

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { showAlert, showConfirm } = useModal();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!email || !password) {
        await showAlert("Please enter both email and password");
        return;
      }
      await login(email, password);
    } catch (err) {
      let message = "Invalid email or password";
      if (err instanceof Error && err.message) {
        message = err.message;
      }
      showAlert(message);
      if (process.env.NODE_ENV === "development") {
        console.warn("Login failed:", err);
      }
    }
  };


  const handleSignupRedirect = () => {
    try {
      window.location.href = "/newSignup";
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#7d68ff]/20 to-[#6be0ff]/20 dark:from-gray-900 dark:to-black">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 md:p-10 flex flex-col items-center gap-8 transition">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-[#7d68ff] to-[#6be0ff] bg-clip-text text-transparent">
          Login
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full" noValidate>
          {/* Email */}
          <div className="flex flex-col text-left">
            <label
              htmlFor="email"
              className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white dark:bg-gray-800 py-3 px-4 text-lg rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#7d68ff] outline-none transition"
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col text-left">
            <label
              htmlFor="password"
              className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white dark:bg-gray-800 py-3 px-4 text-lg rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#6be0ff] outline-none transition"
              required
              autoComplete="current-password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="py-3 w-full text-lg font-semibold rounded-lg text-white bg-gradient-to-r from-[#7d68ff] to-[#6be0ff] hover:opacity-90 hover:scale-[1.02] hover:cursor-pointer transition-all duration-300"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Don’t have an account?{" "}
          <span
            className="text-[#7d68ff] cursor-pointer hover:underline"
            onClick={handleSignupRedirect}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
