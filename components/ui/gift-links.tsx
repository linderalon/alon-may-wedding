"use client";

import * as React from "react";
import { motion } from "framer-motion";

export function GiftLinks() {
  return (
    <section
      id="gift"
      aria-label="Gift links"
      className="relative py-14 sm:py-20 px-4 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #F8F2EC 0%, #FDFAF4 100%)" }}
    >
      {/* subtle watercolour accent */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/29.png" alt="" aria-hidden
        className="absolute -bottom-4 left-0 w-[110px] sm:w-[160px] pointer-events-none select-none opacity-20 -rotate-12 -translate-x-1/4" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/27.png" alt="" aria-hidden
        className="absolute top-2 right-0 w-[80px] sm:w-[110px] pointer-events-none select-none opacity-20 rotate-12 translate-x-1/4" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto">

        {/* eyebrow */}
        <p className="font-sans font-light text-[9px] tracking-[0.55em] uppercase text-[#3D2B1F]/60 mb-3">
          A little something
        </p>

        {/* heading */}
        <h2
          className="font-[family-name:var(--font-display)] italic font-light text-2xl sm:text-3xl text-[#3D2B1F] mb-2"
          style={{ letterSpacing: "-0.01em" }}
        >
          Prefer Bit / Paybox?
        </h2>
        <p className="font-[family-name:var(--font-serif)] italic font-light text-base sm:text-lg text-[#3D2B1F]/70 mb-8 sm:mb-10">
          We got you!
        </p>

        {/* CTA buttons */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">

          {/* Bit */}
          <motion.a
            href="https://www.bitpay.co.il/app/me/F4AFEE85-5184-1B2E-2EA1-08EF96D72A008806"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(255,59,48,0.18)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 22 }}
            className="inline-flex items-center gap-2.5 min-h-[52px] px-7 sm:px-9 rounded-full font-sans font-light text-[13px] tracking-[0.14em] cursor-pointer select-none"
            style={{
              background: "#fff",
              color: "#1A1A1A",
              border: "1.5px solid rgba(0,0,0,0.10)",
              boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
            }}
          >
            {/* Bit logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://upload.wikimedia.org/wikipedia/he/thumb/e/eb/Bit_logo_2024.svg/1280px-Bit_logo_2024.svg.png"
              alt="Bit"
              className="h-5 w-auto object-contain"
            />
            <span>Bit</span>
          </motion.a>

          {/* Paybox */}
          <motion.a
            href="#"  /* replace with real Paybox link */
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(0,122,255,0.18)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 22 }}
            className="inline-flex items-center gap-2.5 min-h-[52px] px-7 sm:px-9 rounded-full font-sans font-light text-[13px] tracking-[0.14em] cursor-pointer select-none"
            style={{
              background: "#fff",
              color: "#1A1A1A",
              border: "1.5px solid rgba(0,0,0,0.10)",
              boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
            }}
          >
            {/* Paybox logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://yt3.googleusercontent.com/ytc/AIdro_lhy54u_HxaHGFBzqnJbd6oh7cVzfpbDdxBsCFn4ohvlss=s900-c-k-c0x00ffffff-no-rj"
              alt="Paybox"
              className="h-5 w-5 object-contain rounded-full"
            />
            <span>Paybox</span>
          </motion.a>
        </div>

        {/* disclaimer */}
        <p className="font-[family-name:var(--font-serif)] italic font-light text-xs sm:text-sm text-[#3D2B1F]/45 mt-8 max-w-xs sm:max-w-sm leading-relaxed">
          * We&apos;re sad if you couldn&apos;t make it to our wedding! If you still like it, links are valid to everyone! ;)
        </p>

      </div>
    </section>
  );
}
