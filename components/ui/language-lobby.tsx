"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FallingLeaves } from "@/components/ui/falling-leaves";
import { useLangContext } from "@/lib/lang-context";
import type { Lang } from "@/lib/translations";

export type { Lang };
const STORAGE_KEY = "wedding-lang";

interface Props {
  onEnter: (lang: Lang) => void;
}

export function LanguageLobby({ onEnter }: Props) {
  const [exiting, setExiting] = React.useState(false);
  const { setLang } = useLangContext();

  const choose = (lang: Lang) => {
    setExiting(true);
    setLang(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    setTimeout(() => onEnter(lang), 650);
  };

  return (
    <motion.div
      key="lobby"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.7 } }}
      exit={{ opacity: 0, scale: 1.03, transition: { duration: 0.55, ease: "easeInOut" } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg,#FDFAF4 0%,#F9EFE7 45%,#EFF0EC 100%)" }}
    >
      {/* watercolor washes */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/31.png" alt="" aria-hidden
        className="absolute top-0 left-0 w-[55vw] max-w-[480px] pointer-events-none select-none opacity-50 -translate-x-[8%] -translate-y-[5%]" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/30.png" alt="" aria-hidden
        className="absolute top-0 right-0 w-[45vw] max-w-[400px] pointer-events-none select-none opacity-40 translate-x-[8%] -translate-y-[5%]" />

      {/* weeping willow centred */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/33.png" alt="" aria-hidden
        className="absolute top-1/2 left-1/2 pointer-events-none select-none opacity-40"
        style={{ width: "min(92vw, 820px)", transform: "translate(-50%, -54%)" }} />

      {/* falling leaves */}
      <FallingLeaves />

      {/* content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">

        {/* small eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.7 } }}
          className="font-sans font-light text-xs sm:text-sm tracking-[0.35em] uppercase text-[#3D2B1F] mb-5"
        >
          October 14th, 2026
        </motion.p>

        {/* names */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.45, duration: 0.8 } }}
          className="font-[family-name:var(--font-display)] italic font-light leading-none text-[#4A5E35]"
          style={{ fontSize: "clamp(3.2rem, 14vw, 9rem)", letterSpacing: "-0.01em" }}
        >
          Alon &amp; May
        </motion.h1>

        {/* divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1, transition: { delay: 0.7, duration: 0.6 } }}
          className="flex items-center gap-4 mt-5 mb-5"
          aria-hidden
        >
          <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#7A9A6A]/50" />
          <svg className="w-2 h-2 shrink-0" viewBox="0 0 24 24" style={{ fill: "rgba(122,154,106,.6)" }}>
            <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
          </svg>
          <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#7A9A6A]/50" />
        </motion.div>

        {/* subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.8, duration: 0.7 } }}
          className="font-[family-name:var(--font-serif)] italic font-light text-xl sm:text-2xl text-[#3D2B1F] mb-10 sm:mb-12"
        >
          Choose your language to continue
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 1.0, duration: 0.7 } }}
          className="flex items-center gap-4 sm:gap-6"
        >
          {/* English */}
          <button
            onClick={() => choose("en")}
            disabled={exiting}
            className="cursor-pointer group relative inline-flex items-center justify-center min-h-[52px] px-10 sm:px-12 rounded-full font-sans font-light text-[12px] tracking-[0.24em] uppercase transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none"
            style={{
              background: "#4A5E35",
              color: "#fff",
              boxShadow: "0 4px 24px rgba(74,94,53,0.25), 0 1px 6px rgba(74,94,53,0.15)",
            }}
          >
            <motion.span
              whileHover={{ letterSpacing: "0.32em" }}
              transition={{ duration: 0.2 }}
            >
              English
            </motion.span>
          </button>

          {/* Hebrew */}
          <button
            onClick={() => choose("he")}
            disabled={exiting}
            className="cursor-pointer inline-flex items-center justify-center min-h-[52px] px-10 sm:px-12 rounded-full font-sans font-light text-[14px] tracking-[0.06em] transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none"
            style={{
              background: "rgba(255,255,255,0.65)",
              color: "#4A5E35",
              border: "1.5px solid rgba(74,94,53,0.30)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 16px rgba(74,94,53,0.10)",
            }}
            dir="rtl"
          >
            <motion.span
              whileHover={{ letterSpacing: "0.10em" }}
              transition={{ duration: 0.2 }}
            >
              עברית
            </motion.span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* Hook — returns null while hydrating to avoid SSR mismatch */
export function useLang(): { lang: Lang | null; setLang: (l: Lang) => void } {
  const [lang, setLangState] = React.useState<Lang | null>(null);

  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored === "en" || stored === "he") setLangState(stored);
  }, []);

  const setLang = React.useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  return { lang, setLang };
}
