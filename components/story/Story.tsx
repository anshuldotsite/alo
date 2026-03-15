"use client";

import { motion, MotionValue } from "framer-motion";

interface StoryProps {
  y: MotionValue<number>;
}

export default function Story({ y }: StoryProps) {
  return (
    <>
      <div className="w-full h-8 flex justify-center items-center opacity-40">
        <div className="flex space-x-2">
           {[...Array(5)].map((_, i) => (
             <div key={i} className="w-2 h-2 rotate-45 bg-[var(--accent)]"></div>
           ))}
        </div>
      </div>

      <section id="story" className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden">
        <motion.div 
          style={{ y }}
          className="absolute z-0 select-none opacity-[0.03] text-[28vw] font-serif leading-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[var(--primary)] pointer-events-none"
        >
               لبناني
        </motion.div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
           <h2 className="text-[var(--primary)] font-semibold tracking-[0.2em] uppercase text-xs md:text-sm mb-6">
             The Tradition
           </h2>
          <p className="text-3xl md:text-5xl font-serif text-[var(--foreground)] leading-tight mb-12">
            The secret is in the simplicity. Water, flour, time, and fire. 
          </p>
          <p className="text-lg text-[var(--foreground)]/70 font-light max-w-2xl mx-auto leading-relaxed">
            At Ãlo Oven, a flatbread is never just a flatbread. It&apos;s a canvas for rich olive oil, deeply aromatic thyme, and melting Akkawi cheese. We preserve the timeless art of the Lebanese Manouche, serving harmony and laughter to the Windsor community since 2025.
          </p>
        </div>
      </section>
    </>
  );
}
