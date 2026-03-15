"use client";

import Image from "next/image";
import { motion, MotionValue } from "framer-motion";

interface HeroProps {
  yHero: MotionValue<number>;
}

export default function Hero({ yHero }: HeroProps) {
  return (
    <section id="hero" className="relative w-full min-h-screen flex flex-col justify-center px-4 md:px-12 pt-32 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 max-w-7xl mx-auto w-full z-10">
        <div className="md:w-1/2 flex flex-col items-center text-center md:items-start md:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-[var(--accent)] font-semibold tracking-[0.2em] uppercase text-xs md:text-sm mb-6 flex items-center gap-4"
            >
              <span className="w-12 h-px bg-[var(--accent)] hidden md:block"></span>
              Authentic Lebanese Bakery
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl font-serif text-[var(--foreground)] leading-[0.9] tracking-tighter mb-8"
            >
              Baked with <br/> Fire & Soul.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-[var(--foreground)]/80 max-w-md font-light leading-relaxed mb-10"
            >
              Authentic flavors, homemade ingredients, and traditional recipes served warm everyday.
            </motion.p>
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-[var(--primary)] text-white px-8 py-4 font-semibold tracking-wider uppercase text-sm hover:bg-[#384830] transition-colors rounded-tr-2xl rounded-bl-2xl shadow-lg border border-[var(--primary)]"
            >
              Explore The Menu
            </motion.button>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="md:w-1/2 w-full max-w-lg aspect-[4/5] relative"
        >
          {/* Architectural Arch shape common in Arabesque design */}
          <div className="w-full h-full rounded-t-[50%] overflow-hidden relative shadow-2xl border-4 border-white flex justify-center items-center bg-[#E8DCCB]">
              <motion.div style={{ y: yHero }} className="absolute inset-0 z-0 h-[120%] -top-[10%]">
                <Image src="/images/hero.png" alt="Stone Oven Baking" fill className="object-cover" priority />
              </motion.div>
          </div>
          
          {/* Floating accent badge */}
          <div className="absolute -bottom-6 -left-6 md:-left-12 bg-white p-4 rounded-full shadow-xl flex items-center justify-center border border-[#E8DCCB]">
              <div className="w-24 h-24 border border-dashed border-[var(--accent)] rounded-full flex flex-col items-center justify-center text-[var(--accent)]">
                <span className="font-serif text-2xl font-bold">2025</span>
                <span className="uppercase text-[8px] tracking-widest font-semibold mt-1">Est.</span>
              </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
