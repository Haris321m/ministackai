"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ResetPasswordPageInner() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!email) {
      setError("Invalid or expired reset link");
    }
  }, [email]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is missing. Please restart password reset process.");
      return;
    }

    if (password !== confirm) {
      setError("Password is not Match");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(`${API_URL}/users/`, {
        Email: email,
        PasswordHash: password,
      });
      if (res.data) {
        setSuccess(true);
      } else {
        setError(res.data.message || "Password reset failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8"
      >
        {!success ? (
          <form onSubmit={handleReset} className="space-y-5">
            <h1 className="text-xl font-bold text-center text-gray-800">
              Set New Password
            </h1>
            <p className="text-sm text-gray-500 text-center">
              Apna naya password enter karo
            </p>

            {/* New Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                className="w-full border rounded-lg pl-9 pr-10 py-2 text-sm text-black"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm Password"
                className="w-full border rounded-lg pl-9 pr-10 py-2 text-sm text-black"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-indigo-600 text-white flex items-center justify-center gap-2 hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        ) : (
          <div className="text-center py-6">
            <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h2 className="text-lg font-semibold">
              Password Reset Successfully!
            </h2>
            <p className="text-gray-600 mt-2">
              Ab aap login kar sakte ho apne naye password se
            </p>
            <a
              href="/Login"
              className="mt-6 inline-block px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Back to Login
            </a>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
      <ResetPasswordPageInner />
    </Suspense>
  );
}
