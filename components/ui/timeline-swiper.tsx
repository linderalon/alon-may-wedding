"use client";

import * as React from "react";
import {
  motion,
  AnimatePresence,
  useAnimation,
  type PanInfo,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLangContext } from "@/lib/lang-context";

/* ─────────────────────────── data ─────────────────────────── */

import type { TranslationKey } from "@/lib/translations";

interface SlideBase {
  chapter: string;
  dateKey:  TranslationKey;
  titleKey: TranslationKey;
  textKey:  TranslationKey;
  photos: string[];
  alts: string[];
  accent: string;
  accentDark: string;
  special?: "proposal" | "finale";
}

interface Slide extends SlideBase {
  date:  string;
  title: string;
  text:  string;
}

const SLIDE_BASES: SlideBase[] = [
  { chapter:"01", dateKey:"tl01Date", titleKey:"tl01Title", textKey:"tl01Text",
    photos:["/photos/1.png"], alts:["Where we first met"],
    accent:"#F5E8E4", accentDark:"#C4877A" },
  { chapter:"02", dateKey:"tl02Date", titleKey:"tl02Title", textKey:"tl02Text",
    photos:["/photos/2.png"], alts:["Our first date"],
    accent:"#F7EDE0", accentDark:"#C89060" },
  { chapter:"03", dateKey:"tl03Date", titleKey:"tl03Title", textKey:"tl03Text",
    photos:["/photos/3.png"], alts:["First birthday together"],
    accent:"#F5EDD6", accentDark:"#B8962A" },
  { chapter:"04", dateKey:"tl04Date", titleKey:"tl04Title", textKey:"tl04Text",
    photos:["/photos/4.png","/photos/5.png","/photos/6.png","/photos/7.png","/photos/8.png","/photos/9.png"],
    alts:["Eating 1","Eating 2","Eating 3","Eating 4","Eating 5","Eating 6"],
    accent:"#F4E8D4", accentDark:"#B07840" },
  { chapter:"05", dateKey:"tl05Date", titleKey:"tl05Title", textKey:"tl05Text",
    photos:["/photos/10.png"], alts:["Moving in"],
    accent:"#E4EDE8", accentDark:"#5C8870" },
  { chapter:"06", dateKey:"tl06Date", titleKey:"tl06Title", textKey:"tl06Text",
    photos:["/photos/11.png","/photos/12.png","/photos/13.png"], alts:["Trip 1","Trip 2","Trip 3"],
    accent:"#DDE8F0", accentDark:"#4878A0" },
  { chapter:"07", dateKey:"tl07Date", titleKey:"tl07Title", textKey:"tl07Text",
    photos:["/photos/14.png"], alts:["Purim"],
    accent:"#EDE0F5", accentDark:"#8860C0" },
  { chapter:"08", dateKey:"tl08Date", titleKey:"tl08Title", textKey:"tl08Text",
    photos:["/photos/15.png"], alts:["War and shelters"],
    accent:"#E8E8E4", accentDark:"#787870" },
  { chapter:"09", dateKey:"tl09Date", titleKey:"tl09Title", textKey:"tl09Text",
    photos:["/photos/16.png"], alts:["Star gazing"],
    accent:"#DDE0EC", accentDark:"#4858A0" },
  { chapter:"10", dateKey:"tl10Date", titleKey:"tl10Title", textKey:"tl10Text",
    photos:["/photos/17.png"], alts:["She said yes"],
    accent:"#F0E0DC", accentDark:"#C4607A", special:"proposal" },
  { chapter:"11", dateKey:"tl11Date", titleKey:"tl11Title", textKey:"tl11Text",
    photos:["/photos/22.png","/photos/18.png","/photos/19.png","/photos/20.png","/photos/21.png"],
    alts:["Spain 1","Spain 2","Spain 3","Spain 4","Spain 5"],
    accent:"#F5EDD0", accentDark:"#C09030" },
  { chapter:"12", dateKey:"tl12Date", titleKey:"tl12Title", textKey:"tl12Text",
    photos:[], alts:[],
    accent:"#FBF3D5", accentDark:"#9CAFAA", special:"finale" },
];

/* ─────────────────────────── variants ─────────────────────── */

const DRAG_THRESHOLD = 55;
const VELOCITY_THRESHOLD = 380;

const slideVariants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? "108%" : "-108%",
    opacity: 0,
    scale: 0.90,
  }),
  center: {
    x: 0, opacity: 1, scale: 1,
    transition: {
      x:       { type: "spring" as const, stiffness: 310, damping: 30 },
      scale:   { type: "spring" as const, stiffness: 310, damping: 30 },
      opacity: { duration: 0.18 },
    },
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? "-32%" : "32%",
    opacity: 0, scale: 0.88,
    transition: {
      x:       { type: "spring" as const, stiffness: 360, damping: 38 },
      opacity: { duration: 0.14 },
      scale:   { duration: 0.18 },
    },
  }),
};

/* rotation for each card in the hand relative to centre */
function handRotation(index: number, active: number, total: number): number {
  const offset = index - active;
  // spread cards ±14° max, active card is upright
  const spread = total <= 3 ? 14 : total <= 5 ? 11 : 9;
  return offset * spread;
}
function handTranslateX(index: number, active: number): number {
  const offset = index - active;
  // cards shift left/right by ~36px per step
  return offset * 36;
}
function handTranslateY(index: number, active: number): number {
  // non-active cards drop down slightly
  return Math.abs(index - active) * 10;
}

/* ─────────────────────────── component ────────────────────── */

export function TimelineSwiper() {
  const { t, dir } = useLangContext();

  // build translated slides on each render (cheap)
  const SLIDES: Slide[] = SLIDE_BASES.map((b) => ({
    ...b,
    date:  t[b.dateKey]  as string,
    title: t[b.titleKey] as string,
    text:  t[b.textKey]  as string,
  }));

  const [current, setCurrent] = React.useState(0);
  const [direction, setDirection] = React.useState(0);
  const [hasInteracted, setHasInteracted] = React.useState(false);
  const hintControls = useAnimation();

  const total = SLIDES.length;
  const slide = SLIDES[current];

  const goNext = React.useCallback(() => {
    if (current < total - 1) {
      setDirection(1);
      setCurrent((c) => c + 1);
      setHasInteracted(true);
    }
  }, [current, total]);

  const goPrev = React.useCallback(() => {
    if (current > 0) {
      setDirection(-1);
      setCurrent((c) => c - 1);
      setHasInteracted(true);
    }
  }, [current]);

  /* keyboard nav */
  React.useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft")  goPrev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [goNext, goPrev]);

  /* snap controls to center immediately so the card is visible on mount */
  React.useEffect(() => {
    hintControls.set({ x: 0, opacity: 1, scale: 1 });
  }, [hintControls]);

  /* idle swipe-hint — nudge card left then spring back */
  React.useEffect(() => {
    if (hasInteracted) return;
    const t = setTimeout(async () => {
      await hintControls.start({
        x: -26,
        transition: { type: "spring", stiffness: 420, damping: 28 },
      });
      await hintControls.start({
        x: 0,
        transition: { type: "spring", stiffness: 360, damping: 22 },
      });
    }, 1800);
    return () => clearTimeout(t);
  }, [hasInteracted, hintControls]);

  const handleDragEnd = React.useCallback(
    (_: unknown, info: PanInfo) => {
      const { offset, velocity } = info;
      if (offset.x < -DRAG_THRESHOLD || velocity.x < -VELOCITY_THRESHOLD) goNext();
      else if (offset.x > DRAG_THRESHOLD || velocity.x > VELOCITY_THRESHOLD) goPrev();
    },
    [goNext, goPrev]
  );

  const isMulti = slide.photos.length > 1;

  return (
    <section
      id="our-story"
      aria-label="Our story"
      className="relative overflow-hidden flex flex-col"
      style={{ minHeight: "100svh" }}
    >
      {/* ── animated background wash ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ backgroundColor: slide.accent }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
      />

      {/* subtle paper noise */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "300px 300px",
        }}
      />

      {/* ── progress bar ── */}
      <div className="relative z-10 h-0.5 mx-6 sm:mx-10 mt-[72px]"
        style={{ background: `${slide.accentDark}22` }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: slide.accentDark }}
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        />
      </div>

      {/* ── chapter counter ── */}
      <div className="relative z-10 flex justify-between items-center px-6 sm:px-10 pt-3 pb-1">
        <span
          className="font-sans font-light text-[9px] tracking-[0.45em] uppercase"
          style={{ color: "#3D2B1F" }}
        >
          {t.aLoveStory}
        </span>
        <span
          className="font-sans font-light text-[10px] tabular-nums"
          style={{ color: "#3D2B1F" }}
        >
          {slide.chapter} / {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* ── swipe area ── */}
      <div
        className="relative z-10 flex-1 flex items-center justify-center overflow-hidden select-none"
        style={{ touchAction: "pan-y" }}
        dir={dir}
      >
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate={hasInteracted ? "center" : hintControls}
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.10}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            onDragStart={() => setHasInteracted(true)}
            whileDrag={{ scale: 0.97 }}
            className="w-full flex flex-col items-center px-6 sm:px-10 cursor-grab active:cursor-grabbing"
          >
            {/* date */}
            <p className="font-sans font-light text-[9px] sm:text-[10px] tracking-[0.50em] uppercase mb-3 sm:mb-4"
              style={{ color: "#3D2B1F" }}>
              {slide.date}
            </p>

            {/* title */}
            <h2
              className="font-[family-name:var(--font-display)] italic font-light text-center leading-tight mb-5 sm:mb-7"
              style={{
                fontSize: "clamp(1.6rem, 6vw, 3rem)",
                color: slide.special === "finale" ? "#5C8870" : "#3D2B1F",
                letterSpacing: "-0.01em",
              }}
            >
              {slide.title}
            </h2>

            {/* ── photos ── */}
            {slide.special === "finale" ? (
              /* finale: decorative diamond instead of photo */
              <div className="flex flex-col items-center gap-3 my-4 sm:my-6">
                <svg style={{ color: "#9CAFAA" }} className="w-12 h-12 sm:w-16 sm:h-16" viewBox="0 0 48 48" fill="none">
                  <path d="M24 4 L28 18 L44 24 L28 30 L24 44 L20 30 L4 24 L20 18 Z"
                    stroke="currentColor" strokeWidth="1.2" fill="rgba(156,175,170,0.15)" />
                  <circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.4" />
                </svg>
                <div className="h-px w-16 sm:w-24" style={{ background: `${slide.accentDark}30` }} />
              </div>

            ) : slide.special === "proposal" ? (
              /* proposal: large image + ring icon above */
              <div className="flex flex-col items-center gap-3 mb-5">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none"
                  stroke={`${slide.accentDark}88`} strokeWidth="1.1">
                  <circle cx="12" cy="14" r="7" />
                  <path d="M9 14 Q12 10 15 14" />
                  <path d="M9 7 L7 4 M15 7 L17 4 M9 7 L15 7" />
                </svg>
                <Photo
                  src={slide.photos[0]} alt={slide.alts[0]}
                  rotate={0.5}
                  extraStyle={{ width: 400, height: 400 }}
                />
              </div>

            ) : isMulti ? (
              /* multi-photo hand — swipeable */
              <PhotoHand
                photos={slide.photos}
                alts={slide.alts}
                accentDark={slide.accentDark}
              />

            ) : (
              /* single photo */
              <div className="mb-4 sm:mb-6">
                <Photo
                  src={slide.photos[0]} alt={slide.alts[0]}
                  rotate={-1 + (current % 3) * 0.8}
                  extraStyle={{ width: 400, height: 400 }}
                />
              </div>
            )}

            {/* body text */}
            <p
              className="font-[family-name:var(--font-serif)] italic font-light text-center leading-relaxed max-w-[280px] sm:max-w-sm"
              style={{
                fontSize: "clamp(0.95rem, 3.5vw, 1.15rem)",
                color: "#3D2B1F",
              }}
            >
              {slide.text}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── swipe hint (fades once interacted) ── */}
      <AnimatePresence>
        {!hasInteracted && (
          <motion.div
            className="relative z-10 flex flex-col items-center gap-1.5 pb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1.0, duration: 0.6 } }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            {/* animated hand SVG */}
            <motion.div
              animate={{ x: [0, -28, 0, -28, 0] }}
              transition={{ delay: 1.6, duration: 1.8, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeInOut", repeat: Infinity, repeatDelay: 2.5 }}
            >
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* palm */}
                <path d="M19 30 C13 30 9 25 9 19 L9 12 C9 10.9 9.9 10 11 10 C12.1 10 13 10.9 13 12 L13 8 C13 6.9 13.9 6 15 6 C16.1 6 17 6.9 17 8 L17 7 C17 5.9 17.9 5 19 5 C20.1 5 21 5.9 21 7 L21 8 C21 6.9 21.9 6 23 6 C24.1 6 25 6.9 25 8 L25 19 C25 25 21 30 19 30 Z"
                  fill="#D6A99D" stroke="#B8826C" strokeWidth="1" strokeLinejoin="round"/>
                {/* finger lines */}
                <line x1="13" y1="12" x2="13" y2="18" stroke="#B8826C" strokeWidth="0.8" strokeLinecap="round"/>
                <line x1="17" y1="8"  x2="17" y2="18" stroke="#B8826C" strokeWidth="0.8" strokeLinecap="round"/>
                <line x1="21" y1="7"  x2="21" y2="18" stroke="#B8826C" strokeWidth="0.8" strokeLinecap="round"/>
                <line x1="25" y1="8"  x2="25" y2="18" stroke="#B8826C" strokeWidth="0.8" strokeLinecap="round"/>
                {/* motion trail */}
                <path d="M7 18 L3 18" stroke="#9CAFAA" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
                <path d="M6 15 L2 14" stroke="#9CAFAA" strokeWidth="0.8" strokeLinecap="round" opacity="0.3"/>
                <path d="M6 21 L2 22" stroke="#9CAFAA" strokeWidth="0.8" strokeLinecap="round" opacity="0.3"/>
              </svg>
            </motion.div>
            <span className="font-sans font-light text-[10px] tracking-[0.35em] uppercase" style={{ color: "#3D2B1F", opacity: 0.65 }}>
              {t.swipeToExplore}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── dots + mobile arrows row ── */}
      <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-4 py-4 pb-5">
        {/* prev arrow — always visible */}
        <button
          onClick={() => { goPrev(); setHasInteracted(true); }}
          disabled={current === 0}
          aria-label={t.prev}
          className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed"
          style={{
            background: "rgba(255,255,255,0.65)",
            borderColor: `${slide.accentDark}35`,
            backdropFilter: "blur(8px)",
          }}
        >
          <ChevronLeft className="w-5 h-5" style={{ color: slide.accentDark }} />
        </button>

        {/* dots */}
        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); setHasInteracted(true); }}
              aria-label={`Go to slide ${i + 1}`}
              className="cursor-pointer transition-all duration-300 rounded-full"
              style={{
                width: i === current ? 18 : 6,
                height: 6,
                background: i === current ? slide.accentDark : `${slide.accentDark}35`,
              }}
            />
          ))}
        </div>

        {/* next arrow — always visible */}
        <button
          onClick={() => { goNext(); setHasInteracted(true); }}
          disabled={current === total - 1}
          aria-label={t.next}
          className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed"
          style={{
            background: "rgba(255,255,255,0.65)",
            borderColor: `${slide.accentDark}35`,
            backdropFilter: "blur(8px)",
          }}
        >
          <ChevronRight className="w-5 h-5" style={{ color: slide.accentDark }} />
        </button>
      </div>

      {/* ── large side arrows — desktop only ── */}
      <button
        onClick={() => { goPrev(); setHasInteracted(true); }}
        disabled={current === 0}
        aria-label="Previous"
        className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 z-20
                   w-12 h-12 items-center justify-center rounded-full
                   border bg-white/60 backdrop-blur-sm
                   transition-all duration-200 cursor-pointer
                   hover:bg-white/90 disabled:opacity-20 disabled:cursor-not-allowed"
        style={{ borderColor: `${slide.accentDark}30` }}
      >
        <ChevronLeft className="w-6 h-6" style={{ color: slide.accentDark }} />
      </button>
      <button
        onClick={() => { goNext(); setHasInteracted(true); }}
        disabled={current === total - 1}
        aria-label="Next"
        className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 z-20
                   w-12 h-12 items-center justify-center rounded-full
                   border bg-white/60 backdrop-blur-sm
                   transition-all duration-200 cursor-pointer
                   hover:bg-white/90 disabled:opacity-20 disabled:cursor-not-allowed"
        style={{ borderColor: `${slide.accentDark}30` }}
      >
        <ChevronRight className="w-6 h-6" style={{ color: slide.accentDark }} />
      </button>
    </section>
  );
}

/* ── Photo hand — swipeable card hand ── */
function PhotoHand({
  photos, alts, accentDark,
}: {
  photos: string[]; alts: string[]; accentDark: string;
}) {
  const [active, setActive] = React.useState(0);
  const [photoDir, setPhotoDir] = React.useState(0);
  const total = photos.length;

  const advance = React.useCallback((dir: 1 | -1) => {
    setPhotoDir(dir);
    setActive((a) => Math.max(0, Math.min(total - 1, a + dir)));
  }, [total]);

  const handlePhotoDrag = React.useCallback((_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.x < -40 || velocity.x < -300) advance(1);
    else if (offset.x > 40 || velocity.x > 300) advance(-1);
  }, [advance]);

  return (
    <div
      className="flex flex-col items-center gap-3 mb-4 sm:mb-5 w-full"
      // stop photo swipes from bubbling to the parent timeline swiper
      onPointerDownCapture={(e) => e.stopPropagation()}
    >
      {/* card hand area */}
      <div
        className="relative flex items-center justify-center select-none"
        style={{ height: 440, width: "100%" }}
      >
        {photos.map((src, i) => {
          const isActive = i === active;
          const rot = handRotation(i, active, total);
          const tx  = handTranslateX(i, active);
          const ty  = handTranslateY(i, active);
          const zIdx = isActive ? total + 1 : total - Math.abs(i - active);

          return (
            <motion.div
              key={i}
              className="absolute cursor-pointer"
              style={{ zIndex: zIdx, originY: 1.15 }}
              animate={{
                rotate: rot,
                x:      tx,
                y:      ty,
                scale:  isActive ? 1 : 0.86,
                filter: isActive ? "brightness(1)" : "brightness(0.78)",
              }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              onClick={() => {
                if (!isActive) {
                  setPhotoDir(i > active ? 1 : -1);
                  setActive(i);
                }
              }}
              drag={isActive ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              dragMomentum={false}
              onDragEnd={handlePhotoDrag}
              whileDrag={{ scale: 0.95 }}
            >
              <Photo
                src={src} alt={alts[i]}
                extraStyle={{ width: 400, height: 400 }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* photo dots + arrows */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => advance(-1)}
          disabled={active === 0}
          aria-label="Previous photo"
          className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-full transition-opacity disabled:opacity-20"
          style={{ background: `${accentDark}18` }}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"
            stroke={accentDark} strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="flex items-center gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => { setPhotoDir(i > active ? 1 : -1); setActive(i); }}
              aria-label={`Photo ${i + 1}`}
              className="cursor-pointer rounded-full transition-all duration-300"
              style={{
                width:  i === active ? 14 : 5,
                height: 5,
                background: i === active ? accentDark : `${accentDark}38`,
              }}
            />
          ))}
        </div>

        <button
          onClick={() => advance(1)}
          disabled={active === total - 1}
          aria-label="Next photo"
          className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-full transition-opacity disabled:opacity-20"
          style={{ background: `${accentDark}18` }}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"
            stroke={accentDark} strokeWidth="2" strokeLinecap="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ── Photo helper — no frame, just image with radius + shadow ── */
function Photo({
  src, alt, rotate = 0, className = "", extraStyle,
}: {
  src: string; alt: string; rotate?: number; className?: string;
  extraStyle?: React.CSSProperties;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src} alt={alt}
      className={`object-cover block shrink-0 ${className}`}
      style={{
        borderRadius: 5,
        boxShadow: "0 20px 56px rgba(0,0,0,0.20), 0 6px 18px rgba(0,0,0,0.10)",
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        transition: "box-shadow 0.3s ease",
        ...extraStyle,
      }}
    />
  );
}
