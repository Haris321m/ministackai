"use client";

import axios from "axios";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Eye, EyeOff } from "lucide-react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/ContextAPI";


const api_url = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function NewSignUp() {
  const router = useRouter();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signup, loginWithGoogle } = useAuth();

  const safeLog = (msg: string, err?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      console.warn(msg, err ?? "");
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!firstname || !email || !password) {
        alert("Please fill all required fields.");
        return;
      }
      if (!validateEmail(email)) {
        setError("Invalid email format");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      setLoading(true);
      const SignInfo = {
        FirstName: firstname,
        LastName: lastname,
        Email: email,
        password,
      };

      try {
        await signup(SignInfo); 
      } catch (err: any) {
        setError("Something went wrong. Try again.");
      } finally {
        setLoading(false);
      }
    },
    [firstname, lastname, email, password, confirmPassword, signup]
  );


  const handlegoogle = async (credentialResponse: CredentialResponse) => {
    try {
      console.log(credentialResponse)
      if (!credentialResponse.credential) {
        console.error("No credential received from Google");
        return;
      }

      const res = await axios.post(`${api_url}/users/google`, {
        idToken: credentialResponse.credential,
      });
      console.log(res.status)
      if (res.status === 200) {
        await loginWithGoogle(credentialResponse.credential);
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (error) {

    }
  }


  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-24 bg-gradient-to-br from-[#7d68ff]/10 via-[#6be0ff]/10 to-[#00e1ff]/10 dark:from-gray-900 dark:via-[#0a0a0a] dark:to-black overflow-hidden">
      
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#7d68ff]/25 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#6be0ff]/25 blur-3xl rounded-full animate-ping"></div>
      <div className="absolute top-1/2 left-1/3 w-[28rem] h-[28rem] bg-[#00ffd5]/20 blur-3xl rounded-full animate-bounce"></div>

      
      <div className="relative w-full max-w-lg bg-white/70 dark:bg-gray-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 md:p-10 flex flex-col items-center gap-8 border border-gray-200/40 dark:border-gray-700/40 z-10">
        
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#7d68ff] to-[#6be0ff] bg-clip-text text-transparent">
          Create Account
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Join <span className="font-semibold">MiniSmart.AI</span> today
        </p>

      
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 items-center w-full text-left"
        >
          
          <div className="flex flex-col w-full">
            <label className="text-lg font-medium text-gray-700 dark:text-gray-300">
              First name
            </label>
            <input
              type="text"
              placeholder="John"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="bg-white/90 dark:bg-gray-800/80 py-3 px-4 text-lg rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#7d68ff] outline-none transition"
              required
            />
          </div>

         
          <div className="flex flex-col w-full">
            <label className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Last name
            </label>
            <input
              type="text"
              placeholder="Doe"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="bg-white/90 dark:bg-gray-800/80 py-3 px-4 text-lg rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#6be0ff] outline-none transition"
            />
          </div>

          
          <div className="flex flex-col w-full">
            <label className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/90 dark:bg-gray-800/80 py-3 px-4 text-lg rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#7d68ff] outline-none transition"
              required
            />
          </div>

          
          <div className="flex flex-col w-full">
            <label className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/90 dark:bg-gray-800/80 border rounded-lg border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#7d68ff] focus:outline-none"
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

          
          <div className="flex flex-col w-full">
            <label className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Confirm password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} 
                className="w-full px-4 py-3 bg-white/90 dark:bg-gray-800/80 border rounded-lg border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#6be0ff] focus:outline-none"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          
          {error && (
            <p className="text-red-500 text-sm font-medium w-full text-center">
              {error}
            </p>
          )}

          
          <button
            type="submit"
            disabled={loading}
            className="py-3 w-full text-lg font-semibold rounded-lg text-white bg-gradient-to-r from-[#7d68ff] to-[#6be0ff] shadow-lg hover:opacity-90 hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

      
        <div className="flex flex-col gap-4 w-full text-gray-600 dark:text-gray-400">
          <p>
            Already have an account?{" "}
            <span
              className="text-[#7d68ff] hover:underline font-medium cursor-pointer"
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
        </div>

        
        <div className="mt-6 w-full">
          <p className="text-center text-gray-500 dark:text-gray-400 mb-4">
            Or sign up with
          </p>
          <div className="mt-6 w-full">
            <div className="w-full" >
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
    </div>
  );
}
