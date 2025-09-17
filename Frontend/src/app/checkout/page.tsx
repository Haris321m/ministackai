"use client";

import React, { useState, useMemo, useCallback } from "react";
import Easypaisa from "./sections/Easypasa";
import Jazzcash from "./sections/Jazzcash";
import Nayapay from "./sections/Nayapay";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const PAYMENT_METHODS = ["Easypaisa", "jazzcash", "Nayapay"] as const;

export default function Pricing() {
  const [activeMethod, setActiveMethod] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const renderForm = useMemo(() => {
    switch (activeMethod) {
      case "Easypaisa":
        return <Easypaisa />;
      case "jazzcash":
        return <Jazzcash />;
      case "Nayapay":
        return <Nayapay />;
      default:
        return (
          <div className="bg-gray-100 dark:bg-gray-800 p-10 rounded-2xl text-center shadow-lg">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-700 dark:text-gray-300">
              Please select a payment method.
            </h1>
          </div>
        );
    }
  }, [activeMethod]);

  const handleSelect = useCallback((method: string) => {
    setActiveMethod(method);
    setDropdownOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300 py-20 px-4 mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Page Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white text-center mb-12"
        >
          Choose Your Payment Method
        </motion.h1>

        {/* Mobile Dropdown Selector */}
        <div className="lg:hidden mb-8">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-full flex justify-between items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-lg font-semibold text-gray-800 dark:text-gray-200 shadow-md"
          >
            {activeMethod || "Select Payment Method"}
            {dropdownOpen ? <ChevronUp /> : <ChevronDown />}
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 divide-y dark:divide-gray-700"
              >
                {PAYMENT_METHODS.map((method) => (
                  <div
                    key={method}
                    onClick={() => handleSelect(method)}
                    className={`p-4 text-left cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 ${
                      activeMethod === method
                        ? "bg-blue-100 dark:bg-gray-700 font-bold"
                        : ""
                    }`}
                  >
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex gap-10">
          {/* Left Side - Payment Options */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-1/3 flex flex-col gap-6"
          >
            {PAYMENT_METHODS.map((method) => (
              <motion.div
                key={method}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveMethod(method)}
                className={`p-6 rounded-2xl shadow-lg cursor-pointer border text-center text-2xl font-bold transition-all duration-300
                  ${
                    activeMethod === method
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white border-blue-600 shadow-xl"
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700"
                  }`}
              >
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </motion.div>
            ))}
          </motion.div>

          {/* Right Side - Dynamic Form */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            {renderForm}
          </motion.div>
        </div>

        {/* Mobile View - Render Form Below Dropdown */}
        <div className="lg:hidden mt-6">{renderForm}</div>
      </div>
    </div>
  );
}
