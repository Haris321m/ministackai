"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Github, Twitter, Linkedin } from "lucide-react"; // lucide-react icons

const safeLog = (msg: string, err?: unknown) => {
  if (process.env.NODE_ENV === "development") {
    console.warn(msg, err ?? "");
  }
};

export default function Footer() {
  const router = useRouter();

  const safeNavigate = useCallback(
    (path: string) => {
      try {
        router.push(path);
      } catch (err) {
        safeLog(`Navigation error while going to ${path}:`, err);
      }
    },
    [router]
  );

  return (
    <footer className="relative w-full overflow-hidden">
      {/* Liquid background blobs */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#7d68ff] opacity-20 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-[#6be0ff] opacity-20 blur-3xl rounded-full animate-ping"></div>

      <div className="relative z-10 container m-auto flex flex-col md:flex-row justify-between items-center gap-6 py-10 px-6 bg-white/30 dark:bg-gray-900/40 backdrop-blur-2xl border-t border-white/20 dark:border-gray-700/40 rounded-t-3xl shadow-lg">
        
        {/* Navigation Links */}
        <ul className="flex gap-6 md:gap-10 text-base md:text-lg font-medium text-gray-700 dark:text-gray-300">
          <li
            onClick={() => safeNavigate("/Privacypolicy")}
            className="hover:cursor-pointer hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#7d68ff] to-[#6be0ff] transition-all"
          >
            Privacy Policy
          </li>
          <li
            onClick={() => safeNavigate("/Terms")}
            className="hover:cursor-pointer hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#7d68ff] to-[#6be0ff] transition-all"
          >
            Terms & Conditions
          </li>
        </ul>

        {/* Social Media Icons */}
        <div className="flex gap-5 text-gray-600 dark:text-gray-400">
          <a href="https://twitter.com" target="_blank" className="hover:text-[#1DA1F2] transition">
            <Twitter size={22} />
          </a>
          <a href="https://github.com" target="_blank" className="hover:text-black dark:hover:text-white transition">
            <Github size={22} />
          </a>
          <a href="https://linkedin.com" target="_blank" className="hover:text-[#0077B5] transition">
            <Linkedin size={22} />
          </a>
        </div>

        {/* Contact & Copyright */}
        <div className="flex flex-col text-center md:text-right gap-1">
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
            team@minismartai.com
          </p>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} MiniSmart AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
