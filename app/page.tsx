"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TimelineSwiper } from "@/components/ui/timeline-swiper";
import { PolyWedding } from "@/components/ui/poly-wedding";
import { ConfessionWall } from "@/components/ui/confession-wall";
import { FallingLeaves } from "@/components/ui/falling-leaves";
import { LanguageLobby, useLang, type Lang } from "@/components/ui/language-lobby";
import { useLangContext } from "@/lib/lang-context";
import { GiftLinks } from "@/components/ui/gift-links";

export default function Home() {
  const { lang, setLang } = useLang();
  const { t, dir } = useLangContext();
  // null = still hydrating, show nothing; "en"/"he" = inside app
  const [entered, setEntered] = useState(false);

  // if lang already stored, skip lobby on return visits
  useEffect(() => {
    const stored = localStorage.getItem("wedding-lang") as Lang | null;
    if (stored === "en" || stored === "he") setEntered(true);
  }, []);

  useEffect(() => {
    const nav = document.getElementById("main-nav");
    const onScroll = () => nav?.classList.toggle("nav-scrolled", window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleEnter = (l: Lang) => {
    setLang(l);
    setEntered(true);
  };

  return (
    <>
      {/* ── lobby overlay ── */}
      <AnimatePresence>
        {!entered && (
          <LanguageLobby onEnter={handleEnter} />
        )}
      </AnimatePresence>

      {/* ── main app — fades in after lobby exits ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: entered ? 1 : 0 }}
        transition={{ duration: 0.6, delay: entered ? 0.1 : 0 }}
      >
      <style>{`
        @keyframes fade-up   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float     { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-8px) rotate(.5deg)} 66%{transform:translateY(-3px) rotate(-.4deg)} }
        @keyframes float-slow{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes float-med { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-6px) rotate(.3deg)} }
        .anim-fade-up  { animation:fade-up 1s .15s ease both }
        .anim-fade-up2 { animation:fade-up 1s .35s ease both }
        .anim-fade-up3 { animation:fade-up 1s .55s ease both }
        .anim-fade-up4 { animation:fade-up 1s .75s ease both }
        .anim-fade-up5 { animation:fade-up 1s .95s ease both }
        .anim-float    { animation:float      9s ease-in-out infinite }
        .anim-float-sl { animation:float-slow 12s ease-in-out infinite }
        .anim-float-md { animation:float-med  10s ease-in-out infinite }
        .name-wash {
          background:linear-gradient(145deg,#C4877A 0%,#D6A99D 28%,#C8937F 52%,#B8826C 75%,#D0A090 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          filter:drop-shadow(0 2px 32px rgba(214,169,157,.30));
        }
        .nav-scrolled {
          background:rgba(253,250,244,.94);
          backdrop-filter:blur(16px);
          border-bottom:1px solid rgba(214,169,157,.15);
        }
        .section-divider { height:1px; background:linear-gradient(90deg,transparent,rgba(214,169,157,.3) 30%,rgba(156,175,170,.3) 70%,transparent); }
        @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
      `}</style>

      {/* ── NAV ── */}
      <nav id="main-nav" aria-label="Main navigation" dir={dir}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-5 sm:gap-10 md:gap-16 px-4 py-4 sm:py-6 transition-all duration-300">
        {([
          { key: "ourStory",       href: "#our-story"       },
          { key: "polyWedding",    href: "#poly-wedding"    },
          { key: "confessionWall", href: "#confession-wall" },
        ] as const).map(({ key, href }) => (
          <a key={key} href={href}
            className="font-sans font-light text-[9px] sm:text-[11px] tracking-[0.22em] sm:tracking-[0.26em] uppercase text-[#3D2B1F] hover:text-[#3D2B1F]/60 transition-colors duration-200 cursor-pointer whitespace-nowrap min-h-[44px] flex items-center">
            {t[key]}
          </a>
        ))}
      </nav>

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section id="hero" aria-label="Wedding hero"
        className="paper-texture relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(160deg,#FDFAF4 0%,#F9EFE7 45%,#EFF0EC 100%)" }}>

        {/* ── LAYER 1: pink watercolour washes left & right ── */}
        <Image src="/31.png" alt="" aria-hidden width={700} height={600}
          className="absolute top-[5%] left-0 w-[45vw] max-w-[460px] pointer-events-none select-none opacity-55 -translate-x-[10%]" />
        <Image src="/30.png" alt="" aria-hidden width={600} height={520}
          className="absolute top-[10%] right-0 w-[38vw] max-w-[400px] pointer-events-none select-none opacity-45 translate-x-[10%]" />

        {/* ── LAYER 2: weeping willow — massive centred background ── */}
        <Image src="/33.png" alt="" aria-hidden width={900} height={820}
          className="absolute top-1/2 left-1/2 pointer-events-none select-none opacity-45"
          style={{ width:"min(96vw,900px)", transform:"translate(-50%,-54%)" }} />

        {/* ── LAYER 3: falling leaves canvas animation ── */}
        <FallingLeaves />


        {/* ── LAYER 5: hero content ── */}
        <div className="relative z-10 flex flex-col items-center text-center px-5 sm:px-10 w-full"
          dir={dir}
          style={{ paddingTop: "max(100px, 16svh)", paddingBottom: "max(80px, 12svh)" }}>

          <p className="font-sans font-light text-[10px] sm:text-xs tracking-[0.55em] uppercase text-[#3D4A2A] mb-3 sm:mb-5 anim-fade-up">
            {t.saveTheDate}
          </p>

          <h1
            className="font-[family-name:var(--font-display)] italic font-light leading-[0.9] anim-fade-up2"
            style={{
              fontSize: "clamp(3.2rem, 14vw, 10rem)",
              letterSpacing: "-0.01em",
              color: "#4A5E35",
              textShadow: "0 2px 32px rgba(74,94,53,0.12)",
            }}
          >
            {t.names}
          </h1>

          <div className="flex items-center gap-3 sm:gap-6 mt-4 sm:mt-7 anim-fade-up3" aria-hidden>
            <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#7A9A6A]/55" />
            <svg className="w-2 h-2 shrink-0" viewBox="0 0 24 24" style={{fill:"rgba(122,154,106,.65)"}}><path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z"/></svg>
            <div className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#7A9A6A]/55" />
          </div>

          <p className="font-[family-name:var(--font-serif)] italic font-light text-lg sm:text-2xl tracking-[0.04em] text-[#4A5E35] mt-3 sm:mt-5 anim-fade-up3">
            {t.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-10 mt-6 sm:mt-10 anim-fade-up4">
            <div className="flex flex-col items-center gap-1">
              <span className="font-sans font-light text-[11px] tracking-[0.38em] uppercase text-[#4A5E35]/65">{t.dateLabel}</span>
              <span className="font-[family-name:var(--font-serif)] text-[1.35rem] sm:text-2xl text-[#3D4A2A]">{t.dateValue}</span>
            </div>
            <div className="hidden sm:block w-px h-10 bg-[#4A5E35]/18" aria-hidden />
            <div className="flex flex-col items-center gap-1">
              <span className="font-sans font-light text-[11px] tracking-[0.38em] uppercase text-[#4A5E35]/65">{t.venueLabel}</span>
              <span className="font-[family-name:var(--font-serif)] text-[1.35rem] sm:text-2xl text-[#3D4A2A]">{t.venueValue}</span>
            </div>
          </div>

          <div className="mt-7 sm:mt-10 anim-fade-up5">
            <a href="#our-story"
              className="cursor-pointer inline-flex items-center justify-center min-h-[48px] px-10 rounded-full font-sans font-light text-[11px] tracking-[0.24em] uppercase text-[#4A5E35] border border-[#4A5E35]/35 transition-all duration-200 hover:border-[#4A5E35]/65 hover:bg-white/50 active:scale-[0.97] whitespace-nowrap">
              {t.ourStory}
            </a>
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 anim-fade-up5 z-10" aria-hidden>
          <div className="w-px h-8 bg-gradient-to-b from-[#4A5E35]/0 to-[#4A5E35]/25" />
          <span className="font-sans font-light text-[9px] tracking-[0.40em] uppercase text-[#4A5E35]/60 mt-1">{t.scroll}</span>
        </div>
      </section>

      {/* ── divider ── */}
      <div className="relative overflow-hidden">
        <div className="section-divider mx-8 sm:mx-16 my-0" />
        {/* silver dollar eucalyptus straddling the divider */}
        <Image src="/27.png" alt="" aria-hidden width={140} height={120}
          className="absolute left-1/2 -translate-x-1/2 -top-8 w-[70px] sm:w-[100px] pointer-events-none select-none opacity-50" />
      </div>

      {/* ═══════════════════════════════════════
          OUR STORY
      ═══════════════════════════════════════ */}
      <TimelineSwiper />

      {/* ── divider ── */}
      <div className="relative py-6 overflow-hidden">
        <div className="section-divider mx-8 sm:mx-16" />
        <Image src="/23.png" alt="" aria-hidden width={160} height={280}
          className="absolute right-8 sm:right-16 -top-12 w-[55px] sm:w-[80px] pointer-events-none select-none opacity-40 rotate-[10deg]" />
        <Image src="/24.png" alt="" aria-hidden width={120} height={200}
          className="absolute left-8 sm:left-16 -top-10 w-[45px] sm:w-[65px] pointer-events-none select-none opacity-35 -rotate-[8deg]" />
      </div>

      {/* ═══════════════════════════════════════
          POLY-WEDDING
      ═══════════════════════════════════════ */}
      <div className="relative overflow-hidden">
        {/* fern — far left mid */}
        <Image src="/28.png" alt="" aria-hidden width={160} height={130}
          className="absolute top-12 left-0 w-[80px] sm:w-[120px] pointer-events-none select-none opacity-30 -translate-x-1/3 rotate-[-15deg]" />
        {/* round eucalyptus — right side */}
        <Image src="/25.png" alt="" aria-hidden width={240} height={260}
          className="absolute bottom-10 right-0 w-[110px] sm:w-[170px] pointer-events-none select-none opacity-28 translate-x-1/3" />
        {/* watercolor wash behind section */}
        <Image src="/30.png" alt="" aria-hidden width={400} height={340}
          className="absolute top-0 left-0 w-full max-w-[500px] pointer-events-none select-none opacity-[0.10]" />
        <PolyWedding />
      </div>

      {/* ── divider ── */}
      <div className="relative py-6 overflow-hidden">
        <div className="section-divider mx-8 sm:mx-16" />
        <Image src="/27.png" alt="" aria-hidden width={130} height={110}
          className="absolute left-1/2 -translate-x-1/2 -top-7 w-[60px] sm:w-[90px] pointer-events-none select-none opacity-45" />
      </div>

      {/* ═══════════════════════════════════════
          CONFESSION WALL
      ═══════════════════════════════════════ */}
      <div className="relative overflow-hidden">
        {/* tall sage branch — left spine */}
        <Image src="/23.png" alt="" aria-hidden width={180} height={320}
          className="absolute top-8 left-0 w-[70px] sm:w-[110px] pointer-events-none select-none opacity-35 -translate-x-1/4 anim-float-sl"
          style={{ animationDelay:"1s" }} />
        {/* blue buds — right upper corner */}
        <Image src="/24.png" alt="" aria-hidden width={130} height={210}
          className="hidden sm:block absolute top-0 right-8 w-[65px] sm:w-[90px] pointer-events-none select-none opacity-40 rotate-[15deg]" />
        <ConfessionWall />
      </div>

      {/* ── GIFT LINKS ── */}
      <GiftLinks />

      {/* ── footer ── */}
      <footer className="relative py-10 sm:py-14 overflow-hidden"
        style={{ background:"linear-gradient(180deg,transparent,rgba(214,169,157,.08))" }}>
        {/* weeping willow left */}
        <Image src="/33.png" alt="" aria-hidden width={200} height={180}
          className="absolute bottom-0 left-0 w-[100px] sm:w-[160px] pointer-events-none select-none opacity-30 -translate-x-[15%]" />
        {/* round tree right */}
        <Image src="/32.png" alt="" aria-hidden width={180} height={170}
          className="absolute bottom-0 right-0 w-[90px] sm:w-[140px] pointer-events-none select-none opacity-25 translate-x-[15%]" />
        {/* cosmos trio small */}
        <Image src="/3.png" alt="" aria-hidden width={120} height={120}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[50px] pointer-events-none select-none opacity-30" />

        <div className="relative z-10 flex flex-col items-center gap-3">
          <p className="font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl text-[#3D2B1F]"
            style={{ letterSpacing:"-0.01em" }}>
            Alon &amp; May
          </p>
          <p className="font-sans font-light text-[9px] tracking-[0.45em] uppercase text-[#3D2B1F]/60">
            October 14th, 2026 · Tzel HaHoresh
          </p>
          <div className="flex items-center gap-3 mt-1" aria-hidden>
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#D6A99D]/40" />
            <svg className="w-1 h-1" viewBox="0 0 24 24" style={{fill:"rgba(214,169,157,.5)"}}><path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z"/></svg>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#D6A99D]/40" />
          </div>
        </div>
      </footer>
      </motion.div>
    </>
  );
}

