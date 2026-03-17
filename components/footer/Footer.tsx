import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";
import Link from "next/link";
import { siFacebook, siInstagram } from "simple-icons";
import type { InfoContent } from "@/lib/content";

const SimpleIcon = ({ icon, className = "w-5 h-5" }: { icon: { path: string }; className?: string }) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={`fill-current ${className}`}>
    <path d={icon.path} />
  </svg>
);

interface FooterProps {
  info: InfoContent;
  logoUrl: string;
}

export default function Footer({ info, logoUrl }: FooterProps) {
  // Support multi-line address stored with \n
  const addressLines = info.address.split("\n");

  return (
    <footer id="visit" className="relative overflow-hidden">

      {/* Top decorative marquee band */}
      <div className="w-full bg-[var(--accent)] py-4 overflow-hidden">
        <Marquee pauseOnHover repeat={6} className="[--duration:30s] [--gap:2rem] p-0 py-1">
          {["Manoushe", "·", "Za'atar", "·", "Keshek", "·", "Halloumi", "·", "Kaaki", "·", "Mashrouha", "·"].map((word, i) => (
            <span
              key={i}
              className={`text-white/90 text-xs font-semibold tracking-[0.3em] uppercase whitespace-nowrap ${word === "·" ? "opacity-30" : ""}`}
            >
              {word}
            </span>
          ))}
        </Marquee>
      </div>

      {/* Main footer body */}
      <div className="bg-[#FDF9F3] text-[#2C2621] px-6 md:px-12 pt-20 pb-12 border-t border-[#2C2621]/5">
        
        {/* Arabic watermark */}
        <div className="absolute pointer-events-none select-none opacity-[0.04] text-[14vw] font-serif leading-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2C2621] whitespace-nowrap">
         لبناني
       </div>

        <div className="max-w-7xl mx-auto relative z-10">

          {/* Top row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">

            {/* Brand */}
            <div className="flex flex-col space-y-6">
              <div className="w-44">
                <Image src={logoUrl} alt="Alo Oven" width={200} height={60} className="w-full h-auto object-contain" />
              </div>
              <p className="text-[#2C2621]/55 font-light text-sm leading-relaxed max-w-xs">
                Authentic flavors, homemade ingredients, and traditional recipes served warm everyday
              </p>
              {/* Socials */}
              <div className="flex gap-3 pt-2">
                <a
                  href={info.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 px-4 py-2.5 border border-[#2C2621]/15 rounded-sm hover:border-[var(--accent)] hover:bg-[var(--accent)] transition-all duration-200 text-[#2C2621]/60 hover:text-white text-xs tracking-wider uppercase font-semibold"
                >        
                  <SimpleIcon icon={siFacebook} />
                  <span>Facebook</span>
                </a>
                <a
                  href={info.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 px-4 py-2.5 border border-[#2C2621]/15 rounded-sm hover:border-[var(--accent)] hover:bg-[var(--accent)] transition-all duration-200 text-[#2C2621]/60 hover:text-white text-xs tracking-wider uppercase font-semibold"
                >
                  <SimpleIcon icon={siInstagram} />
                  <span>Instagram</span>
                </a>
              </div>
            </div>

            {/* Contact & Location */}
            <div className="flex flex-col space-y-8">
              <div>
                <p className="text-[8px] uppercase tracking-[0.3em] text-[var(--accent)] font-semibold mb-3">Find Us</p>
                <address className="not-italic text-[#2C2621]/70 font-light leading-relaxed">
                  {addressLines.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < addressLines.length - 1 && <br />}
                    </span>
                  ))}
                </address>
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-[0.3em] text-[var(--accent)] font-semibold mb-3">Contact</p>
                <div className="flex flex-col space-y-1 text-[#2C2621]/70 font-light">
                  <a href={`tel:${info.phone.replace(/[^0-9]/g, "")}`} className="hover:text-[var(--accent)] transition-colors">{info.phone}</a>
                  <a href={`mailto:${info.email}`} className="hover:text-[var(--accent)] transition-colors">{info.email}</a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div>
              <p className="text-[8px] uppercase tracking-[0.3em] text-[var(--accent)] font-semibold mb-5">Hours</p>
              <ul className="space-y-3 text-[#2C2621]/70 font-light text-sm">
                {info.hours.map((entry, i) => (
                  <li key={i} className="flex justify-between gap-8">
                    <span>{entry.days}</span>
                    <span className="text-[#2C2621]/40">{entry.time}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 h-px w-full bg-gradient-to-r from-[var(--accent)] via-[#2C2621]/10 to-transparent" />
              <p className="mt-6 text-xs text-[#2C2621]/35 font-light">
                Dine-in &amp; Takeout available.<br/>
                Online ordering at checkout above.
              </p>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-[#2C2621]/10 pt-8">
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#2C2621]/35">
              © {new Date().getFullYear()} Ãlo Oven · All Rights Reserved.
            </p>
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#2C2621]/35">
              Website: <Link href="https://www.instagram.com/crafted__by__ak/">
              Crafted by AK</Link>
            </p>
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#2C2621]/35">
             Media by <Link href="https://www.instagram.com/niyazov.productions/">
              Niyazov Productions</Link>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
