"use client";

import { useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Hero from "@/components/hero/Hero";
import Story from "@/components/story/Story";
import Menu, { MenuItem } from "@/components/menu/Menu";
import Footer from "@/components/footer/Footer";

export default function Home() {
  const { scrollYProgress, scrollY } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yHero = useTransform(scrollY, [0, 500], [0, 150]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, { item: MenuItem; quantity: number }>>({});
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev[item.id];
      if (existing) {
        return { ...prev, [item.id]: { ...existing, quantity: existing.quantity + 1 } };
      }
      return { ...prev, [item.id]: { item, quantity: 1 } };
    });
  };

  const cartTotal = Object.values(cart).reduce((sum, { item, quantity }) => sum + item.price * quantity, 0);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    const body = {
      cart: Object.fromEntries(
        Object.entries(cart).map(([id, data]) => [id, data.quantity])
      ),
      form: {
        name: "Online Customer",
        phone: "000-000-0000",
        email: "online@alooven.co",
        notes: "Online Order",
      },
      cartItems: Object.values(cart).map(data => ({
        id: data.item.id,
        name: data.item.name,
        price: data.item.price,
      })),
    };

    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Order created! ID: " + data.orderId);
        setCart({});
      } else {
        alert("Error: " + data.error);
      }
    } catch (e) {
      alert("Failed to create order");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)] selection:text-white font-sans antialiased overflow-x-hidden">
      <Navbar 
        cartTotal={cartTotal}
        isCheckingOut={isCheckingOut}
        handleCheckout={handleCheckout}
        scrollTo={scrollTo}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <Hero yHero={yHero} />
      <Story y={y} />
      <Menu cart={cart} addToCart={addToCart} />
      <Footer />
    </div>
  );
}
