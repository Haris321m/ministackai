"use client";

import axios from "axios";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const api_url = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function NewSignUp() {
  const router = useRouter();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const safeLog = (msg: string, err?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      console.warn(msg, err ?? "");
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!firstname || !email || !password) {
        alert("Please fill all required fields.");
        return;
      }

      const SignInfo = {
        FirstName: firstname,
        LastName: lastname,
        Email: email,
        password,
      };

      try {
        setLoading(true);
        await axios.post(`${api_url}/users/`, SignInfo, {
          headers: { "Content-Type": "application/json" },
        });
        router.push("/Login");
      } catch (err) {
        safeLog("Signup error:", err);
        alert("Error: Sign Up failed. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [firstname, lastname, email, password, router]
  );

  return (
    <div className="py-24 min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#7d68ff]/10 to-[#6be0ff]/10 dark:from-gray-900 dark:to-black">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 text-center flex flex-col items-center p-6 md:p-10 gap-8 rounded-2xl shadow-2xl transition">
        
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#7d68ff] to-[#6be0ff] bg-clip-text text-transparent">
          Sign Up
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 items-center w-full text-left"
        >
          {/* First Name */}
          <div className="flex flex-col w-full">
            <label className="text-lg font-medium text-gray-700 dark:text-gray-300">
              First name
            </label>
            <input
              type="text"
              placeholder="John"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="bg-white dark:bg-gray-800 py-3 px-4 text-lg rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#7d68ff] outline-none transition"
              required
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col w-full">
            <label className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Last name
            </label>
            <input
              type="text"
              placeholder="Doe"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="bg-white dark:bg-gray-800 py-3 px-4 text-lg rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#6be0ff] outline-none transition"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col w-full">
            <label className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white dark:bg-gray-800 py-3 px-4 text-lg rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#7d68ff] outline-none transition"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col w-full">
            <label className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              className="bg-white dark:bg-gray-800 py-3 px-4 text-lg rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#6be0ff] outline-none transition"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col w-full">
            <label className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Confirm password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              minLength={6}
              className="bg-white dark:bg-gray-800 py-3 px-4 text-lg rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#7d68ff] outline-none transition"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="py-3 w-full text-lg font-semibold rounded-lg text-white bg-gradient-to-r from-[#7d68ff] to-[#6be0ff] hover:opacity-90 hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <div className="flex flex-col gap-4 w-full text-gray-600 dark:text-gray-400">
          <p>
            Already have an account?{" "}
            <span
              className="text-[#7d68ff] font-bold hover:cursor-pointer hover:underline"
              onClick={() => {
                try {
                  router.push("/Login");
                } catch (err) {
                  safeLog("Navigation error:", err);
                }
              }}
            >
              Login
            </span>
          </p>

          <div className="border-t pt-4">
            <p className="text-sm mb-3">Or sign up with</p>
            <button
              type="button"
              className="py-3 w-full border border-gray-300 dark:border-gray-600 text-lg rounded-lg flex justify-center items-center gap-3 hover:bg-[#7d68ff]/10 transition"
            >
              <img src="/google-icon.svg" alt="Google" className="w-6 h-6" />
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
