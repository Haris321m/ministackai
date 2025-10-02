"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Mail, ShieldCheck, Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function OtpPage() {
  const [step, setStep] = useState<"enter" | "verify">("enter");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Write valid email");
      return;
    }

    setIsSending(true);
    try {
      const res = await axios.post(`${API_URL}/otp/createforget`, { Email: email });

      if (res.data.success) {
        setStep("verify");
        setResendTimer(60);
      } else {
        setError(res.data.message || "Error in sending OTP");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Server issue, try again");
    } finally {
      setIsSending(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");

    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      setError("Enter 6 digit OTP");
      return;
    }

    setIsVerifying(true);
    try {
      const res = await axios.post(`${API_URL}/OTP/forget`, {
        Email: email,
        Otp: finalOtp,
      });

      if (res.data.success) {
        router.push(`/NewPassword?email=${encodeURIComponent(email)}`); 
      } else {
        setError(res.data.message || "Wrong OTP");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  }

  // Handle OTP input
  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8"
      >
        <div className="flex justify-center mb-6">
          <ShieldCheck className="w-10 h-10 text-indigo-600" />
        </div>

        {step === "enter" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <h1 className="text-xl font-bold text-gray-800 text-center">
              Verify your Email
            </h1>
            <p className="text-sm text-gray-500 text-center">
              Enter your email to receive OTP
            </p>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm text-black"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={isSending}
              className="w-full py-2 rounded-lg bg-indigo-600 text-white flex items-center justify-center gap-2 hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {isSending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSending ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "verify" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <h2 className="text-center text-gray-700">
              OTP sent to <span className="font-medium">{email}</span>
            </h2>
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  className="w-12 h-12 border border-gray-400 text-center text-xl rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                />
              ))}
            </div>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-2 rounded-lg bg-indigo-600 text-white flex items-center justify-center gap-2 hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {isVerifying && <Loader2 className="w-4 h-4 animate-spin" />}
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </button>
            <p className="text-center text-sm text-gray-500">
              {resendTimer > 0 ? (
                <>Resend OTP in {resendTimer}s</>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-indigo-600 hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
}
