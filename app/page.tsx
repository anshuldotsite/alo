"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { scrollYProgress, scrollY } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yHero = useTransform(scrollY, [0, 500], [0, 150]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)] selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* Warm Bakery Navigation */}
      <nav className="fixed w-full flex justify-between items-center px-6 md:px-12 py-5 z-50 bg-[#FDF9F3]/95 backdrop-blur-md border-b border-[#2C2621]/10 text-[#2C2621] shadow-sm">
        <div className="w-40 md:w-56 cursor-pointer" onClick={() => scrollTo("hero")}>
          <Image 
            src="/images/logo.png" 
            alt="Alo Oven" 
            width={200} 
            height={60} 
            className="w-full h-auto object-contain mix-blend-multiply" 
            priority 
          />
        </div>
        <div className="hidden md:flex gap-10 text-sm font-semibold tracking-wider uppercase">
          <button onClick={() => scrollTo("story")} className="hover:text-[var(--accent)] transition-colors">Our Story</button>
          <button onClick={() => scrollTo("menu")} className="hover:text-[var(--accent)] transition-colors">Menu</button>
          <button onClick={() => scrollTo("visit")} className="hover:text-[var(--accent)] transition-colors">Visit</button>
        </div>
        <button className="hidden md:block bg-[var(--accent)] text-white px-6 py-2.5 rounded-sm font-semibold tracking-wider uppercase text-xs hover:bg-[#c25e3e] transition-colors shadow-md">
          Order Online
        </button>
        <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#FDF9F3] flex flex-col justify-center items-center gap-8 md:hidden">
            <button onClick={() => scrollTo("story")} className="text-3xl font-serif text-[var(--foreground)]">Our Story</button>
            <button onClick={() => scrollTo("menu")} className="text-3xl font-serif text-[var(--foreground)]">Menu</button>
            <button onClick={() => scrollTo("visit")} className="text-3xl font-serif text-[var(--foreground)]">Visit</button>
            <button className="mt-8 bg-[var(--accent)] text-white px-10 py-4 rounded-sm font-semibold tracking-widest uppercase text-sm shadow-md">
              Order Online
            </button>
        </div>
      )}

      {/* Hero Section with Arch Motif */}
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
               Hand-tossed dough, fresh Za&apos;atar, and roaring stone ovens. The true taste of the Levant, crafted daily in Windsor.
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
                  <span className="font-serif text-2xl font-bold">1998</span>
                  <span className="uppercase text-[8px] tracking-widest font-semibold mt-1">Est.</span>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="w-full h-8 flex justify-center items-center opacity-40">
        <div className="flex space-x-2">
           {[...Array(5)].map((_, i) => (
             <div key={i} className="w-2 h-2 rotate-45 bg-[var(--accent)]"></div>
           ))}
        </div>
      </div>

      {/* The Story / The Dough */}
      <section id="story" className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden">
        {/* Massive Arabic Calligraphy Watermark behind the text */}
        <motion.div 
          style={{ y }}
          className="absolute z-0 select-none opacity-[0.03] text-[40vw] font-serif leading-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[var(--primary)] pointer-events-none"
        >
          أصيل
        </motion.div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
           <h2 className="text-[var(--primary)] font-semibold tracking-[0.2em] uppercase text-xs md:text-sm mb-6">
             The Tradition
           </h2>
          <p className="text-3xl md:text-5xl font-serif text-[var(--foreground)] leading-tight mb-12">
            The secret is in the simplicity. Water, flour, time, and fire. 
          </p>
          <p className="text-lg text-[var(--foreground)]/70 font-light max-w-2xl mx-auto leading-relaxed">
            At Ãlo Oven, a flatbread is never just a flatbread. It&apos;s a canvas for rich olive oil, deeply aromatic thyme, and melting Akkawi cheese. We preserve the timeless art of the Lebanese Manouche, serving harmony and laughter to the Windsor community since 1998.
          </p>
        </div>
      </section>

      {/* Our Menu */}
      <section id="menu" className="py-24 px-6 md:px-12 bg-[#2C2621] text-[#FDF9F3] relative">
        <div className="absolute top-0 inset-x-0 h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMjBMMTAgMTBsMTAgMTBIMHoiIGZpbGw9IiNGREY5RjMiLz48L3N2Zz4=')] bg-repeat-x rotate-180"></div>
        
        <div className="max-w-7xl mx-auto mt-12">
          <div className="flex flex-col items-center mb-20 text-center">
             <h2 className="text-[var(--accent)] font-semibold tracking-[0.2em] uppercase text-xs md:text-sm mb-4">
               From The Oven
             </h2>
             <h3 className="text-5xl md:text-7xl font-serif text-[#FDF9F3] tracking-tighter">Menu Classics</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {menuItems.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="group border-t border-[#FDF9F3]/20 pt-6"
              >
                <div className="flex justify-between items-baseline mb-4">
                  <h4 className="text-2xl md:text-3xl font-serif tracking-tight text-[#E8DCCB] group-hover:text-[var(--accent)] transition-colors">
                    {item.name}
                  </h4>
                  <div className="font-semibold tracking-wider text-[var(--accent)] ml-4 shrink-0">
                    {item.price}
                  </div>
                </div>
                <p className="text-[#FDF9F3]/60 font-light leading-relaxed text-sm md:text-base pr-8">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-24 text-center">
            <button className="border border-[#FDF9F3]/30 text-[#FDF9F3] px-10 py-4 font-semibold tracking-wider uppercase text-sm hover:bg-[#FDF9F3] hover:text-[#2C2621] transition-all duration-300">
              Download Full Menu (PDF)
            </button>
          </div>
        </div>
      </section>

      {/* Footer / Visit */}
      <footer id="visit" className="bg-[var(--primary)] text-[#FDF9F3] py-24 md:py-32 px-6 md:px-12 border-t-8 border-[var(--accent)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23FDF9F3\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-16 relative z-10">
          
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="w-48 mb-8 invert filter brightness-0">
                <Image src="/images/logo.png" alt="Alo Oven Logo" width={200} height={60} className="w-full h-auto object-contain" />
              </div>
              <p className="text-[#FDF9F3]/80 font-light leading-relaxed max-w-sm mb-12">
                Elevating the Lebanese bakery experience. Fresh flatbread, savory pies, and warm moments in Windsor, ON.
              </p>
            </div>
            <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#FDF9F3]/50">
              © {new Date().getFullYear()} Ãlo Oven. All Rights Reserved.
            </div>
          </div>
          
          <div className="md:col-span-3 md:col-start-7">
            <h4 className="font-serif text-2xl mb-8 text-[#E8DCCB]">Find Us</h4>
            <div className="space-y-6 text-[#FDF9F3]/80 font-light">
              <p>
                <strong className="block text-[10px] uppercase tracking-widest text-[var(--accent)] font-semibold mb-1">Location</strong>
                2615 Howard Ave.<br/>Windsor, Ontario
              </p>
              <p>
                <strong className="block text-[10px] uppercase tracking-widest text-[var(--accent)] font-semibold mb-1">Contact</strong>
                <a href="tel:5198000294" className="hover:text-white transition-colors block">519.800.0294</a>
                <a href="mailto:info@alooven.co" className="hover:text-white transition-colors block">info@alooven.co</a>
              </p>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-serif text-2xl mb-8 text-[#E8DCCB]">Hours</h4>
            <div className="space-y-4 text-[#FDF9F3]/80 font-light text-sm">
              <div className="flex justify-between border-b border-[#FDF9F3]/10 pb-2">
                <span>Mon - Fri</span> <span>8:00am — 9:00pm</span>
              </div>
              <div className="flex justify-between border-b border-[#FDF9F3]/10 pb-2">
                <span>Saturday</span> <span>8:00am — 10:00pm</span>
              </div>
              <div className="flex justify-between pb-2">
                <span>Sunday</span> <span>9:00am — 8:00pm</span>
              </div>
            </div>
            
            <button className="mt-8 w-full bg-[#FDF9F3] text-[var(--primary)] py-3 font-semibold tracking-wider uppercase text-xs hover:bg-[var(--accent)] hover:text-white transition-colors">
              Order Delivery
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

const menuItems = [
  {
    name: "Za'atar Manouche",
    price: "$4.99",
    desc: "The classic. Dried wild thyme, roasted sesame seeds, sumac, and rich virgin olive oil.",
  },
  {
    name: "Akkawi Cheese",
    price: "$7.99",
    desc: "A melting pool of soft, creamy Levantine cheese with a mild, satisfyingly salty finish.",
  },
  {
    name: "Lebanese Keshek",
    price: "$5.99",
    desc: "Preserved dried yogurt, crushed wheat, ripe tomatoes, and finely diced onions.",
  },
  {
    name: "Traditional Meat Pie",
    price: "$7.99",
    desc: "Minced spiced beef blended with fresh tomatoes and onions, baked until crisp and aromatic.",
  },
  {
    name: "Halloumi Flatbread",
    price: "$7.99",
    desc: "The delightful combination of salty and savory artisan halloumi, baked to a golden crust.",
  },
  {
    name: "Mouhammara",
    price: "$5.99",
    desc: "Diced tomatoes, onions, and our signature traditional sweet and spicy pepper blend.",
  }
];
