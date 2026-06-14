"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLangContext } from "@/lib/lang-context";

interface Confession { id: string; text: string; ts: number; }

// pastel card backgrounds cycling
const CARD_COLORS = [
  "rgba(214,169,157,0.18)",
  "rgba(214,218,200,0.22)",
  "rgba(251,243,213,0.55)",
  "rgba(232,196,188,0.20)",
  "rgba(156,175,170,0.16)",
  "rgba(255,255,255,0.60)",
];
// slight rotations so cards feel hand-placed
const CARD_ROTS = [-1.2, 0.8, -0.5, 1.4, -0.9, 0.3, -1.6, 0.6];

export function ConfessionWall() {
  const { t, dir } = useLangContext();
  const [confessions, setConfessions] = React.useState<Confession[]>([]);
  const [text, setText] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const isRTL = /[֐-׿]/.test(text) || dir === "rtl";

  React.useEffect(() => {
    fetch("/api/confessions")
      .then((r) => r.json())
      .then(setConfessions);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    if (trimmed.length > 120) { setError(t.confMaxError); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/confessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });
      if (!res.ok) throw new Error();
      const entry: Confession = await res.json();
      setConfessions((prev) => [entry, ...prev]);
      setText("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2800);
    } catch {
      setError(t.confError);
    } finally {
      setSubmitting(false);
    }
  };

  const remaining = 120 - text.length;

  return (
    <section
      id="confession-wall"
      aria-label={t.confHeading}
      className="relative py-16 sm:py-24 px-4 overflow-hidden"
      dir={dir}
    >
      {/* watercolor blob bg for this section */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/31.png" alt="" aria-hidden
        className="absolute -top-20 -left-20 w-[320px] sm:w-[480px] pointer-events-none select-none opacity-25 rotate-12" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/30.png" alt="" aria-hidden
        className="absolute bottom-10 right-0 w-[260px] sm:w-[380px] pointer-events-none select-none opacity-20 -rotate-6" />

      {/* roses — large anchor top-right */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/29.png" alt="" aria-hidden
        className="absolute -top-6 right-4 sm:right-10 w-[130px] sm:w-[200px] pointer-events-none select-none opacity-75" />

      {/* trees — bottom corners */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/33.png" alt="" aria-hidden
        className="absolute bottom-0 left-0 w-[100px] sm:w-[160px] pointer-events-none select-none opacity-30 -translate-x-1/4" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/32.png" alt="" aria-hidden
        className="absolute bottom-0 right-0 w-[90px] sm:w-[140px] pointer-events-none select-none opacity-28 translate-x-1/4" />

      {/* ── header ── */}
      <div className="relative z-10 flex flex-col items-center text-center mb-10 sm:mb-14">
        <p className="font-sans font-light text-[9px] tracking-[0.55em] uppercase text-[#3D2B1F] mb-3">
          {t.confEyebrow}
        </p>
        <h2
          className="font-[family-name:var(--font-display)] italic font-light text-3xl sm:text-5xl text-[#3D2B1F]"
          style={{ letterSpacing: "-0.01em" }}
        >
          {t.confHeading}
        </h2>
        <p className="font-[family-name:var(--font-serif)] italic font-light text-base sm:text-lg text-[#3D2B1F] mt-3 max-w-xs sm:max-w-sm leading-relaxed">
          {t.confDesc}
        </p>
        <div className="flex items-center gap-4 mt-4" aria-hidden>
          <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#D6A99D]/50" />
          <svg className="w-1.5 h-1.5" viewBox="0 0 24 24" style={{ fill: "rgba(214,169,157,.6)" }}>
            <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
          </svg>
          <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#D6A99D]/50" />
        </div>
      </div>

      {/* ── input form ── */}
      <div className="relative z-10 max-w-lg mx-auto mb-10 sm:mb-14">
        <form onSubmit={handleSubmit} noValidate>
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.72)",
              boxShadow: "0 4px 32px rgba(92,74,58,0.10), 0 1px 6px rgba(92,74,58,0.06)",
              border: "1px solid rgba(214,169,157,0.35)",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => { setText(e.target.value.slice(0, 120)); setError(""); }}
              placeholder={t.confPlaceholder}
              dir={isRTL ? "rtl" : "ltr"}
              maxLength={120}
              className="w-full bg-transparent px-5 pt-4 pb-3 font-[family-name:var(--font-serif)] italic text-base sm:text-lg text-[#3D2B1F] placeholder:text-[#3D2B1F]/35 outline-none"
              aria-label="Confession text"
            />
            <div className="flex items-center justify-between px-5 pb-4 gap-3">
              <span
                className="font-sans text-[10px] tabular-nums"
                style={{ color: remaining <= 20 ? "#C4607A" : "rgba(61,43,31,0.4)" }}
              >
                {t.confCharsLeft.replace("{n}", String(remaining))}
              </span>
              <button
                type="submit"
                disabled={submitting || !text.trim()}
                className="cursor-pointer inline-flex items-center gap-2 px-5 py-2 rounded-full font-sans font-light text-[11px] tracking-[0.18em] uppercase transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]"
                style={{
                  background: "#D6A99D",
                  color: "#fff",
                  boxShadow: "0 2px 12px rgba(214,169,157,0.35)",
                }}
              >
                {submitting ? (
                  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                  </svg>
                )}
                {t.confPostBtn}
              </button>
            </div>
          </div>

          {/* error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="font-sans text-[11px] text-[#C4607A] mt-2 text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* success */}
          <AnimatePresence>
            {submitted && (
              <motion.p
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="font-[family-name:var(--font-serif)] italic text-sm text-[#3D2B1F] mt-2 text-center"
              >
                {t.confSuccess}
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* ── wall grid ── */}
      <div className="relative z-10 max-w-2xl mx-auto">
        {confessions.length === 0 ? (
          <p className="text-center font-[family-name:var(--font-serif)] italic text-[#3D2B1F]/50 text-sm">
            {t.confEmpty}
          </p>
        ) : (
          <motion.div
            className="columns-2 sm:columns-3 gap-3 sm:gap-4"
            initial={false}
          >
            <AnimatePresence initial={false}>
              {confessions.map((c, i) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, scale: 0.85, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className="break-inside-avoid mb-3 sm:mb-4 inline-block w-full"
                >
                  <div
                    className="px-4 py-4 rounded-xl"
                    style={{
                      background: CARD_COLORS[i % CARD_COLORS.length],
                      transform: `rotate(${CARD_ROTS[i % CARD_ROTS.length]}deg)`,
                      boxShadow: "0 2px 16px rgba(92,74,58,0.08), 0 1px 4px rgba(92,74,58,0.05)",
                      border: "1px solid rgba(214,169,157,0.22)",
                    }}
                  >
                    <p
                      className="font-[family-name:var(--font-serif)] italic text-sm sm:text-base leading-snug text-[#3D2B1F] break-words"
                      dir={/[֐-׿]/.test(c.text) ? "rtl" : "ltr"}
                    >
                      &ldquo;{c.text}&rdquo;
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
