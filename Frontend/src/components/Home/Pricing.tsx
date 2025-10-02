"use client";

import React, { useCallback, memo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaImage, FaBolt, FaBrain } from "react-icons/fa";

function SafeBoundary({ children }: { children: React.ReactNode }) {
  try {
    return <>{children}</>;
  } catch (err) {
    console.error("Render error in PricingComponent:", err);
    return (
      <div className="p-6 text-center text-red-500">
        Something went wrong. Please refresh the page.
      </div>
    );
  }
}

function PricingComponent() {
  const router = useRouter();

  const handleCheckout = useCallback(() => {
    try {
      router.push("/checkout");
    } catch (err) {
      console.error("Navigation error:", err);
    }
  }, [router]);

  const plans = [
    {
      subtitle: "Monthly Plan",
      price: "$6",
      features: [
        { icon: <FaCheckCircle />, label: "6 Best AI models" },
        { icon: <FaCheckCircle />, label: "1,000,000 tokens" },
        { icon: <FaImage />, label: "Generate Images" },
        { icon: <FaBolt />, label: "Enhance Prompt" },
        { icon: <FaCheckCircle />, label: "Side-by-Side Comparison" },
        {
          icon: <FaBrain />,
          label: "Models (GPT, DeepSeek, Gemini, LLama, Banana, Dalle)",
        },
      ],
      button: "Get All 6 Models for $6/Month",
    },
    {
      subtitle: "Monthly Plan",
      price: "$40",
      features: [
        { icon: <FaCheckCircle />, label: "9 Best AI models" },
        { icon: <FaCheckCircle />, label: "1,000,000 tokens" },
        { icon: <FaImage />, label: "Generate Images" },
        { icon: <FaBolt />, label: "Enhance Prompt" },
        { icon: <FaCheckCircle />, label: "Side-by-Side Comparison" },
        {
          icon: <FaBrain />,
          label:
            "Models (GPT, DeepSeek, Gemini, Claude, Perplexity, Grok, LLama, Banana, Dalle)",
        },
      ],
      button: "Get All 9 Models for $40/Month",
    },
  ];

  return (
    <SafeBoundary>
      <div className="relative min-h-screen py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 overflow-hidden">
        {/* Liquid blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#7d68ff] opacity-20 blur-3xl rounded-full animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#6be0ff] opacity-20 blur-3xl rounded-full animate-ping" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#00ffd5] opacity-20 blur-3xl rounded-full animate-pulse" />

        <div id="pricing" className="relative max-w-6xl mx-auto text-center z-10">
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-[#7d68ff] to-[#6be0ff] bg-clip-text text-transparent leading-tight drop-shadow-md"
          >
            Seven Brains of AI <br /> One Smart Investment.
          </motion.h1>

          {/* Tag */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl py-2 px-5 bg-blue-100 dark:bg-blue-500/20 inline-block mt-6 rounded-full border-2 border-blue-500 dark:border-blue-400 text-blue-700 dark:text-blue-300 font-semibold shadow-md"
          >
            Save 50%
          </motion.p>

          {/* Pricing Cards */}
          <div className="flex flex-col md:flex-row gap-10 justify-center mt-14">
            {plans?.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                whileHover={{ scale: 1.05, rotate: 0.5 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full md:w-96 rounded-3xl p-[2px] shadow-xl transition-all duration-300 
                  bg-gradient-to-r from-[#7d68ff] to-[#6be0ff]"
              >
                <div
                  className="rounded-3xl px-8 py-10 flex flex-col gap-6 relative overflow-hidden backdrop-blur-xl
                  bg-white/90 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100"
                >
                  {/* Subtitle */}
                  <h2 className="text-lg text-center font-semibold text-gray-600 dark:text-gray-300">
                    {plan?.subtitle || ""}
                  </h2>

                  {/* Price */}
                  <h1 className="text-5xl md:text-6xl text-center font-extrabold">
                    {plan?.price || "$--"}
                    <span className="text-2xl font-medium text-gray-500 dark:text-gray-300">
                      /mo
                    </span>
                  </h1>

                  {/* Features */}
                  <ul className="flex flex-col gap-3 text-base text-left">
                    {plan?.features?.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 group transition-colors"
                      >
                        <span className="text-[#7d68ff] dark:text-[#6be0ff] group-hover:scale-110 transition-transform">
                          {feature?.icon || <FaCheckCircle />}
                        </span>
                        <span className="group-hover:text-[#7d68ff] dark:group-hover:text-[#6be0ff] transition-colors">
                          {feature?.label || "Feature"}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
<button
  onClick={handleCheckout}
  className="group relative mt-6 w-full py-4 rounded-2xl font-semibold text-lg text-white bg-gradient-to-r from-[#7d68ff] to-[#6be0ff] hover:scale-105 transition-all duration-200 overflow-hidden shadow-lg"
>
  <div className="absolute inset-0 bg-black/20" /> {/* overlay */}
  <span className="relative z-10">{plan?.button || "Subscribe"}</span>
  <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-[-20deg] group-hover:animate-[shine_1.2s_linear]" />
</button>

                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SafeBoundary>
  );
}

export default memo(PricingComponent);
