"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Save, Plus, Trash2, ChevronDown, ChevronUp,
  Layout, BookOpen, UtensilsCrossed, MapPin, CheckCircle2,
  AlertCircle, Loader2, DollarSign, Edit3, Palette, Upload
} from "lucide-react";
import { SANS_FONTS, SERIF_FONTS } from "@/lib/fonts";

// ─── TYPES ──────────────────────────────────────────────────────────────────

interface HeroContent {
  tagline: string; headline: string; subtext: string; ctaLabel: string; estYear: string;
}
interface StoryContent {
  sectionLabel: string; headline: string; body: string;
}
interface MenuItem {
  id: string; name: string; price: number; desc: string;
}
interface HoursEntry {
  days: string; time: string;
}
interface InfoContent {
  address: string; phone: string; email: string;
  hours: HoursEntry[]; facebook: string; instagram: string;
}
interface ThemeContent {
  background: string; foreground: string; primary: string;
  accent: string; secondary: string; sansFont: string; serifFont: string; logoUrl: string;
}
interface SiteContent {
  hero: HeroContent; story: StoryContent; menu: MenuItem[]; info: InfoContent; theme: ThemeContent;
}

type Tab = "hero" | "story" | "menu" | "info" | "theme";

// ─── HELPERS ────────────────────────────────────────────────────────────────

function Field({
  label, id, value, onChange, multiline = false, type = "text", prefix,
}: {
  label: string; id: string; value: string | number;
  onChange: (v: string) => void; multiline?: boolean; type?: string; prefix?: string;
}) {
  const inputClass =
    "w-full bg-[#FDF9F3] border border-[#2C2621]/15 rounded-lg px-4 py-3 text-sm text-[#2C2621] " +
    "placeholder-[#2C2621]/30 outline-none focus:border-[#D96E4C]/50 focus:ring-2 focus:ring-[#D96E4C]/10 " +
    "transition-all duration-200 resize-none";

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[10px] uppercase tracking-[0.2em] text-[#2C2621]/50 font-semibold block">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-3 text-[#2C2621]/40 text-sm font-medium select-none">{prefix}</span>
        )}
        {multiline ? (
          <textarea
            id={id}
            rows={4}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass + (prefix ? " pl-7" : "")}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass + (prefix ? " pl-7" : "")}
          />
        )}
      </div>
    </div>
  );
}

function SaveButton({ onClick, saving, saved }: { onClick: () => void; saving: boolean; saved: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="flex items-center gap-2 bg-[#D96E4C] text-white px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase hover:bg-[#c25e3e] transition-all duration-200 disabled:opacity-60 shadow-sm"
    >
      {saving ? (
        <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</>
      ) : saved ? (
        <><CheckCircle2 className="w-3.5 h-3.5" /> Saved!</>
      ) : (
        <><Save className="w-3.5 h-3.5" /> Save Changes</>
      )}
    </button>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("hero");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [sectionSaving, setSectionSaving] = useState<Tab | null>(null);
  const [sectionSaved, setSectionSaved] = useState<Tab | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [expandedMenuIdx, setExpandedMenuIdx] = useState<number | null>(null);

  // ── Auth check + load content ────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const authRes = await fetch("/api/admin/auth");
      if (!authRes.ok) {
        router.replace("/admin/login");
        return;
      }
      const contentRes = await fetch("/api/admin/content");
      if (!contentRes.ok) { setAuthError(true); setLoading(false); return; }
      const data = await contentRes.json();
      setContent(data);
      setLoading(false);
    };
    init();
  }, [router]);

  const showToast = useCallback((type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const saveSection = useCallback(async (section: Tab) => {
    if (!content) return;
    setSectionSaving(section);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [section]: content[section] }),
      });
      if (res.ok) {
        setSectionSaved(section);
        showToast("success", "Changes saved successfully!");
        setTimeout(() => setSectionSaved(null), 2500);
      } else {
        showToast("error", "Failed to save changes.");
      }
    } catch {
      showToast("error", "Network error. Please retry.");
    } finally {
      setSectionSaving(null);
    }
  }, [content, showToast]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.replace("/admin/login");
  };

  // ── Menu helpers ─────────────────────────────────────────────────────────
  const updateMenuItem = (idx: number, field: keyof MenuItem, val: string | number) => {
    if (!content) return;
    const updated = [...content.menu];
    updated[idx] = { ...updated[idx], [field]: val };
    setContent({ ...content, menu: updated });
  };

  const addMenuItem = () => {
    if (!content) return;
    const newItem: MenuItem = {
      id: `NEW_${Date.now()}`,
      name: "New Item",
      price: 0,
      desc: "",
    };
    const updated = [...content.menu, newItem];
    setContent({ ...content, menu: updated });
    setExpandedMenuIdx(updated.length - 1);
  };

  const removeMenuItem = (idx: number) => {
    if (!content) return;
    const updated = content.menu.filter((_, i) => i !== idx);
    setContent({ ...content, menu: updated });
    setExpandedMenuIdx(null);
  };

  // ── Hours helpers ────────────────────────────────────────────────────────
  const updateHours = (idx: number, field: keyof HoursEntry, val: string) => {
    if (!content) return;
    const updated = [...content.info.hours];
    updated[idx] = { ...updated[idx], [field]: val };
    setContent({ ...content, info: { ...content.info, hours: updated } });
  };

  const addHoursRow = () => {
    if (!content) return;
    setContent({ ...content, info: { ...content.info, hours: [...content.info.hours, { days: "", time: "" }] } });
  };

  const removeHoursRow = (idx: number) => {
    if (!content) return;
    setContent({ ...content, info: { ...content.info, hours: content.info.hours.filter((_, i) => i !== idx) } });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !content) return;
    
    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "File too large. Max 5MB.");
      return;
    }
    
    const formData = new FormData();
    formData.append("logo", file);
    
    setSectionSaving("theme");
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setContent({ ...content, theme: { ...content.theme, logoUrl: data.url } });
        showToast("success", "Logo updated successfully!");
      } else {
        showToast("error", data.error || "Upload failed");
      }
    } catch {
      showToast("error", "Network error during upload");
    } finally {
      setSectionSaving(null);
    }
  };

  // ── TAB config ───────────────────────────────────────────────────────────
  const tabs: { id: Tab; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: "hero", label: "Hero", icon: <Layout className="w-4 h-4" />, desc: "Landing section" },
    { id: "story", label: "Story", icon: <BookOpen className="w-4 h-4" />, desc: "Our story text" },
    { id: "menu", label: "Menu", icon: <UtensilsCrossed className="w-4 h-4" />, desc: "Food items & prices" },
    { id: "info", label: "Info", icon: <MapPin className="w-4 h-4" />, desc: "Contact & hours" },
    { id: "theme", label: "Theme", icon: <Palette className="w-4 h-4" />, desc: "Colors, fonts & logo" },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF9F3] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#D96E4C] animate-spin" />
          <p className="text-[#2C2621]/50 text-sm tracking-wider uppercase font-medium">Loading Dashboard…</p>
        </div>
      </div>
    );
  }

  if (authError || !content) {
    return (
      <div className="min-h-screen bg-[#FDF9F3] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="w-8 h-8 text-red-400" />
          <p className="text-[#2C2621] font-semibold">Unable to load content</p>
          <button
            onClick={() => router.replace("/admin/login")}
            className="text-[#D96E4C] text-sm underline underline-offset-2"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4EFE7] font-sans">

      {/* ─── Topbar ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#FDF9F3]/95 backdrop-blur-md border-b border-[#2C2621]/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="w-28">
              <Image src="/images/logo.png" alt="Alo Oven" width={200} height={60} className="w-full h-auto object-contain mix-blend-multiply" />
            </div>
            <div className="hidden md:block w-px h-6 bg-[#2C2621]/15" />
            <div className="hidden md:flex flex-col">
              <span className="text-[10px] text-[#2C2621]/40 uppercase tracking-widest font-medium">Admin</span>
              <span className="text-sm text-[#2C2621] font-semibold leading-tight">Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 text-xs text-[#2C2621]/50 hover:text-[#2C2621] transition-colors font-medium tracking-wide px-3 py-2 rounded-lg hover:bg-[#2C2621]/5"
            >
              <span>View Site ↗</span>
            </a>
            <button
              id="admin-logout-btn"
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs text-[#2C2621]/60 hover:text-red-500 transition-colors font-semibold tracking-wider uppercase px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:block">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 md:px-10 py-8">
        <div className="flex flex-col md:flex-row gap-8">

          {/* ─── Sidebar ───────────────────────────────────────────────── */}
          <aside className="md:w-60 shrink-0">
            <div className="bg-[#FDF9F3] rounded-2xl border border-[#2C2621]/10 p-3 shadow-sm sticky top-24">
              <p className="text-[9px] uppercase tracking-[0.25em] text-[#2C2621]/35 font-semibold px-3 pt-2 pb-3">
                Content Sections
              </p>
              <nav className="space-y-1">
                {tabs.map(({ id, label, icon, desc }) => (
                  <button
                    key={id}
                    id={`tab-${id}`}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group ${
                      activeTab === id
                        ? "bg-[#D96E4C] text-white shadow-sm"
                        : "text-[#2C2621]/60 hover:bg-[#2C2621]/5 hover:text-[#2C2621]"
                    }`}
                  >
                    <span className={activeTab === id ? "text-white" : "text-[#2C2621]/40 group-hover:text-[#2C2621]/60"}>
                      {icon}
                    </span>
                    <div>
                      <div className="text-sm font-semibold leading-tight">{label}</div>
                      <div className={`text-[10px] ${activeTab === id ? "text-white/70" : "text-[#2C2621]/35"}`}>{desc}</div>
                    </div>
                  </button>
                ))}
              </nav>

              {/* Quick Stats */}
              <div className="mt-6 mx-1 bg-[#2C2621]/[0.03] rounded-xl p-4 border border-[#2C2621]/8">
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#2C2621]/35 font-semibold mb-3">Quick Stats</p>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#2C2621]/50">Menu Items</span>
                    <span className="text-xs font-bold text-[#2C2621]">{content.menu.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#2C2621]/50">Hours Entries</span>
                    <span className="text-xs font-bold text-[#2C2621]">{content.info.hours.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#2C2621]/50">Price Range</span>
                    <span className="text-xs font-bold text-[#2C2621]">
                      ${Math.min(...content.menu.map(m => m.price)).toFixed(2)} – ${Math.max(...content.menu.map(m => m.price)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ─── Main Content ──────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >

                {/* ── HERO TAB ─────────────────────────────────────────── */}
                {activeTab === "hero" && (
                  <SectionCard
                    title="Hero Section"
                    subtitle="The first thing visitors see — your main tagline, headline, and call-to-action."
                    icon={<Layout className="w-5 h-5 text-[#D96E4C]" />}
                    onSave={() => saveSection("hero")}
                    saving={sectionSaving === "hero"}
                    saved={sectionSaved === "hero"}
                  >
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field id="hero-tagline" label="Tagline (small text above)" value={content.hero.tagline} onChange={(v) => setContent({ ...content, hero: { ...content.hero, tagline: v } })} />
                      <Field id="hero-est" label="Est. Year (badge)" value={content.hero.estYear} onChange={(v) => setContent({ ...content, hero: { ...content.hero, estYear: v } })} />
                    </div>
                    <Field id="hero-headline" label="Headline (Press Enter for line breaks)" value={content.hero.headline} onChange={(v) => setContent({ ...content, hero: { ...content.hero, headline: v } })} multiline />
                    <Field id="hero-subtext" label="Subtext / Description" value={content.hero.subtext} onChange={(v) => setContent({ ...content, hero: { ...content.hero, subtext: v } })} multiline />
                    <Field id="hero-cta" label="Button Label" value={content.hero.ctaLabel} onChange={(v) => setContent({ ...content, hero: { ...content.hero, ctaLabel: v } })} />

                    {/* Live preview strip */}
                    <div className="mt-2 rounded-xl bg-[#FDF9F3] border border-[#2C2621]/10 p-6">
                      <p className="text-[9px] uppercase tracking-[0.25em] text-[#2C2621]/35 font-semibold mb-4">Preview</p>
                      <p className="text-[#D96E4C] text-xs font-semibold tracking-widest uppercase mb-2">{content.hero.tagline}</p>
                      <p className="font-serif text-3xl text-[#2C2621] leading-tight mb-3" dangerouslySetInnerHTML={{ __html: content.hero.headline.replace(/\n/g, '<br/>') }} />
                      <p className="text-[#2C2621]/60 text-sm leading-relaxed mb-4 max-w-sm">{content.hero.subtext}</p>
                      <span className="inline-block bg-[#4A5D3F] text-white text-[10px] px-5 py-2.5 font-semibold tracking-widest uppercase rounded-tr-xl rounded-bl-xl">
                        {content.hero.ctaLabel}
                      </span>
                    </div>
                  </SectionCard>
                )}

                {/* ── STORY TAB ────────────────────────────────────────── */}
                {activeTab === "story" && (
                  <SectionCard
                    title="Our Story"
                    subtitle="The about section that tells your brand story."
                    icon={<BookOpen className="w-5 h-5 text-[#D96E4C]" />}
                    onSave={() => saveSection("story")}
                    saving={sectionSaving === "story"}
                    saved={sectionSaved === "story"}
                  >
                    <Field id="story-label" label="Section Label (small uppercase)" value={content.story.sectionLabel} onChange={(v) => setContent({ ...content, story: { ...content.story, sectionLabel: v } })} />
                    <Field id="story-headline" label="Headline (Press Enter for line breaks)" value={content.story.headline} onChange={(v) => setContent({ ...content, story: { ...content.story, headline: v } })} multiline />
                    <Field id="story-body" label="Body Text" value={content.story.body} onChange={(v) => setContent({ ...content, story: { ...content.story, body: v } })} multiline />

                    {/* Preview */}
                    <div className="rounded-xl bg-[#FDF9F3] border border-[#2C2621]/10 p-6">
                      <p className="text-[9px] uppercase tracking-[0.25em] text-[#2C2621]/35 font-semibold mb-4">Preview</p>
                      <p className="text-[#4A5D3F] text-[10px] font-semibold tracking-[0.2em] uppercase mb-3">{content.story.sectionLabel}</p>
                      <p className="font-serif text-2xl text-[#2C2621] leading-tight mb-4" dangerouslySetInnerHTML={{ __html: content.story.headline.replace(/\n/g, '<br/>') }} />
                      <p className="text-[#2C2621]/60 text-sm leading-relaxed">{content.story.body}</p>
                    </div>
                  </SectionCard>
                )}

                {/* ── MENU TAB ─────────────────────────────────────────── */}
                {activeTab === "menu" && (
                  <SectionCard
                    title="Menu Items"
                    subtitle="Add, edit, or remove items from your menu. Changes are reflected on the live site."
                    icon={<UtensilsCrossed className="w-5 h-5 text-[#D96E4C]" />}
                    onSave={() => saveSection("menu")}
                    saving={sectionSaving === "menu"}
                    saved={sectionSaved === "menu"}
                    headerExtra={
                      <button
                        id="add-menu-item-btn"
                        onClick={addMenuItem}
                        className="flex items-center gap-1.5 text-xs font-semibold text-[#4A5D3F] hover:text-white border border-[#4A5D3F]/40 hover:bg-[#4A5D3F] px-3 py-2 rounded-lg transition-all duration-200"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Item
                      </button>
                    }
                  >
                    <div className="space-y-3">
                      {content.menu.map((item, idx) => (
                        <div key={item.id} className="bg-[#FDF9F3] border border-[#2C2621]/10 rounded-xl overflow-hidden shadow-sm">
                          {/* Accordion header */}
                          <div
                            className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#2C2621]/[0.02] transition-colors"
                            onClick={() => setExpandedMenuIdx(expandedMenuIdx === idx ? null : idx)}
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-[#D96E4C]/10 flex items-center justify-center shrink-0">
                                <UtensilsCrossed className="w-3.5 h-3.5 text-[#D96E4C]" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-sm text-[#2C2621] truncate">{item.name}</p>
                                <p className="text-xs text-[#2C2621]/40 truncate">{item.desc || "No description"}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0 ml-3">
                              <span className="text-sm font-bold text-[#D96E4C]">${item.price.toFixed(2)}</span>
                              {expandedMenuIdx === idx ? (
                                <ChevronUp className="w-4 h-4 text-[#2C2621]/40" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-[#2C2621]/40" />
                              )}
                            </div>
                          </div>

                          {/* Expanded editor */}
                          <AnimatePresence>
                            {expandedMenuIdx === idx && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="px-5 pb-5 pt-1 border-t border-[#2C2621]/8 space-y-4">
                                  <div className="grid sm:grid-cols-2 gap-4">
                                    <Field
                                      id={`menu-name-${idx}`}
                                      label="Item Name"
                                      value={item.name}
                                      onChange={(v) => updateMenuItem(idx, "name", v)}
                                    />
                                    <div className="space-y-1.5">
                                      <label className="text-[10px] uppercase tracking-[0.2em] text-[#2C2621]/50 font-semibold flex items-center gap-1.5 block">
                                        <DollarSign className="w-3 h-3" /> Price
                                      </label>
                                      <input
                                        id={`menu-price-${idx}`}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={item.price}
                                        onChange={(e) => updateMenuItem(idx, "price", parseFloat(e.target.value) || 0)}
                                        className="w-full bg-[#FDF9F3] border border-[#2C2621]/15 rounded-lg px-4 py-3 text-sm text-[#2C2621] outline-none focus:border-[#D96E4C]/50 focus:ring-2 focus:ring-[#D96E4C]/10 transition-all duration-200"
                                      />
                                    </div>
                                  </div>
                                  <Field
                                    id={`menu-desc-${idx}`}
                                    label="Description"
                                    value={item.desc}
                                    onChange={(v) => updateMenuItem(idx, "desc", v)}
                                    multiline
                                  />
                                  <div className="flex justify-between items-center pt-1">
                                    <span className="text-[10px] text-[#2C2621]/30 font-mono">ID: {item.id}</span>
                                    <button
                                      onClick={() => removeMenuItem(idx)}
                                      className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-white hover:bg-red-500 px-3 py-1.5 rounded-lg border border-red-200 hover:border-red-500 transition-all duration-200"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" /> Remove Item
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}

                      {content.menu.length === 0 && (
                        <div className="text-center py-12 text-[#2C2621]/30">
                          <UtensilsCrossed className="w-10 h-10 mx-auto mb-3 opacity-30" />
                          <p className="text-sm">No menu items yet. Click &ldquo;Add Item&rdquo; to get started.</p>
                        </div>
                      )}
                    </div>
                  </SectionCard>
                )}

                {/* ── INFO TAB ─────────────────────────────────────────── */}
                {activeTab === "info" && (
                  <SectionCard
                    title="Contact & Hours"
                    subtitle="Update your location, contact details, and operating hours."
                    icon={<MapPin className="w-5 h-5 text-[#D96E4C]" />}
                    onSave={() => saveSection("info")}
                    saving={sectionSaving === "info"}
                    saved={sectionSaved === "info"}
                  >
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field id="info-phone" label="Phone Number" value={content.info.phone} onChange={(v) => setContent({ ...content, info: { ...content.info, phone: v } })} />
                      <Field id="info-email" label="Email Address" value={content.info.email} type="email" onChange={(v) => setContent({ ...content, info: { ...content.info, email: v } })} />
                    </div>
                    <Field id="info-address" label="Address (each line shown separately)" value={content.info.address} onChange={(v) => setContent({ ...content, info: { ...content.info, address: v } })} multiline />

                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field id="info-facebook" label="Facebook URL" value={content.info.facebook} onChange={(v) => setContent({ ...content, info: { ...content.info, facebook: v } })} />
                      <Field id="info-instagram" label="Instagram URL" value={content.info.instagram} onChange={(v) => setContent({ ...content, info: { ...content.info, instagram: v } })} />
                    </div>

                    {/* Hours */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-[#2C2621]/50 font-semibold">Hours of Operation</label>
                        <button
                          onClick={addHoursRow}
                          className="flex items-center gap-1 text-[10px] font-semibold text-[#4A5D3F] hover:text-[#4A5D3F]/70 transition-colors"
                        >
                          <Plus className="w-3 h-3" /> Add Row
                        </button>
                      </div>
                      {content.info.hours.map((row, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <input
                            id={`hours-days-${idx}`}
                            value={row.days}
                            onChange={(e) => updateHours(idx, "days", e.target.value)}
                            placeholder="Mon — Fri"
                            className="flex-1 bg-[#FDF9F3] border border-[#2C2621]/15 rounded-lg px-4 py-2.5 text-sm text-[#2C2621] outline-none focus:border-[#D96E4C]/50 transition-all"
                          />
                          <input
                            id={`hours-time-${idx}`}
                            value={row.time}
                            onChange={(e) => updateHours(idx, "time", e.target.value)}
                            placeholder="9:00am – 9:00pm"
                            className="flex-1 bg-[#FDF9F3] border border-[#2C2621]/15 rounded-lg px-4 py-2.5 text-sm text-[#2C2621] outline-none focus:border-[#D96E4C]/50 transition-all"
                          />
                          <button
                            onClick={() => removeHoursRow(idx)}
                            className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Preview */}
                    <div className="rounded-xl bg-[#FDF9F3] border border-[#2C2621]/10 p-6">
                      <p className="text-[9px] uppercase tracking-[0.25em] text-[#2C2621]/35 font-semibold mb-4">Preview</p>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <p className="text-[8px] uppercase tracking-[0.3em] text-[#D96E4C] font-semibold mb-2">Find Us</p>
                          <p className="text-[#2C2621]/70 text-sm font-light whitespace-pre-line">{content.info.address}</p>
                          <p className="text-[8px] uppercase tracking-[0.3em] text-[#D96E4C] font-semibold mt-4 mb-2">Contact</p>
                          <p className="text-[#2C2621]/70 text-sm font-light">{content.info.phone}</p>
                          <p className="text-[#2C2621]/70 text-sm font-light">{content.info.email}</p>
                        </div>
                        <div>
                          <p className="text-[8px] uppercase tracking-[0.3em] text-[#D96E4C] font-semibold mb-2">Hours</p>
                          <ul className="space-y-2">
                            {content.info.hours.map((h, i) => (
                              <li key={i} className="flex justify-between text-sm text-[#2C2621]/70 font-light">
                                <span>{h.days}</span>
                                <span className="text-[#2C2621]/40">{h.time}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </SectionCard>
                )}

                {/* ── THEME TAB ────────────────────────────────────────── */}
                {activeTab === "theme" && (
                  <SectionCard
                    title="Theme & Branding"
                    subtitle="Customize your colors, fonts, and upload your logo."
                    icon={<Palette className="w-5 h-5 text-[#D96E4C]" />}
                    onSave={() => saveSection("theme")}
                    saving={sectionSaving === "theme"}
                    saved={sectionSaved === "theme"}
                  >
                    {/* Logo Upload */}
                    <div className="space-y-3 mb-8">
                       <label className="text-[10px] uppercase tracking-[0.2em] text-[#2C2621]/50 font-semibold">Brand Logo</label>
                       <div className="flex items-center gap-6 bg-[#FDF9F3] border border-[#2C2621]/15 rounded-xl p-5">
                          <div className="w-32 h-16 bg-[#2C2621]/5 rounded-lg border border-[#2C2621]/10 flex items-center justify-center p-2 relative overflow-hidden">
                            {content.theme.logoUrl ? (
                               <Image src={content.theme.logoUrl} alt="Logo" fill className="object-contain p-2 mix-blend-multiply" />
                            ) : (
                               <span className="text-xs text-[#2C2621]/40">No Logo</span>
                            )}
                          </div>
                          <div>
                            <input type="file" id="logo-upload" accept="image/png, image/jpeg, image/webp, image/svg+xml" className="hidden" onChange={handleLogoUpload} />
                            <label htmlFor="logo-upload" className="flex items-center gap-2 bg-white border border-[#2C2621]/15 text-[#2C2621] px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-lg hover:border-[#D96E4C] hover:text-[#D96E4C] cursor-pointer transition-colors shadow-sm w-max">
                              <Upload className="w-3.5 h-3.5" /> Upload New Logo
                            </label>
                            <p className="text-[10px] text-[#2C2621]/40 mt-2">PNG, JPG, WebP, SVG. Max 5MB. Ideal ratio 3:1.</p>
                          </div>
                       </div>
                    </div>

                    {/* Colors */}
                     <div className="space-y-4 mb-8">
                       <label className="text-[10px] uppercase tracking-[0.2em] text-[#2C2621]/50 font-semibold">Brand Colors</label>
                       <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                         {[
                           { key: "background", label: "Background" },
                           { key: "foreground", label: "Text/Dark" },
                           { key: "primary", label: "Primary (Green)" },
                           { key: "accent", label: "Accent (Orange)" },
                           { key: "secondary", label: "Secondary (Beige)" }
                         ].map((c) => (
                           <div key={c.key} className="space-y-1.5">
                              <span className="text-[10px] text-[#2C2621]/60 font-medium">{c.label}</span>
                              <div className="relative">
                                <input
                                  type="color"
                                  value={content.theme[c.key as keyof ThemeContent]}
                                  onChange={(e) => setContent({ ...content, theme: { ...content.theme, [c.key]: e.target.value } })}
                                  className="w-full h-10 rounded-lg cursor-pointer border border-[#2C2621]/15 bg-white p-1"
                                />
                                <span className="absolute left-1/2 -translate-x-1/2 top-11 text-[9px] font-mono text-[#2C2621]/40 uppercase">
                                  {content.theme[c.key as keyof ThemeContent]}
                                </span>
                              </div>
                           </div>
                         ))}
                       </div>
                     </div>

                    {/* Fonts */}
                    <div className="space-y-4">
                       <label className="text-[10px] uppercase tracking-[0.2em] text-[#2C2621]/50 font-semibold">Typography</label>
                       <div className="grid sm:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-[#2C2621]/60 font-medium block">Sans-serif Font (Body & UI)</label>
                            <select
                              value={content.theme.sansFont}
                              onChange={(e) => setContent({ ...content, theme: { ...content.theme, sansFont: e.target.value } })}
                              className="w-full bg-[#FDF9F3] border border-[#2C2621]/15 rounded-lg px-4 py-3 text-sm text-[#2C2621] outline-none focus:border-[#D96E4C]/50 appearance-none"
                            >
                              {SANS_FONTS.map(f => (
                                <option key={f.name} value={f.name}>{f.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-[#2C2621]/60 font-medium block">Serif Font (Headings)</label>
                            <select
                              value={content.theme.serifFont}
                              onChange={(e) => setContent({ ...content, theme: { ...content.theme, serifFont: e.target.value } })}
                              className="w-full bg-[#FDF9F3] border border-[#2C2621]/15 rounded-lg px-4 py-3 text-sm text-[#2C2621] outline-none focus:border-[#D96E4C]/50 appearance-none"
                            >
                              {SERIF_FONTS.map(f => (
                                <option key={f.name} value={f.name}>{f.name}</option>
                              ))}
                            </select>
                          </div>
                       </div>
                    </div>
                  </SectionCard>
                )}

              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* ─── Toast ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-sm font-semibold ${
              toast.type === "success"
                ? "bg-[#4A5D3F] text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Section Card Component ──────────────────────────────────────────────────

function SectionCard({
  title, subtitle, icon, onSave, saving, saved, children, headerExtra
}: {
  title: string; subtitle: string; icon: React.ReactNode;
  onSave: () => void; saving: boolean; saved: boolean;
  children: React.ReactNode;
  headerExtra?: React.ReactNode;
}) {
  return (
    <div className="bg-[#FDF9F3] rounded-2xl border border-[#2C2621]/10 shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="px-7 py-6 border-b border-[#2C2621]/8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#D96E4C]/10 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h2 className="text-[#2C2621] font-semibold text-lg leading-tight">{title}</h2>
            <p className="text-[#2C2621]/45 text-xs mt-0.5">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:ml-auto shrink-0">
          {headerExtra}
          <SaveButton onClick={onSave} saving={saving} saved={saved} />
        </div>
      </div>

      {/* Card body */}
      <div className="px-7 py-7 space-y-5">
        {children}
      </div>
    </div>
  );
}
