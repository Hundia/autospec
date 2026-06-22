import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Boxes,
  ScrollText,
  Lock,
  Layers,
  XCircle,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  RefreshCw,
  TrendingUp,
  Ban,
} from 'lucide-react';

// ── Accent map — literal class strings only, NO dynamic construction ────────────
const accentMap: Record<string, {
  text: string;
  border: string;
  bg: string;
  badge: string;
  ring: string;
}> = {
  blue:    { text: 'text-blue-400',    border: 'border-blue-500/30',    bg: 'bg-blue-500/8',    badge: 'bg-blue-500/20 text-blue-300',    ring: 'border-blue-400/30' },
  violet:  { text: 'text-violet-400',  border: 'border-violet-500/30',  bg: 'bg-violet-500/8',  badge: 'bg-violet-500/20 text-violet-300',  ring: 'border-violet-400/30' },
  cyan:    { text: 'text-cyan-400',    border: 'border-cyan-500/30',    bg: 'bg-cyan-500/8',    badge: 'bg-cyan-500/20 text-cyan-300',    ring: 'border-cyan-400/30' },
  emerald: { text: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/8', badge: 'bg-emerald-500/20 text-emerald-300', ring: 'border-emerald-400/30' },
  teal:    { text: 'text-teal-400',    border: 'border-teal-500/30',    bg: 'bg-teal-500/8',    badge: 'bg-teal-500/20 text-teal-300',    ring: 'border-teal-400/30' },
};

// ── Icon registry — only icons verified present in lucide-react@0.330.0 ─────────
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  Boxes,
  ScrollText,
  Lock,
  Layers,
  ShieldCheck,
};

// ── Data shapes ─────────────────────────────────────────────────────────────────
interface GuardrailCase {
  iconKey: string;       // key into iconMap
  accent: string;        // key into accentMap (blue / violet / cyan / emerald)
  kicker: string;        // small label above heading
  name: string;          // guardrail name
  scenario: string;      // what the agent TRIED to do
  attemptLabel: string;  // e.g. "Agent tried" — column header
  attemptCode: string;   // LTR code/snippet of the bad attempt
  verdict: string;       // BLOCKED / CORRECTED short tag
  responseLabel: string; // e.g. "Guardrail response" — column header
  response: string;      // prose: how the guardrail reacted
  rule: string;          // the rule it enforces
  ruleLabel: string;     // e.g. "Rule enforced"
}

interface HarnessSlideData {
  type: string;
  scrollable: boolean;

  // Hero
  kicker: string;
  heroTitle: string;
  heroSubtitle: string;
  scrollHint: string;

  // Intro beat — what a guardrail is
  introKicker: string;
  introHeading: string;
  introBody: string;

  // Use-case beats
  casesKicker: string;
  cases: GuardrailCase[];

  // Closing beat — guardrails only grow stronger
  loopKicker: string;
  loopHeading: string;
  loopBody: string;
  loopSteps: string[];
  loopBackNote: string;
  callout: string;
}

interface HarnessSlideProps {
  data: HarnessSlideData;
  lang: 'en' | 'he';
}

// ── A single guardrail use-case beat ────────────────────────────────────────────
function CaseBeat({
  c,
  isRTL,
  align,
}: {
  c: GuardrailCase;
  isRTL: boolean;
  align: string;
}) {
  const colors = accentMap[c.accent] || accentMap.blue;
  const Icon = iconMap[c.iconKey] || ShieldCheck;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.5 }}
      className={`min-h-[85vh] flex flex-col justify-center px-6 py-16 border-t ${colors.border}`}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <div className={`w-11 h-11 rounded-xl border ${colors.border} ${colors.bg} flex items-center justify-center shrink-0`}>
          <Icon size={22} className={colors.text} strokeWidth={1.75} />
        </div>
        <span className={`text-[10px] sm:text-xs tracking-[0.4em] uppercase font-mono ${colors.text} opacity-80`}>
          {c.kicker}
        </span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: -16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={`text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight ${align}`}
      >
        {c.name}
      </motion.h2>

      {/* Two columns: agent tried (blocked) → guardrail response (rule) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
        {/* Agent attempt — danger framed */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-red-500/30 bg-red-500/8 p-5 flex flex-col gap-3 relative"
        >
          <span className={`text-[10px] font-mono tracking-[0.3em] uppercase text-red-300/70 ${align}`}>
            {c.attemptLabel}
          </span>
          <p className={`text-sm text-white/70 leading-snug ${align}`}>{c.scenario}</p>
          <pre
            dir="ltr"
            className="text-[11px] sm:text-xs font-mono bg-slate-900/80 border border-red-500/20 rounded-xl p-3 text-red-200/80 overflow-x-auto leading-relaxed whitespace-pre-wrap"
          >
            {c.attemptCode}
          </pre>
          <div className="flex items-center gap-2 mt-auto">
            <XCircle size={16} className="text-red-400" />
            <span className="text-[11px] font-mono font-black tracking-wider text-red-300">
              {c.verdict}
            </span>
          </div>
        </motion.div>

        {/* Arrow connector — rotates on small screens, mirrored in RTL */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="flex items-center justify-center text-white/25"
        >
          <Ban size={18} className={`${colors.text} opacity-60 rotate-90 lg:rotate-0`} />
        </motion.div>

        {/* Guardrail response — enforces rule */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45 }}
          className={`rounded-2xl border ${colors.border} ${colors.bg} p-5 flex flex-col gap-3`}
        >
          <span className={`text-[10px] font-mono tracking-[0.3em] uppercase ${colors.text} opacity-70 ${align}`}>
            {c.responseLabel}
          </span>
          <p className={`text-sm text-white/70 leading-snug ${align}`}>{c.response}</p>
          <div className={`rounded-xl border ${colors.ring} bg-slate-900/50 p-3 mt-auto`}>
            <span className={`block text-[10px] font-mono tracking-[0.25em] uppercase text-white/35 mb-1 ${align}`}>
              {c.ruleLabel}
            </span>
            <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <CheckCircle2 size={15} className={`${colors.text} shrink-0 mt-0.5`} />
              <span className={`text-xs font-mono ${colors.text} leading-snug`} dir="ltr">{c.rule}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

// ── Main component ──────────────────────────────────────────────────────────────
export default function HarnessSlide({ data, lang }: HarnessSlideProps) {
  const isRTL = lang === 'he';
  const align = isRTL ? 'text-right' : '';

  return (
    <div className="w-full max-w-5xl mx-auto">

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 180, damping: 16 }}
          className="w-16 h-16 rounded-2xl bg-emerald-500/12 border border-emerald-400/30 flex items-center justify-center mb-7"
        >
          <ShieldCheck size={30} className="text-emerald-300" strokeWidth={1.75} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[10px] sm:text-xs tracking-[0.45em] text-emerald-400/80 uppercase font-mono mb-5"
        >
          {data.kicker}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent pb-2"
        >
          {data.heroTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="text-lg sm:text-xl text-white/70 max-w-2xl mb-12 leading-relaxed font-medium"
        >
          {data.heroSubtitle}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="text-sm text-white/35 mb-6 italic"
        >
          {data.scrollHint}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white/30"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
            <ChevronDown size={24} />
          </motion.div>
        </motion.div>
      </section>

      {/* ══ INTRO BEAT — what a guardrail is ════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5 }}
        className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6 py-16 border-t border-emerald-500/10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <Layers size={28} className="text-emerald-300/80 mx-auto" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] sm:text-xs tracking-[0.4em] text-emerald-400/70 uppercase font-mono mb-3"
        >
          {data.introKicker}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: -14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 leading-tight max-w-3xl"
        >
          {data.introHeading}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-white/60 max-w-2xl leading-relaxed text-base sm:text-lg"
        >
          {data.introBody}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="text-[10px] sm:text-xs tracking-[0.4em] text-white/30 uppercase font-mono mt-12"
        >
          {data.casesKicker}
        </motion.p>
      </motion.section>

      {/* ══ USE-CASE BEATS — one per guardrail ══════════════════════════════════ */}
      {data.cases.map((c) => (
        <CaseBeat key={c.name} c={c} isRTL={isRTL} align={align} />
      ))}

      {/* ══ CLOSING BEAT — guardrails only grow stronger ════════════════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5 }}
        className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6 py-24 border-t border-teal-500/10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 180, damping: 14 }}
          className="mb-6"
        >
          <TrendingUp size={30} className="text-teal-300" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] sm:text-xs tracking-[0.45em] text-teal-400/80 uppercase font-mono mb-4"
        >
          {data.loopKicker}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-black mb-5 leading-tight bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent pb-1 max-w-3xl"
        >
          {data.loopHeading}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-white/60 max-w-2xl leading-relaxed mb-10 text-base sm:text-lg"
        >
          {data.loopBody}
        </motion.p>

        {/* Loop steps — forced LTR flow (reads as a pipeline) */}
        <div dir="ltr" className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {data.loopSteps.map((step, idx) => (
            <React.Fragment key={step}>
              <motion.span
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 + idx * 0.1 }}
                className="bg-slate-800/70 border border-teal-500/20 rounded-lg px-3 py-2 text-sm text-white/80 font-medium"
              >
                {step}
              </motion.span>
              {idx < data.loopSteps.length - 1 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 + idx * 0.1 + 0.05 }}
                  className="text-white/25"
                >
                  <ArrowRight size={16} />
                </motion.span>
              )}
            </React.Fragment>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-2 mb-10 text-teal-300/60"
        >
          <RefreshCw size={14} />
          <span className="text-xs font-mono">{data.loopBackNote}</span>
        </motion.div>

        {/* Callout badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl border-2 border-emerald-400/40 bg-emerald-500/10 max-w-3xl"
          style={{ boxShadow: '0 0 32px rgba(52,211,153,0.15), 0 0 64px rgba(52,211,153,0.06)' }}
        >
          <ShieldCheck size={20} className="text-emerald-300 shrink-0" />
          <span className={`text-emerald-200 font-semibold text-sm sm:text-base italic leading-snug ${align}`}>
            {data.callout}
          </span>
        </motion.div>
      </motion.section>

    </div>
  );
}
