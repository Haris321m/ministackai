'use client';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const safeLog = (msg: string, data?: unknown) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(msg, data ?? '');
  }
};

export default function Features() {
  const features = useMemo(
    () => [
      {
        title: 'Compare All Premium AIs at Once',
        desc: 'Stop switching between apps to test different AIs. MiniSmart.Ai brings GPT, Gemini, DeepSeek, LLaMA, and more into a single platform. Instantly compare their answers side-by-side and discover which model gives you the smartest, fastest, and most accurate results for your task.',
        video: '/video1.mp4',
      },
      {
        title: 'Generate Stunning Images with AI',
        desc: 'Bring your imagination to life with our integrated image generation feature. From professional graphics to creative artwork, MiniSmart.Ai lets you create high-quality visuals in seconds—powered by cutting-edge AI image models—all inside the same platform.',
        video: '/video3.mp4',
      },
      {
        title: 'Enhance Your Prompts for Better Results',
        desc: 'Writing the right prompt is key to getting powerful AI responses. With MiniSmart.Ai, you don’t have to be a prompt expert—our smart enhancer refines your input automatically, ensuring you always get clear, detailed, and highly accurate outputs across every model.',
        video: '/video2.mp4',
      },
    ],
    []
  );

  return (
    <section
      id="features"
      className="relative py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto px-6 md:px-10 text-center relative z-10">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl lg:text-8xl font-extrabold leading-tight dark:bg-gradient-to-r dark:from-btnBg dark:to-btnbg2 dark:bg-clip-text dark:text-transparent"
        >
          Seven AI Models
          <br /> One Smart Platform
        </motion.h1>

        {/* Features */}
        <motion.div
          className="flex flex-col gap-14 mt-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.3 } },
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className={`flex flex-col lg:flex-row items-center gap-10 
                bg-gradient-to-r from-btnBg to-btnbg2 p-6 lg:p-12 rounded-3xl 
                shadow-xl hover:shadow-2xl hover:shadow-btnBg/30 
                transform transition-all duration-500 hover:scale-[1.03]
                text-white ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Text Section */}
              <motion.div
                className="lg:w-1/2 text-left"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold drop-shadow-md">
                  {feature.title}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-white/90">
                  {feature.desc}
                </p>
              </motion.div>

              {/* Video Section */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 0.5 }}
                transition={{ duration: 0.3 }}
                className="lg:w-1/2 w-full overflow-hidden rounded-3xl shadow-xl hover:shadow-btnbg2/50"
              >
                <video
                  src={feature.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover rounded-3xl"
                  onError={(e) =>
                    safeLog('Video load error:', (e.target as HTMLVideoElement).src)
                  }
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Subtle Glow Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-btnBg/5 to-transparent dark:from-btnbg2/10 pointer-events-none"></div>
    </section>
  );
}
