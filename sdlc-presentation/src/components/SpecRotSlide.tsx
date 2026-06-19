import React from 'react';
import { motion } from 'framer-motion';
import {
  FileWarning, GitCommit, TrendingDown, Skull,
  ShieldCheck, Lock, FileCheck, RefreshCw, GitMerge,
} from 'lucide-react';

// ── Icon registry (literal imports only) ───────────────────────────────────────
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  FileWarning, GitCommit, TrendingDown, Skull,
  ShieldCheck, Lock, FileCheck, RefreshCw, GitMerge,
};

// ── Types ───────────────────────────────────────────────────────────────────────
interface DecayStage {
  commits: string;      // e.g. "+12 commits"
  label: string;        // what happens to the spec at this point
  trust: number;        // 0–100, drains as it rots
}

interface CureGate {
  icon: string;
  title: string;
  detail: string;
}

interface SpecRotSlideData {
  type: string;
  scrollable: boolean;
  kicker: string;
  enemyLabel: string;          // "SPEC ROT"
  enemySub: string;            // a.k.a. doc drift...
  definition: string;          // one-line definition
  // Beat 2 — the decay
  decayTitle: string;
  specTrackLabel: string;      // "spec.md"
  codeTrackLabel: string;      // "the code"
  stages: DecayStage[];
  staleStamp: string;          // "last updated · 47 commits ago"
  verdict: string;             // "A rotted spec is worse than no spec."
  verdictSub: string;          // it actively misleads...
  // Beat 3 — the cure
  cureKicker: string;
  cureTitle: string;
  gates: CureGate[];
  lockedLabel: string;         // "spec ⟷ code · locked"
  payoff: string;              // the one-line turn
}

interface SpecRotSlideProps {
  data: SpecRotSlideData;
  lang: 'en' | 'he';
}

export default function SpecRotSlide({ data, lang }: SpecRotSlideProps) {
  const isRTL = lang === 'he';

  return (
    <div className="w-full max-w-5xl mx-auto">

      {/* ── BEAT 1 — NAME THE ENEMY ───────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col items-center justify-center py-24 px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] sm:text-xs tracking-[0.4em] text-amber-400/70 uppercase font-mono mb-8"
        >
          {data.kicker}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <FileWarning size={48} className="text-amber-400/80" />
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight bg-gradient-to-b from-amber-300 via-orange-400 to-red-500 bg-clip-text text-transparent leading-none">
            {data.enemyLabel}
          </h2>
          <span dir="ltr" className="text-xs sm:text-sm font-mono text-red-400/50 tracking-wide">
            {data.enemySub}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className={`mt-10 max-w-2xl text-lg sm:text-xl text-white/70 leading-relaxed ${isRTL ? 'text-center' : 'text-center'}`}
        >
          {data.definition}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9 }}
          className="flex flex-col items-center gap-1.5 text-white/30 mt-16"
        >
          <span className="text-xs">{isRTL ? 'גלול לראות את הריקבון' : 'Scroll to watch it rot'}</span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="text-xl"
          >↓</motion.div>
        </motion.div>
      </section>

      {/* ── BEAT 2 — THE DECAY (amber→red, drift) ─────────────────────────────── */}
      <section className="min-h-screen flex flex-col justify-center py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className={`flex items-center gap-4 mb-12 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <TrendingDown size={22} className="text-red-400/70 shrink-0" />
          <h3 className={`text-2xl sm:text-3xl font-black text-white leading-tight ${isRTL ? 'text-right' : ''}`}>
            {data.decayTitle}
          </h3>
          <div className="h-px flex-1 border-t border-red-500/20" />
        </motion.div>

        {/* Divergence diagram — always LTR (time + drift reads left→right) */}
        <div dir="ltr" className="relative rounded-2xl border border-red-500/15 bg-red-950/10 px-5 sm:px-8 py-8">

          {/* Stale stamp */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-slate-900 border border-amber-500/40 text-[10px] font-mono tracking-wide text-amber-300/80"
          >
            {data.staleStamp}
          </motion.div>

          {/* Track labels */}
          <div className="flex items-center justify-between mb-3 font-mono text-xs">
            <span className="text-amber-300/70">{data.specTrackLabel}</span>
            <span className="text-cyan-300/50">{data.codeTrackLabel}</span>
          </div>

          {/* The two tracks: code stays steady, spec drifts down/away */}
          <div className="relative h-44">
            {/* code track — steady baseline */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="absolute left-0 right-0 top-6 h-0.5 bg-cyan-400/40 origin-left"
            />
            {/* spec track — starts fused at code, decays away into amber→red */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.9, ease: 'easeInOut' }}
              className="absolute left-0 right-0 top-6 h-0.5 origin-left bg-gradient-to-r from-cyan-400/40 via-amber-400/60 to-red-500/70"
              style={{ transform: 'rotate(8deg)', transformOrigin: 'left center' }}
            />

            {/* widening drift gap fill */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute left-1/3 right-0 top-7 h-24 bg-gradient-to-b from-red-500/15 to-transparent"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 0)' }}
            />

            {/* stage markers along the diverging spec track */}
            <div className="absolute left-0 right-0 top-16 flex items-stretch justify-between gap-2">
              {data.stages.map((stage, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.18, duration: 0.4 }}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <GitCommit size={14} className="text-amber-400/60" />
                  <span className="text-[10px] font-mono text-amber-300/60">{stage.commits}</span>
                  <span className="text-[11px] text-center text-white/55 leading-tight max-w-[8rem]">
                    {stage.label}
                  </span>
                  {/* draining trust meter */}
                  <div className="w-14 h-1 rounded-full bg-slate-700/60 overflow-hidden mt-1">
                    <motion.div
                      initial={{ width: '100%' }}
                      whileInView={{ width: `${stage.trust}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7 + i * 0.18, duration: 0.6 }}
                      className={
                        stage.trust > 60 ? 'h-full bg-amber-400/70'
                        : stage.trust > 30 ? 'h-full bg-orange-500/70'
                        : 'h-full bg-red-500/80'
                      }
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Verdict — the bottom of the arc */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className={`mt-10 flex items-center gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
        >
          <Skull size={28} className="text-red-500/80 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black text-red-300">{data.verdict}</span>
            <span className="text-sm text-white/45 mt-1">{data.verdictSub}</span>
          </div>
        </motion.div>
      </section>

      {/* ── BEAT 3 — THE CURE (emerald/teal/cyan, re-lock) ────────────────────── */}
      <section className="min-h-screen flex flex-col justify-center py-20 px-6">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] sm:text-xs tracking-[0.4em] text-emerald-400/70 uppercase font-mono mb-4 text-center"
        >
          {data.cureKicker}
        </motion.p>
        <motion.h3
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-black text-center mb-12 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent leading-tight"
        >
          {data.cureTitle}
        </motion.h3>

        {/* The re-lock visual — tracks snapped back together, LTR */}
        <div dir="ltr" className="relative rounded-2xl border border-emerald-500/25 bg-emerald-950/15 px-5 sm:px-8 py-7 mb-10">
          <div className="flex items-center justify-center gap-3">
            <span className="font-mono text-xs text-emerald-300/80">{data.specTrackLabel}</span>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-0.5 w-20 sm:w-32 bg-gradient-to-r from-emerald-400/70 to-cyan-400/70 origin-left"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className="p-2 rounded-full bg-emerald-500/20 border border-emerald-400/40"
            >
              <Lock size={18} className="text-emerald-300" />
            </motion.div>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-0.5 w-20 sm:w-32 bg-gradient-to-r from-cyan-400/70 to-teal-400/70 origin-right"
            />
            <span className="font-mono text-xs text-cyan-300/80">{data.codeTrackLabel}</span>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center text-[11px] font-mono text-emerald-300/60 mt-4 tracking-wide"
          >
            {data.lockedLabel}
          </motion.p>
        </div>

        {/* The gates — what makes rot impossible by construction */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.gates.map((gate, i) => {
            const Icon = iconMap[gate.icon] || ShieldCheck;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.45 }}
                className={`rounded-xl border border-emerald-500/25 bg-emerald-500/8 p-5 flex flex-col gap-2.5 ${isRTL ? 'items-end text-right' : 'items-start'}`}
              >
                <Icon size={22} className="text-emerald-300" />
                <span className="text-sm font-bold text-emerald-200 leading-tight">{gate.title}</span>
                <span className="text-xs text-white/55 leading-snug">{gate.detail}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Payoff — the turn, in solution gradient */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="mt-14 text-center px-2"
        >
          <p className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
            "{data.payoff}"
          </p>
        </motion.div>
      </section>
    </div>
  );
}
