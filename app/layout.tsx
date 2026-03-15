import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-cormorant",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alo Oven | Authentic Lebanese Bakery",
  description: "Authentic Lebanese Flatbread, Zaatar, and more in Windsor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("scroll-smooth", "font-sans", geist.variable)}>
      <body className={`${outfit.variable} ${cormorant.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
