"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/ContextAPI";
import { useModal } from "@/components/ModalProvider";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios from "axios";
import { useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const api_url = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showAlert, showConfirm } = useModal();
  const [error, setError] = useState("");
  const router = useRouter();
  const { signup, loginWithGoogle } = useAuth();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Invalid password");
      } else if (err.response?.status === 404) {
        setError("Email not found");
      } else {
        setError(err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignupRedirect = () => {
    try {
      window.location.href = "/newSignup";
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleForget = () => {
    try {
      window.location.href = "/Forgotten";
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handlegoogle = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        console.error("No credential received from Google");
        return;
      }

      const res = await axios.post(`${api_url}/users/google`, {
        idToken: credentialResponse.credential,
      });

      if (res.status === 200) {
        await loginWithGoogle(credentialResponse.credential);
        router.push("/");
      }
    } catch (error) {
      console.error("Google login error:", error);
    }
  };


  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-[#7d68ff]/40 via-[#6be0ff]/40 to-[#00ffd5]/40 dark:from-gray-900 dark:to-black">
      {/* Liquid background circles */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#7d68ff] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#6be0ff] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#00ffd5] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-ping" />

      <div className="relative w-full max-w-md backdrop-blur-2xl bg-white/20 dark:bg-gray-900/40 rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10 flex flex-col items-center gap-8 transition-all">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-[#7d68ff] to-[#6be0ff] bg-clip-text text-transparent drop-shadow-lg">
          Login
        </h1>
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center w-full">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full" noValidate>
          {/* Email */}
          <div className="flex flex-col text-left">
            <label
              htmlFor="email"
              className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/30 dark:bg-gray-800/40 py-3 px-4 text-lg rounded-xl border border-gray-300/20 dark:border-gray-700/40 focus:ring-2 focus:ring-[#7d68ff] outline-none transition backdrop-blur-md"
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col text-left">
            <label
              htmlFor="password"
              className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-white/30 dark:bg-gray-800/40 border border-gray-300/20 dark:border-gray-700/40 rounded-xl focus:ring-2 focus:ring-[#6be0ff] focus:outline-none backdrop-blur-md"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <p
            className="text-end text-blue-600 font-bold hover:cursor-pointer dark:text-white"
            onClick={handleForget}
          >
            forgotten password?
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-gradient-to-r from-[#7d68ff] to-[#6be0ff] text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
          Don’t have an account?{" "}
          <span
            className="text-blue-400 hover:underline font-medium cursor-pointer"
            onClick={handleSignupRedirect}
          >
            Sign Up
          </span>
        </p>

        <div className="mt-6 w-full">
          <p className="text-center text-gray-500 mb-4">Or login with</p>
          <div className="w-full">
            <GoogleLogin
              onSuccess={handlegoogle}
              onError={() => {
                console.log("Login Failed");
              }}
              useOneTap
            />
          </div>
        </div>

      </div>
    </div>
  );
}
