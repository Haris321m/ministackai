"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/ContextAPI";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaRobot, FaBrain, FaMagic } from "react-icons/fa";

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
    <div className="relative py-24 overflow-hidden bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-gray-900 transition-colors duration-500">
      {/* Liquid Glow Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#7d68ff] opacity-30 blur-3xl rounded-full animate-pulse" />
      <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] bg-[#6be0ff] opacity-30 blur-3xl rounded-full animate-ping" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#00ffd5] opacity-25 blur-3xl rounded-full animate-pulse" />

      {/* Content Container */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        {/* Title */}
        <h1
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight 
          bg-clip-text text-transparent 
          bg-gradient-to-r from-[#5a3bff] to-[#009dff] 
          dark:from-[#7d68ff] dark:to-[#6be0ff] drop-shadow-lg"
        >
          Get Smarter, More <br /> Accurate AI — Every Time.
        </h1>

        {/* Description */}
        <p className="text-lg sm:text-xl text-gray-800 dark:text-gray-300 mt-6 max-w-2xl mx-auto leading-relaxed">
          Unlock tailored insights across industries with our exclusive AI toolkit, 
          powered by the best large language models and image generators.
        </p>

        {/* CTA Button */}
        <button
          onClick={handleStartNow}
          className="group relative mt-10 py-4 px-10 rounded-full text-lg sm:text-2xl font-semibold 
            flex items-center gap-4 m-auto 
            text-white bg-gradient-to-r from-[#7d68ff] to-[#6be0ff] 
            shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10">Get Started Now</span>
          <ArrowIcon className="text-2xl sm:text-3xl relative z-10" />

          {/* Shine Effect */}
          <span className="absolute top-0 left-[-75%] w-[50%] h-full 
            bg-gradient-to-r from-transparent via-white/40 to-transparent 
            transform skew-x-[-20deg] group-hover:animate-[shine_1.2s_linear]" />
        </button>

        {/* Features / Icons */}
        <div className="flex flex-wrap justify-center gap-8 mt-16 text-gray-800 dark:text-gray-300">
          <div className="flex flex-col items-center">
            <FaRobot className="text-4xl text-[#5a3bff] dark:text-[#6be0ff]" />
            <p className="mt-2 font-medium">AI Models</p>
          </div>
          <div className="flex flex-col items-center">
            <FaBrain className="text-4xl text-[#009dff] dark:text-[#7d68ff]" />
            <p className="mt-2 font-medium">Smart Insights</p>
          </div>
          <div className="flex flex-col items-center">
            <FaMagic className="text-4xl text-[#00c7a5] dark:text-[#6be0ff]" />
            <p className="mt-2 font-medium">Creative Tools</p>
          </div>
        </div>

        {/* Brand Title */}
        <h1
          className="text-5xl sm:text-7xl lg:text-9xl font-extrabold mt-24 
          bg-clip-text dark:text-transparent 
          dark:bg-gradient-to-r 
          dark:from-[#6be0ff] dark:to-[#7d68ff] drop-shadow-md"
        >
          MiniSmart AI
        </h1>
      </div>
    </div>
  );
}
