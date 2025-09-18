"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/ContextAPI";
import { FaArrowRightLong } from "react-icons/fa6";

const safeLog = (msg: string, data?: unknown) => {
  if (process.env.NODE_ENV === "development") {
    console.warn(msg, data ?? "");
  }
};

const ArrowIcon = FaArrowRightLong;

export default function Callto() {
  const router = useRouter();
  const { user } = useAuth();
  const handleStartNow = useCallback(() => {
    try {
      if (!user) {
        router.push("/Login");
      } else {
        router.push("/Model");
      }
    } catch (err) {
      safeLog("Navigation error in Callto button:", err);
    }
  }, [user, router]);

  return (
    <div className="py-20 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#7d68ff] opacity-30 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#6be0ff] opacity-30 blur-3xl rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        {/* Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-extrabold leading-tight dark:text-transparent bg-clip-text text-black bg-gradient-to-r dark:from-[#7d68ff] dark:to-[#6be0ff]">
          Get Smarter, More <br /> Accurate AI — Every Time.
        </h1>

        {/* Description */}
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto">
          Unlock tailored insights across industries with our exclusive AI toolkit.
        </p>

        {/* CTA Button */}
        <button
          onClick={handleStartNow}
          className="hover:cursor-pointer relative mt-8 py-4 px-10 rounded-full text-lg sm:text-2xl font-semibold text-white flex items-center gap-4 m-auto 
                     bg-gradient-to-r from-[#7d68ff] to-[#6be0ff] shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden"
        >
          <span>Get Started Now</span>
          <ArrowIcon className="text-2xl sm:text-3xl" />

          {/* Shine Effect */}
          <span className="absolute top-0 left-[-75%] w-[50%] h-full 
                           bg-gradient-to-r from-transparent via-white/40 to-transparent 
                           transform skew-x-[-20deg] animate-shine"></span>
        </button>

        {/* Brand Title */}
        <h1 className="text-5xl sm:text-7xl lg:text-9xl font-extrabold mt-24 dark:text-transparent bg-clip-text text-black bg-gradient-to-r dark:from-[#6be0ff] dark:to-[#7d68ff]">
          MiniSmart AI
        </h1>
      </div>
    </div>
  );
}
