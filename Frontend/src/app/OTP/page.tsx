"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";


export default function OtpPage() {
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const searchParams = useSearchParams();
    const emailFromQuery = searchParams.get("email") || "";
    const [email, setEmail] = useState(emailFromQuery);
    const router = useRouter();


    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const handleChange = (value: string, index: number) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // next input pe move
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const finalOtp = otp.join("");
        if (finalOtp.length !== 6) {
            setError("6 digit OTP enter karo");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/OTP/checkotp`, {
                Email: email,
                Otp: finalOtp,
            });
            if (res.data.success) {
                setSuccess("OTP Verified Successfully");
                setTimeout(() => {
                    router.push("/"); 
                }, 1500);
            } else {
                setError(res.data.message || "Wrong OTP");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form
                onSubmit={handleVerify}
                className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-sm space-y-4"
            >
                <h1 className="text-xl font-bold text-center text-gray-800">
                    Enter OTP
                </h1>
                <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => {
                                (inputsRef.current as HTMLInputElement[])[index] = el!;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(e.target.value, index)}
                            className="w-12 h-12 border border-gray-400 text-center text-xl rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    ))}
                </div>

                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                {success && (
                    <p className="text-sm text-green-600 text-center">{success}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-60"
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>
            </form>
        </div>
    );
}
