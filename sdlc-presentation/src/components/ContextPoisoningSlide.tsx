import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText, BookOpen, Code2, ClipboardList, MessageSquare,
  FileStack, AlertTriangle, ChevronDown, Database, Zap, Skull,
} from 'lucide-react';

// ── Icon registry (literal imports only) ────────────────────────────────────────
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  FileText, BookOpen, Code2, ClipboardList, MessageSquare, FileStack,
};

// ── Types ───────────────────────────────────────────────────────────────────────
interface BigDoc {
  icon: string;
  name: string;
  weight: string;   // human-readable size, e.g. "82 pages · ~61k tokens"
  fill: number;     // how much of the window this consumes, 0–100
}

interface FillStage {
  label: string;
  detail: string;
  fill: number;     // window fill % after this on-ramp
}

interface OnRamp {
  label: string;
  note: string;
}

interface ContextCard {
  text: string;
  dropped: boolean;
}

interface ContextPoisoningData {
  type: string;
  scrollable?: boolean;
  kicker: string;
  title: string;
  hook: string;
  scrollHint: string;
  // Beat 1 — the instinct
  instinctKicker: string;
  instinctTitle: string;
  instinctLead: string;
  bigDocs: BigDoc[];
  instinctReframe: string;
  // Beat 2 — the window fills
  windowKicker: string;
  windowTitle: string;
  windowLead: string;
  budgetLabel: string;
  fillStages: FillStage[];
  wallLabel: string;
  onRampsLead: string;
  onRamps: OnRamp[];
  // Beat 3 — the result (compaction)
  resultKicker: string;
  resultTitle: string;
  fullContext: { label: string; cards: ContextCard[] };
  compaction: { operation: string; caption: string; droppedTag: string };
  lossySummary: { label: string; retained: string; text: string };
  casualtyNote: string;
  // Beat 4 — the dagger
  verdict: { agentLine: string; dagger: string; reframe: string };
}

interface ContextPoisoningSlideProps {
  data: ContextPoisoningData;
  lang: 'en' | 'he';
}

// fill-level → literal class strings (NO dynamic class construction)
const fillBar: Record<string, string> = {
  low: 'bg-gradient-to-r from-amber-400/70 to-amber-500/70',
  mid: 'bg-gradient-to-r from-amber-400/70 via-orange-500/80 to-orange-500/80',
  high: 'bg-gradient-to-r from-orange-500/80 via-red-500/85 to-red-600/90',
};
const fillTier = (n: number) => (n < 45 ? 'low' : n < 80 ? 'mid' : 'high');

export default function ContextPoisoningSlide({ data, lang }: ContextPoisoningSlideProps) {
  const isRTL = lang === 'he';

  return (
    <div className="w-full max-w-5xl mx-auto">

      {/* ── HERO — name the trap ──────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col items-center justify-center py-24 px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[10px] sm:text-xs tracking-[0.4em] text-amber-400/70 uppercase font-mono mb-8"
        >
          {data.kicker}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center gap-5"
        >
          <AlertTriangle size={46} className="text-amber-400/80" />
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight bg-gradient-to-b from-amber-300 via-orange-400 to-red-500 bg-clip-text text-transparent leading-none pb-1">
            {data.title}
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-10 max-w-2xl text-lg sm:text-2xl text-white/75 leading-relaxed font-light"
        >
          {data.hook}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95 }}
          className="flex flex-col items-center gap-1.5 text-white/30 mt-16"
        >
          <span className="text-xs">{data.scrollHint}</span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="text-xl"
          >↓</motion.div>
        </motion.div>
      </section>

      {/* ── BEAT 1 — THE INSTINCT (the problem leads) ─────────────────────────── */}
      <section className="min-h-[90vh] flex flex-col justify-center py-20 px-6 border-t border-amber-500/15 bg-amber-500/[0.03]">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-[10px] sm:text-xs tracking-[0.4em] text-amber-400/70 uppercase font-mono mb-4 ${isRTL ? 'text-right' : ''}`}
        >
          {data.instinctKicker}
        </motion.p>
        <motion.h3
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={`text-3xl sm:text-5xl font-black text-white leading-tight mb-4 ${isRTL ? 'text-right' : ''}`}
        >
          {data.instinctTitle}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`text-base sm:text-lg text-white/60 max-w-2xl mb-12 leading-relaxed ${isRTL ? 'text-right self-end' : ''}`}
        >
          {data.instinctLead}
        </motion.p>

        {/* The pile of oversized documents being handed over */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.bigDocs.map((doc, i) => {
            const Icon = iconMap[doc.icon] || FileText;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09, duration: 0.45 }}
                className={`relative rounded-xl border border-amber-500/25 bg-slate-900/50 p-5 overflow-hidden flex flex-col gap-3 ${isRTL ? 'items-end text-right' : 'items-start'}`}
              >
                {/* stacked-paper depth accent */}
                <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-amber-500/5 blur-xl pointer-events-none" />
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Icon size={22} className="text-amber-300 shrink-0" />
                  <span className="text-sm font-bold text-amber-100 leading-tight">{doc.name}</span>
                </div>
                <span dir="ltr" className={`text-[11px] font-mono text-orange-300/70 ${isRTL ? 'self-end' : ''}`}>
                  {doc.weight}
                </span>
                {/* mini consumption bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-700/50 overflow-hidden" dir="ltr">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${doc.fill}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.09, duration: 0.7 }}
                    className={`h-full ${fillBar[fillTier(doc.fill)]}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.2 }}
          className={`mt-10 flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
        >
          <FileStack size={24} className="text-amber-400/80 shrink-0" />
          <p className="text-lg sm:text-xl font-bold text-amber-200 leading-snug">{data.instinctReframe}</p>
        </motion.div>
      </section>

      {/* ── BEAT 2 — THE WINDOW FILLS (the finite budget) ─────────────────────── */}
      <section className="min-h-[90vh] flex flex-col justify-center py-20 px-6 border-t border-orange-500/20 bg-orange-500/[0.04]">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-[10px] sm:text-xs tracking-[0.4em] text-orange-400/70 uppercase font-mono mb-4 ${isRTL ? 'text-right' : ''}`}
        >
          {data.windowKicker}
        </motion.p>
        <motion.h3
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={`text-3xl sm:text-5xl font-black text-white leading-tight mb-4 ${isRTL ? 'text-right' : ''}`}
        >
          {data.windowTitle}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`text-base sm:text-lg text-white/60 max-w-2xl mb-12 leading-relaxed ${isRTL ? 'text-right self-end' : ''}`}
        >
          {data.windowLead}
        </motion.p>

        {/* The finite-window budget gauge — the vessel filling with each doc (LTR) */}
        <div dir="ltr" className="relative rounded-2xl border border-orange-500/20 bg-slate-950/40 px-5 sm:px-8 py-8">
          <div className="flex items-center justify-between mb-6 font-mono text-xs">
            <span className="text-white/40 uppercase tracking-wider">{data.budgetLabel}</span>
            <span className="text-red-400/70 font-bold">100%</span>
          </div>

          {/* the vessel */}
          <div className="relative h-12 rounded-lg bg-slate-800/60 border border-white/10 overflow-hidden">
            {/* the danger zone marker at ~80% */}
            <div className="absolute top-0 bottom-0 right-0 w-[20%] bg-red-500/10 border-l border-dashed border-red-400/40" />
            {/* the climbing fill — animates to the final, pre-work level */}
            <motion.div
              initial={{ width: '0%' }}
              whileInView={{ width: `${data.fillStages[data.fillStages.length - 1].fill}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-400/60 via-orange-500/75 to-red-600/90"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-mono font-bold text-white/80 tracking-wide drop-shadow">
                {data.wallLabel}
              </span>
            </div>
          </div>

          {/* stepped on-ramps: 20% → 60% → 98% BEFORE any work */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {data.fillStages.map((stage, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.25, duration: 0.45 }}
                className="flex flex-col items-center text-center gap-1"
              >
                <span className={`text-2xl sm:text-3xl font-black ${stage.fill < 45 ? 'text-amber-300' : stage.fill < 80 ? 'text-orange-400' : 'text-red-400'}`}>
                  {stage.fill}%
                </span>
                <span className="text-[11px] font-bold text-white/70 leading-tight">{stage.label}</span>
                <span className="text-[10px] text-white/40 leading-snug">{stage.detail}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Many on-ramps, one wall */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`mt-10 mb-4 text-sm font-mono text-orange-300/70 ${isRTL ? 'text-right' : ''}`}
        >
          {data.onRampsLead}
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {data.onRamps.map((ramp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={`rounded-xl border border-orange-500/20 bg-slate-900/40 p-4 flex flex-col gap-1.5 ${isRTL ? 'items-end text-right' : 'items-start'}`}
            >
              <span className="text-sm font-bold text-orange-100 leading-tight">{ramp.label}</span>
              <span className="text-xs text-white/50 leading-snug">{ramp.note}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── BEAT 3 — THE RESULT (compaction, demoted to consequence) ──────────── */}
      <section className="min-h-screen flex flex-col justify-center py-20 px-6 border-t border-red-500/25 bg-red-950/15">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-[10px] sm:text-xs tracking-[0.4em] text-red-400/70 uppercase font-mono mb-4 ${isRTL ? 'text-right' : ''}`}
        >
          {data.resultKicker}
        </motion.p>
        <motion.h3
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={`text-3xl sm:text-5xl font-black text-white leading-tight mb-12 ${isRTL ? 'text-right' : ''}`}
        >
          {data.resultTitle}
        </motion.h3>

        {/* The mechanism — ALWAYS LTR (Full Context → compaction seam → Lossy Summary) */}
        <div dir="ltr" className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-5 items-stretch">
          {/* Full Context */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl border border-white/10 bg-slate-900/50 p-5"
          >
            <div className="text-[11px] font-mono uppercase tracking-wider text-white/40 mb-4">
              {data.fullContext.label}
            </div>
            <div className="flex flex-col gap-2.5">
              {data.fullContext.cards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className={`relative rounded-lg border px-3 py-2 text-sm leading-snug ${
                    card.dropped
                      ? 'border-red-500/30 bg-red-500/5 text-white/45'
                      : 'border-white/10 bg-slate-800/50 text-white/75'
                  }`}
                >
                  <span className={card.dropped ? 'line-through decoration-red-400/50' : ''}>
                    {card.text}
                  </span>
                  {card.dropped && (
                    <span className="ml-2 text-[9px] font-mono uppercase tracking-wide text-red-400/70 align-middle">
                      {data.compaction.droppedTag}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ⚡ AUTO-COMPACT seam — the only CYAN moment (the mechanism pivot) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 180 }}
            className="flex lg:flex-col items-center justify-center gap-3 px-2"
          >
            <div className="flex flex-col items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-4">
              <Zap size={22} className="text-cyan-300" />
              <span className="text-xs font-mono font-bold text-cyan-200 whitespace-nowrap tracking-wide">
                {data.compaction.operation}
              </span>
            </div>
            <span className="text-[10px] font-mono text-cyan-300/50 tracking-wide lg:mt-1">
              {data.compaction.caption}
            </span>
            <ChevronDown size={18} className="text-cyan-300/40 hidden lg:block" />
          </motion.div>

          {/* Lossy Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.45 }}
            className="rounded-2xl border border-amber-500/25 bg-amber-950/10 p-5 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300/60">
                {data.lossySummary.label}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/15 text-red-300/80">
                {data.lossySummary.retained}
              </span>
            </div>
            <p className="text-sm text-white/65 italic leading-relaxed">
              "{data.lossySummary.text}"
            </p>
          </motion.div>
        </div>

        {/* The casualties note */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.2 }}
          className={`mt-10 flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
        >
          <Database size={22} className="text-red-400/70 shrink-0" />
          <p className="text-base sm:text-lg text-red-200/90 font-semibold leading-snug">{data.casualtyNote}</p>
        </motion.div>
      </section>

      {/* ── BEAT 4 — THE DAGGER (the verdict) ─────────────────────────────────── */}
      <section className="min-h-screen flex flex-col items-center justify-center py-24 px-6 border-t border-red-600/30">
        {/* the agent, confidently wrong — keep terminal LTR */}
        <motion.div
          dir="ltr"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-2xl rounded-xl border border-red-500/25 bg-slate-950/70 overflow-hidden"
        >
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/10 bg-slate-900/60">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
            <span className="ml-2 text-[10px] font-mono text-white/30">agent</span>
          </div>
          <div className="px-5 py-5 font-mono text-sm">
            <span className="text-cyan-300/70">{'> '}</span>
            <span className="text-white/80">{data.verdict.agentLine}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-10 flex flex-col items-center text-center gap-4 max-w-2xl"
        >
          <Skull size={32} className="text-red-500/80" />
          <p className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 bg-clip-text text-transparent leading-tight pb-1">
            {data.verdict.dagger}
          </p>
          <p className="text-base sm:text-lg text-white/55 leading-relaxed max-w-xl">
            {data.verdict.reframe}
          </p>
        </motion.div>
      </section>
    </div>
  );
}
