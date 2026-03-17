export interface FontOption {
  name: string;
  /** Google Fonts CSS2 query param, null = already loaded via next/font */
  googleQuery: string | null;
  /** Generic fallback stack */
  stack: string;
}

export const SANS_FONTS: FontOption[] = [
  { name: "Outfit",      googleQuery: null,                                          stack: "Outfit, sans-serif" },
  { name: "Inter",       googleQuery: "Inter:wght@300;400;500;600;700",              stack: "Inter, sans-serif" },
  { name: "Poppins",     googleQuery: "Poppins:wght@300;400;500;600;700",            stack: "Poppins, sans-serif" },
  { name: "Raleway",     googleQuery: "Raleway:wght@300;400;500;600;700",            stack: "Raleway, sans-serif" },
  { name: "Montserrat",  googleQuery: "Montserrat:wght@300;400;500;600;700",         stack: "Montserrat, sans-serif" },
  { name: "Nunito",      googleQuery: "Nunito:wght@300;400;500;600;700",             stack: "Nunito, sans-serif" },
  { name: "DM Sans",     googleQuery: "DM+Sans:wght@300;400;500;600;700",            stack: "'DM Sans', sans-serif" },
];

export const SERIF_FONTS: FontOption[] = [
  { name: "Cormorant Garamond", googleQuery: null,                                                   stack: "'Cormorant Garamond', serif" },
  { name: "Playfair Display",   googleQuery: "Playfair+Display:wght@400;500;600;700",                stack: "'Playfair Display', serif" },
  { name: "Lora",               googleQuery: "Lora:wght@400;500;600;700",                            stack: "Lora, serif" },
  { name: "Merriweather",       googleQuery: "Merriweather:wght@300;400;700",                        stack: "Merriweather, serif" },
  { name: "EB Garamond",        googleQuery: "EB+Garamond:ital,wght@0,400;0,500;0,600;1,400",       stack: "'EB Garamond', serif" },
  { name: "Libre Baskerville",  googleQuery: "Libre+Baskerville:ital,wght@0,400;0,700;1,400",       stack: "'Libre Baskerville', serif" },
];

/** Generates a Google Fonts CSS2 URL for a list of query params */
export function googleFontsUrl(queries: string[]): string {
  const families = queries.map((q) => `family=${q}`).join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}
