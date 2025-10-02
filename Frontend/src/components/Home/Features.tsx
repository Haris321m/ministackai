'use client';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Image, Wand2 } from 'lucide-react'; // icons for features

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
        icon: <Sparkles size={30} className="text-[#7d68ff]" />,
      },
      {
        title: 'Generate Stunning Images with AI',
        desc: 'Bring your imagination to life with our integrated image generation feature. From professional graphics to creative artwork, MiniSmart.Ai lets you create high-quality visuals in seconds—powered by cutting-edge AI image models—all inside the same platform.',
        video: '/video3.mp4',
        icon: <Image size={30} className="text-[#6be0ff]" />,
      },
      {
        title: 'Enhance Your Prompts for Better Results',
        desc: 'Writing the right prompt is key to getting powerful AI responses. With MiniSmart.Ai, you don’t have to be a prompt expert—our smart enhancer refines your input automatically, ensuring you always get clear, detailed, and highly accurate outputs across every model.',
        video: '/video2.mp4',
        icon: <Wand2 size={30} className="text-[#00ffd5]" />,
      },
    ],
    []
  );

  return (
    <section
      id="features"
      className="relative py-24 overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900"
    >
      {/* Liquid animated blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#7d68ff] opacity-25 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#6be0ff] opacity-25 blur-3xl rounded-full animate-ping"></div>
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-[#00ffd5] opacity-20 blur-3xl rounded-full animate-pulse"></div>

      <div className="container mx-auto px-6 md:px-10 text-center relative z-10">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight dark:bg-gradient-to-r dark:from-[#7d68ff] dark:to-[#6be0ff] dark:bg-clip-text dark:text-transparent drop-shadow-md"
        >
          Seven AI Models
          <br /> One Smart Platform
        </motion.h1>

        {/* Features */}
        <motion.div
          className="flex flex-col gap-16 mt-20"
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
                p-6 lg:p-12 rounded-3xl shadow-xl hover:shadow-2xl 
                transform transition-all duration-500 hover:scale-[1.03]
                bg-white/30 dark:bg-gray-800/40 backdrop-blur-2xl 
                border border-white/20 dark:border-gray-700/40
                ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Text Section */}
              <motion.div
                className="lg:w-1/2 text-left"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-4">
                  {feature.icon}
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {feature.title}
                  </h2>
                </div>
                <p className="mt-2 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  {feature.desc}
                </p>
              </motion.div>

              {/* Video Section */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 0.5 }}
                transition={{ duration: 0.3 }}
                className="lg:w-1/2 w-full overflow-hidden rounded-2xl shadow-lg hover:shadow-[#6be0ff]/40"
              >
                <video
                  src={feature.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) =>
                    safeLog('Video load error:', (e.target as HTMLVideoElement).src)
                  }
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7d68ff]/5 via-transparent to-[#6be0ff]/5 pointer-events-none"></div>
    </section>
  );
}
