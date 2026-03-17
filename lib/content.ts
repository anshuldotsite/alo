import fs from "fs";
import path from "path";

const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

// ─── Types ───────────────────────────────────────────────────────────────────

export interface HeroContent {
  tagline: string;
  headline: string;
  subtext: string;
  ctaLabel: string;
  estYear: string;
}

export interface StoryContent {
  sectionLabel: string;
  headline: string;
  body: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  desc: string;
}

export interface HoursEntry {
  days: string;
  time: string;
}

export interface InfoContent {
  address: string;
  phone: string;
  email: string;
  hours: HoursEntry[];
  facebook: string;
  instagram: string;
}

export interface ThemeContent {
  background: string;
  foreground: string;
  primary: string;
  accent: string;
  secondary: string;
  sansFont: string;
  serifFont: string;
  logoUrl: string;
}

export interface SiteContent {
  hero: HeroContent;
  story: StoryContent;
  menu: MenuItem[];
  info: InfoContent;
  theme: ThemeContent;
}

// ─── Reader ──────────────────────────────────────────────────────────────────

export function getContent(): SiteContent {
  const raw = fs.readFileSync(CONTENT_PATH, "utf-8");
  return JSON.parse(raw) as SiteContent;
}
