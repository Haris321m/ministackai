"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";

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
    <footer className="w-full border-t-2 border-btnBg">
      <div className="container m-auto flex flex-col md:flex-row justify-between items-center gap-6 py-10 px-4">
        <ul className="flex gap-6 md:gap-10 text-lg md:text-xl font-medium text-gray-700 dark:text-gray-300">
          <li
            onClick={() => safeNavigate("/Privacypolicy")}
            className="hover:cursor-pointer hover:text-btnBg transition-colors"
          >
            Privacy Policy
          </li>
          <li
            onClick={() => safeNavigate("/Terms")}
            className="hover:cursor-pointer hover:text-btnBg transition-colors"
          >
            Terms & Conditions
          </li>
        </ul>
        <p className="text-sm md:text-lg text-gray-600 dark:text-gray-400 text-center md:text-right">
          team@minismartai.com
        </p>
        <p className="text-sm md:text-lg text-gray-600 dark:text-gray-400 text-center md:text-right">
          &copy; {new Date().getFullYear()} MiniSmart AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
