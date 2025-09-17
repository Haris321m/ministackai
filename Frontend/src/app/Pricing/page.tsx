"use client";

import React, { useEffect, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaImage, FaBolt, FaBrain } from "react-icons/fa";

function PricingComponent() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/checkout");
  }, [router]);

  const handleCheckout = useCallback(() => {
    router.push("/checkout");
  }, [router]);

  const plans = [
    {
      title: "Starter Plan",
      subtitle: "Monthly Plan",
      price: "$6",
      features: [
        { icon: <FaCheckCircle />, label: "6 Best AI models" },
        { icon: <FaCheckCircle />, label: "1,000,000 tokens" },
        { icon: <FaImage />, label: "Generate Images" },
        { icon: <FaBolt />, label: "Enhance Prompt" },
        { icon: <FaCheckCircle />, label: "Side-by-Side Comparison" },
        { icon: <FaBrain />, label: "Models (GPT, DeepSeek, Gemini, LLama, Banana, Dalle)" },
      ],
      button: "Get All 6 Models for $6/Month",
    },
    {
      title: "Best Value",
      subtitle: "Monthly Plan",
      price: "$40",
      features: [
        { icon: <FaCheckCircle />, label: "6 Best AI models" },
        { icon: <FaCheckCircle />, label: "1,000,000 tokens" },
        { icon: <FaImage />, label: "Generate Images" },
        { icon: <FaBolt />, label: "Enhance Prompt" },
        { icon: <FaCheckCircle />, label: "Side-by-Side Comparison" },
        { icon: <FaBrain className="text-5xl" />, label: "Models (GPT, DeepSeek, Gemini, Claude, Perplexity, Grok. LLama, Banana, Dalle)" },
      ],
      button: "Get All 9 Models for $40/Month",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-20 px-4 mt-10">
      <div id="pricing" className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight"
        >
          Seven Brains of AI <br /> One Smart Investment.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl py-2 px-5 bg-blue-100 dark:bg-blue-500/20 inline-block mt-6 rounded-full border-2 border-blue-500 dark:border-blue-400 text-blue-700 dark:text-blue-300 font-semibold"
        >
          Save 50%
        </motion.p>

        <div className="flex flex-col md:flex-row gap-10 justify-center mt-10">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full md:w-96 rounded-3xl p-[2px] bg-gradient-to-r from-[#7d68ff] to-[#6be0ff] shadow-lg hover:shadow-xl transition-all duration-200 mx-auto"
            >
              <div className="rounded-3xl bg-white/80 dark:bg-black/40 backdrop-blur-md px-8 py-10 flex flex-col gap-5 text-gray-800 dark:text-white">
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#7d68ff] to-[#6be0ff] text-white text-sm font-bold px-4 py-1 rounded-full shadow-md">
                  {plan.title}
                </span>
                <h2 className="text-2xl text-center font-medium">{plan.subtitle}</h2>
                <h1 className="text-5xl md:text-6xl text-center font-extrabold">
                  {plan.price}
                  <span className="text-2xl">/mo</span>
                </h1>
                <ul className="flex flex-col gap-2 text-base text-gray-700 dark:text-gray-200 text-start">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      {feature.icon}
                      <span>{feature.label}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleCheckout}
                  className="group  hover:cursor-pointer relative mt-6 w-full py-4 rounded-2xl font-semibold text-lg text-white bg-gradient-to-r from-[#7d68ff] to-[#6be0ff] hover:scale-105 transition-all duration-200 overflow-hidden"
                >
                  {plan.button}
                  <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-[-20deg] group-hover:animate-[shine_1.2s_linear]" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          0% {
            left: -75%;
          }
          100% {
            left: 125%;
          }
        }
      `}</style>
    </div>
  );
}

export default memo(PricingComponent);
