"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/ContextAPI"

export default function Hero() {

  const router = useRouter();
  const { user } = useAuth();

  const handleStartNow = () => {
    if (!user) {
      router.push("/login");
    } else {
      router.push("/Model");
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#7c68ff] via-[#6bdfff] to-[#00e1ff] text-white">
      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#7d68ff] opacity-40 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#6be0ff] opacity-40 blur-3xl rounded-full"></div>

      <div className="container mx-auto px-6 py-32 flex flex-col md:flex-row items-center gap-20 relative z-10">
        {/* Left Content */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <span className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-md text-sm font-semibold shadow-lg">
            Next-Gen AI Platform
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Your AI Universe. <br /> One Platform.
          </h1>

          <p className="text-xl text-[#484848] max-w-lg">
            Stop wasting time juggling tools — MiniSmart AI unites the
            smartest models under one subscription.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center md:justify-start">
            <button onClick={handleStartNow} className="relative px-10 py-4 hover:cursor-pointer rounded-full font-semibold text-xl bg-gradient-to-r from-[#7c68ff45] to-[#6bdfff1e] shadow-lg hover:scale-105 transition-all">
              Start Now
              <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-[-20deg] animate-shine"></span>
            </button>
          </div>
        </div>

        {/* Right Side Mockup / Card */}
        <div className="flex-1 relative">
          <div className="w-full max-w-md mx-auto rounded-3xl bg-white/10 backdrop-blur-xl p-8 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold mb-4">✨ MiniSmart Pro</h2>
            <p className="text-gray-900 mb-6">
              Access GPT, DeepSeek, Gemini, Claude, and more in one place.
            </p>
            <ul className="space-y-2 text-gray-500">
              <li>⚡ 1,000,000 tokens</li>
              <li>🎨 Generate Images</li>
              <li>🪄 Enhance Prompts</li>
              <li>🤖 Multi-Model Access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
