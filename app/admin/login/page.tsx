"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials. Please try again.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2C2621] flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background arabesque watermark */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute text-[40vw] font-serif opacity-[0.025] text-[#FDF9F3] leading-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
          لبناني
        </div>
      </div>

      {/* Decorative orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#D96E4C]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4A5D3F]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div className="bg-[#FDF9F3]/[0.04] backdrop-blur-xl border border-[#FDF9F3]/10 rounded-2xl p-10 shadow-2xl">
          
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-36 mb-6">
              <Image
                src="/images/logo.png"
                alt="Alo Oven"
                width={200}
                height={60}
                className="w-full h-auto object-contain brightness-0 invert"
              />
            </div>
            <div className="text-center">
              <h1 className="text-[#FDF9F3] font-serif text-3xl tracking-tight mb-1">Admin Portal</h1>
              <p className="text-[#FDF9F3]/40 text-xs tracking-[0.2em] uppercase font-medium">Alo Oven · Management</p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FDF9F3]/15 to-transparent mb-8" />

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-[#FDF9F3]/50 text-[10px] uppercase tracking-[0.25em] font-semibold block">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FDF9F3]/30" />
                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="Enter username"
                  className="w-full bg-[#FDF9F3]/[0.06] border border-[#FDF9F3]/10 text-[#FDF9F3] placeholder-[#FDF9F3]/20 rounded-lg py-3.5 pl-11 pr-4 text-sm outline-none focus:border-[#D96E4C]/60 focus:bg-[#FDF9F3]/[0.09] transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[#FDF9F3]/50 text-[10px] uppercase tracking-[0.25em] font-semibold block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FDF9F3]/30" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter password"
                  className="w-full bg-[#FDF9F3]/[0.06] border border-[#FDF9F3]/10 text-[#FDF9F3] placeholder-[#FDF9F3]/20 rounded-lg py-3.5 pl-11 pr-12 text-sm outline-none focus:border-[#D96E4C]/60 focus:bg-[#FDF9F3]/[0.09] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FDF9F3]/30 hover:text-[#FDF9F3]/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="text-red-400 text-xs">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              className="w-full bg-[#D96E4C] text-white py-3.5 rounded-lg font-semibold tracking-wider uppercase text-xs hover:bg-[#c25e3e] transition-all duration-200 shadow-lg mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          {/* Footer note */}
          <p className="text-center text-[#FDF9F3]/20 text-[10px] tracking-wider uppercase mt-8">
            Restricted Access · Alo Oven © {new Date().getFullYear()}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
