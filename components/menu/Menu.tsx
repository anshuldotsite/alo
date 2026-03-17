"use client";

import { motion } from "framer-motion";
import type { MenuItem } from "@/lib/content";

// Re-export MenuItem type for backward compatibility (used by Navbar/cart)
export type { MenuItem };

interface MenuProps {
  cart: Record<string, { item: MenuItem; quantity: number }>;
  addToCart: (item: MenuItem) => void;
  menuItems: MenuItem[];
}

export default function Menu({ cart, addToCart, menuItems }: MenuProps) {
  return (
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
              key={item.id}
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
                  ${item.price.toFixed(2)}
                </div>
              </div>
              <p className="text-[#FDF9F3]/60 font-light leading-relaxed text-sm md:text-base pr-8 mb-4">
                {item.desc}
              </p>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => addToCart(item)}
                  className="bg-[var(--accent)] text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#c25e3e] transition-colors"
                >
                  Add to Cart
                </button>
                {cart[item.id] && (
                  <span className="text-[var(--accent)] text-sm font-semibold">
                    {cart[item.id].quantity} in cart
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <button className="border border-[#FDF9F3]/30 text-[#FDF9F3] px-10 py-4 font-semibold tracking-wider uppercase text-sm hover:bg-[#FDF9F3] hover:text-[#2C2621] transition-all duration-300">
            View Menu
          </button>
        </div>
      </div>
    </section>
  );
}
