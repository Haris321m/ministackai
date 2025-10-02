"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/ContextAPI";

export default function Hero() {
  const router = useRouter();
  const { user } = useAuth();

  const handleStartNow = () => {
    if (!user) {
      router.push("/Login");
    } else {
      router.push("/Model");
    }
  };

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-white via-[#f9f9ff] to-[#eefaff] dark:from-gray-950 dark:via-gray-900 dark:to-black text-gray-900 dark:text-white transition-colors">
      {/* Subtle Glow Blobs */}
      <div className="absolute -top-40 -left-40 w-[28rem] h-[28rem] bg-[#7c68ff]/25 blur-3xl rounded-full animate-pulse" />
      <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-[#00e1ff]/25 blur-3xl rounded-full animate-ping" />
      <div className="absolute bottom-0 left-1/2 w-[22rem] h-[22rem] bg-[#00ffd5]/20 blur-3xl rounded-full animate-pulse" />

      <div className="container mx-auto px-6 py-28 flex flex-col md:flex-row items-center gap-16 relative z-10">
        {/* Left Content */}
        <div className="flex-1 space-y-8 text-center md:text-left">
          {/* Tag */}
          <span className="px-6 py-2 rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-md text-sm font-semibold shadow-md border border-white/20 dark:border-gray-700/40 inline-block">
            🚀 Next-Gen AI Platform
          </span>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
            Stop Switching. <br />
            <span className="bg-gradient-to-r from-[#7c68ff] to-[#00e1ff] bg-clip-text text-transparent">
              Start Creating.
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-lg mx-auto md:mx-0 leading-relaxed">
            Forget juggling apps —{" "}
            <span className="font-semibold">MiniSmart.AI</span> unifies
            multiple powerful AI models into one seamless, stunning experience.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center md:justify-start">
            <button
              onClick={handleStartNow}
              className="group relative px-10 py-4 rounded-full font-semibold text-lg sm:text-xl text-white 
                bg-gradient-to-r from-[#7c68ff] to-[#00e1ff] 
                shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Start Now</span>
              {/* Shine Effect */}
              <span className="absolute top-0 left-[-80%] w-[60%] h-full 
                bg-gradient-to-r from-transparent via-white/40 to-transparent 
                transform skew-x-[-20deg] group-hover:animate-[shine_1.2s_linear]" />
            </button>
          </div>
        </div>

        {/* Right Side Glass Card */}
        <div className="flex-1 relative">
          <div className="w-full max-w-md mx-auto rounded-3xl bg-white/60 dark:bg-gray-800/40 backdrop-blur-2xl p-10 shadow-2xl border border-white/20 dark:border-gray-700/40">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              ✨ MiniSmart Pro
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              Access <span className="font-semibold">GPT, DeepSeek, Gemini, Claude</span>, 
              and more in one beautiful workspace.
            </p>
            <ul className="space-y-3 text-gray-800 dark:text-gray-400 font-medium">
              <li>⚡ 1,000,000 tokens</li>
              <li>🎨 Generate Images</li>
              <li>🪄 Enhance Prompts</li>
              <li>🤖 Multi-Model Access</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
