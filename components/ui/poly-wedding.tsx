"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── candidates ── */
const CANDIDATES = [
  { id: "may",       label: "May",          emoji: "👰", color: "#D6A99D", dark: "#B8826C" },
  { id: "alon",      label: "Alon",         emoji: "🤵", color: "#9CAFAA", dark: "#5C8870" },
  { id: "alons-mom", label: "Alon's Mom",   emoji: "👩", color: "#C4A882", dark: "#8C6C42" },
  { id: "mays-mom",  label: "May's Mom",    emoji: "👩", color: "#B8A0C8", dark: "#7858A0" },
  { id: "no-one",    label: "No one",       emoji: "😤", color: "#A8B8C0", dark: "#607880" },
] as const;

type CandidateId = typeof CANDIDATES[number]["id"];
type Votes = Record<CandidateId, number>;

const STORAGE_KEY = "poly-wedding-vote";

function totalVotes(v: Votes) {
  return Object.values(v).reduce((s, n) => s + n, 0);
}
function pct(v: Votes, id: CandidateId) {
  const t = totalVotes(v);
  return t === 0 ? 20 : Math.round((v[id] / t) * 100);
}

export function PolyWedding() {
  const [votes, setVotes] = React.useState<Votes | null>(null);
  const [voted, setVoted] = React.useState<CandidateId | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [justVoted, setJustVoted] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);

  /* load votes + check localStorage */
  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as CandidateId | null;
    if (stored) setVoted(stored);

    fetch("/api/votes")
      .then((r) => r.json())
      .then((data: Votes) => {
        setVotes(data);
        setTotalCount(totalVotes(data));
      });
  }, []);

  const castVote = async (id: CandidateId) => {
    if (voted || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate: id }),
      });
      const updated: Votes = await res.json();
      setVotes(updated);
      setTotalCount(totalVotes(updated));
      setVoted(id);
      setJustVoted(true);
      localStorage.setItem(STORAGE_KEY, id);
      setTimeout(() => setJustVoted(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  const candidate = (id: CandidateId) =>
    CANDIDATES.find((c) => c.id === id)!;

  const sortedCandidates = votes
    ? [...CANDIDATES].sort((a, b) => (votes[b.id] ?? 0) - (votes[a.id] ?? 0))
    : CANDIDATES;

  return (
    <section
      id="poly-wedding"
      aria-label="Poly Wedding — who cries first?"
      className="relative py-16 sm:py-24 px-4 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FDFAF4 0%, #F5EDE8 100%)" }}
    >
      {/* watercolour accent */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/6.png" alt="" aria-hidden
        className="absolute bottom-0 left-0 w-[120px] sm:w-[180px] pointer-events-none select-none opacity-20 -rotate-12" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/3.png" alt="" aria-hidden
        className="absolute top-6 right-0 w-[100px] sm:w-[150px] pointer-events-none select-none opacity-20 rotate-12" />

      {/* ── header ── */}
      <div className="relative z-10 flex flex-col items-center text-center mb-10 sm:mb-14">
        <p className="font-sans font-light text-[9px] tracking-[0.55em] uppercase text-[#3D2B1F] mb-3">
          The real bet
        </p>
        <h2
          className="font-[family-name:var(--font-display)] italic font-light text-3xl sm:text-5xl text-[#3D2B1F]"
          style={{ letterSpacing: "-0.01em" }}
        >
          Poly-Wedding
        </h2>
        <p className="font-[family-name:var(--font-serif)] italic font-light text-base sm:text-lg text-[#3D2B1F] mt-3 max-w-xs sm:max-w-sm leading-relaxed">
          Who will cry first at the wedding? Cast your vote and watch the odds shift.
        </p>
        <div className="flex items-center gap-4 mt-4" aria-hidden>
          <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#D6A99D]/40" />
          <svg className="w-1.5 h-1.5" viewBox="0 0 24 24" style={{ fill: "rgba(214,169,157,.5)" }}>
            <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
          </svg>
          <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#D6A99D]/40" />
        </div>
      </div>

      {/* ── market ── */}
      <div className="relative z-10 max-w-lg mx-auto flex flex-col gap-3 sm:gap-4">
        {sortedCandidates.map((c) => {
          const isVoted    = voted === c.id;
          const hasVoted   = voted !== null;
          const percentage = votes ? pct(votes, c.id) : 20;
          const voteCount  = votes ? votes[c.id] : 0;

          return (
            <motion.div
              key={c.id}
              layout
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <button
                onClick={() => castVote(c.id)}
                disabled={hasVoted || loading}
                aria-label={`Vote for ${c.label}`}
                className="w-full cursor-pointer disabled:cursor-default"
              >
                <div
                  className="relative rounded-2xl overflow-hidden border transition-all duration-200"
                  style={{
                    background: isVoted
                      ? `${c.color}22`
                      : "rgba(255,255,255,0.65)",
                    borderColor: isVoted ? c.dark : "rgba(92,74,58,0.10)",
                    boxShadow: isVoted
                      ? `0 4px 24px ${c.color}40`
                      : "0 2px 12px rgba(92,74,58,0.06)",
                  }}
                >
                  {/* probability fill bar */}
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-2xl"
                    style={{ background: `${c.color}28` }}
                    initial={{ width: "20%" }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />

                  {/* row content */}
                  <div className="relative flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 sm:py-4">
                    {/* rank dot */}
                    <span className="font-sans text-[10px] text-[#3D2B1F]/60 w-3 tabular-nums">
                      {sortedCandidates.indexOf(c) + 1}
                    </span>

                    {/* label */}
                    <span
                      className="font-[family-name:var(--font-display)] italic text-base sm:text-lg flex-1 text-left"
                      style={{ color: hasVoted ? "#3D2B1F" : "#3D2B1F" }}
                    >
                      {c.label}
                    </span>

                    {/* vote count */}
                    {hasVoted && (
                      <span className="font-sans text-[10px] text-[#3D2B1F] tabular-nums">
                        {voteCount} vote{voteCount !== 1 ? "s" : ""}
                      </span>
                    )}

                    {/* percentage */}
                    <motion.span
                      className="font-sans font-light tabular-nums min-w-[44px] text-right text-sm sm:text-base"
                      style={{ color: isVoted ? c.dark : "#3D2B1F" }}
                      animate={{ opacity: 1 }}
                    >
                      {votes ? `${percentage}%` : "—"}
                    </motion.span>

                    {/* voted checkmark */}
                    <AnimatePresence>
                      {isVoted && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          className="ml-1"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 20 20" fill={c.dark}>
                            <path fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd" />
                          </svg>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* ── total votes + state messages ── */}
      <div className="relative z-10 flex flex-col items-center mt-8 gap-2">
        {votes && (
          <p className="font-sans font-light text-[10px] tracking-[0.3em] uppercase text-[#3D2B1F]">
            {totalCount} vote{totalCount !== 1 ? "s" : ""} cast
          </p>
        )}

        <AnimatePresence>
          {justVoted && voted && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="font-[family-name:var(--font-serif)] italic text-sm text-[#3D2B1F]"
            >
              You voted for {candidate(voted).label} — bold choice.
            </motion.p>
          )}
        </AnimatePresence>

        {voted && !justVoted && (
          <p className="font-sans font-light text-[9px] tracking-[0.3em] uppercase text-[#3D2B1F]/70">
            You already voted · results update live
          </p>
        )}

        {!voted && votes && totalCount === 0 && (
          <p className="font-[family-name:var(--font-serif)] italic text-sm text-[#3D2B1F]">
            Be the first to vote.
          </p>
        )}
      </div>
    </section>
  );
}
