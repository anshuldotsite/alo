import Image from "next/image";
import { Menu as MenuIcon, X } from "lucide-react";

interface NavbarProps {
  cartTotal: number;
  isCheckingOut: boolean;
  handleCheckout: () => void;
  scrollTo: (id: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export default function Navbar({
  cartTotal,
  isCheckingOut,
  handleCheckout,
  scrollTo,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: NavbarProps) {
  return (
    <>
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
        <button 
          onClick={cartTotal > 0 ? handleCheckout : () => scrollTo("menu")}
          disabled={isCheckingOut}
          className="hidden md:block bg-[var(--accent)] text-white px-6 py-2.5 rounded-sm font-semibold tracking-wider uppercase text-xs hover:bg-[#c25e3e] transition-colors shadow-md disabled:opacity-50"
        >
          {isCheckingOut ? "Processing..." : cartTotal > 0 ? `Checkout ($${cartTotal.toFixed(2)})` : "Order Online"}
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
            <button 
              onClick={cartTotal > 0 ? handleCheckout : () => scrollTo("menu")}
              disabled={isCheckingOut}
              className="mt-8 bg-[var(--accent)] text-white px-10 py-4 rounded-sm font-semibold tracking-widest uppercase text-sm shadow-md disabled:opacity-50"
            >
              {isCheckingOut ? "Processing..." : cartTotal > 0 ? `Checkout ($${cartTotal.toFixed(2)})` : "Order Online"}
            </button>
        </div>
      )}
    </>
  );
}
