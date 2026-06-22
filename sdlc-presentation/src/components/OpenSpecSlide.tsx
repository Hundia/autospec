import React from 'react';
import { motion } from 'framer-motion';
import {
  Workflow,
  Sparkles,
  ArrowRight,
  FilePlus2,
  CheckCircle2,
  RefreshCw,
  FolderTree,
  Boxes,
  GitBranch,
  FileText,
  FileEdit,
  FileMinus2,
  ChevronDown,
} from 'lucide-react';

// ── Accent map — literal class strings only, NO dynamic construction ────────────
const accentMap: Record<string, {
  text: string;
  border: string;
  bg: string;
  badge: string;
}> = {
  teal:    { text: 'text-teal-400',    border: 'border-teal-500/30',    bg: 'bg-teal-500/8',    badge: 'bg-teal-500/20 text-teal-300' },
  emerald: { text: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/8', badge: 'bg-emerald-500/20 text-emerald-300' },
  cyan:    { text: 'text-cyan-400',    border: 'border-cyan-500/30',    bg: 'bg-cyan-500/8',    badge: 'bg-cyan-500/20 text-cyan-300' },
  violet:  { text: 'text-violet-400',  border: 'border-violet-500/30',  bg: 'bg-violet-500/8',  badge: 'bg-violet-500/20 text-violet-300' },
  indigo:  { text: 'text-indigo-400',  border: 'border-indigo-500/35',  bg: 'bg-indigo-500/10', badge: 'bg-indigo-500/20 text-indigo-300' },
  blue:    { text: 'text-blue-400',    border: 'border-blue-500/30',    bg: 'bg-blue-500/8',    badge: 'bg-blue-500/20 text-blue-300' },
  slate:   { text: 'text-slate-400',   border: 'border-slate-500/30',   bg: 'bg-slate-500/8',   badge: 'bg-slate-500/20 text-slate-300' },
};

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  Workflow,
  Sparkles,
  ArrowRight,
  FilePlus2,
  CheckCircle2,
  RefreshCw,
  FolderTree,
  Boxes,
  GitBranch,
  FileText,
  FileEdit,
  FileMinus2,
};

// ── Data shapes ─────────────────────────────────────────────────────────────────
interface LoopStep {
  iconKey: string;
  label: string;
  command: string;
  note: string;
  accent: string;
}

interface Artifact {
  iconKey: string;
  name: string;
  desc: string;
  accent: string;
}

interface DeltaBlock {
  tag: string;
  iconKey: string;
  accent: string;
  content: string;
}

interface OpenSpecSlideData {
  type: string;
  variant: 'what' | 'anatomy';
  scrollable: boolean;

  kicker: string;
  heroTitle: string;
  heroSubtitle: string;
  scrollHint: string;

  // ── variant: 'what' ──
  pullQuote?: string;
  ideaKicker?: string;
  ideaHeading?: string;
  ideaBody?: string;

  loopKicker?: string;
  loopHeading?: string;
  loopBody?: string;
  loopSteps?: LoopStep[];
  loopBackNote?: string;

  dirKicker?: string;
  dirHeading?: string;
  dirBody?: string;
  fileTree?: string;
  specsNote?: string;
  changesNote?: string;

  whyKicker?: string;
  whyHeading?: string;
  whyBody?: string;
  tools?: string[];

  // ── variant: 'anatomy' ──
  folderLabel?: string;
  artifactsKicker?: string;
  artifactsHeading?: string;
  artifacts?: Artifact[];

  reqKicker?: string;
  reqHeading?: string;
  reqBody?: string;
  requirementBlock?: string;

  scenarioKicker?: string;
  scenarioHeading?: string;
  scenarioBody?: string;
  scenarioBlock?: string;

  deltaKicker?: string;
  deltaHeading?: string;
  deltaBody?: string;
  deltas?: DeltaBlock[];
}

interface OpenSpecSlideProps {
  data: OpenSpecSlideData;
  lang: 'en' | 'he';
}

// ── Scenario renderer — colors WHEN cyan, THEN emerald, Scenario violet ─────────
function ScenarioBlock({ text }: { text: string }) {
  return (
    <pre
      dir="ltr"
      className="text-[11px] sm:text-xs font-mono bg-slate-900/80 border border-cyan-500/20 rounded-xl p-4 overflow-x-auto leading-relaxed whitespace-pre"
    >
      {text.split('\n').map((line, i) => {
        const trimmed = line.trimStart();
        let cls = 'text-white/55';
        if (trimmed.startsWith('WHEN')) cls = 'text-cyan-300';
        else if (trimmed.startsWith('THEN')) cls = 'text-emerald-300';
        else if (trimmed.startsWith('Scenario')) cls = 'text-violet-300 font-bold';
        return (
          <div key={i} className={cls}>
            {line || ' '}
          </div>
        );
      })}
    </pre>
  );
}

// ── Section wrapper for a scroll beat ───────────────────────────────────────────
function Beat({
  children,
  accentBorder,
  className = '',
}: {
  children: React.ReactNode;
  accentBorder: string;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.5 }}
      className={`min-h-[85vh] flex flex-col justify-center px-6 py-16 border-t ${accentBorder} ${className}`}
    >
      {children}
    </motion.section>
  );
}

// ── Main component ──────────────────────────────────────────────────────────────
export default function OpenSpecSlide({ data, lang }: OpenSpecSlideProps) {
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
          className="w-16 h-16 rounded-2xl bg-teal-500/12 border border-teal-400/30 flex items-center justify-center mb-7"
        >
          {data.variant === 'what' ? (
            <Workflow size={30} className="text-teal-300" strokeWidth={1.75} />
          ) : (
            <FileText size={30} className="text-cyan-300" strokeWidth={1.75} />
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[10px] sm:text-xs tracking-[0.45em] text-teal-400/80 uppercase font-mono mb-5"
        >
          {data.kicker}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-5 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent pb-2"
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

      {data.variant === 'what' ? <WhatBeats data={data} isRTL={isRTL} align={align} /> : <AnatomyBeats data={data} isRTL={isRTL} align={align} />}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// VARIANT A — "What is OpenSpec"
// ════════════════════════════════════════════════════════════════════════════════
function WhatBeats({ data, isRTL, align }: { data: OpenSpecSlideData; isRTL: boolean; align: string }) {
  return (
    <>
      {/* ── BEAT 1 — Core idea + pull quote ── */}
      <Beat accentBorder="border-teal-500/10" className="items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <Sparkles size={28} className="text-teal-300/80 mx-auto" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] sm:text-xs tracking-[0.4em] text-teal-400/70 uppercase font-mono mb-3"
        >
          {data.ideaKicker}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: -14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 leading-tight max-w-3xl"
        >
          {data.ideaHeading}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-white/60 max-w-2xl leading-relaxed mb-9 text-base sm:text-lg"
        >
          {data.ideaBody}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="inline-block px-7 py-4 rounded-2xl border border-teal-500/30 bg-teal-500/8"
        >
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">
            “{data.pullQuote}”
          </span>
        </motion.div>
      </Beat>

      {/* ── BEAT 2 — Propose → Apply → Archive loop ── */}
      <Beat accentBorder="border-emerald-500/10">
        <BeatHeader kicker={data.loopKicker} heading={data.loopHeading} body={data.loopBody} align={align} accent="emerald" />

        {/* Three connected cards — forced LTR (flow reads left→right) */}
        <div dir="ltr" className="flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-2 mt-4">
          {(data.loopSteps ?? []).map((step, i) => {
            const colors = accentMap[step.accent] || accentMap.teal;
            const Icon = iconMap[step.iconKey] || FilePlus2;
            const isLast = i === (data.loopSteps?.length ?? 0) - 1;
            return (
              <React.Fragment key={step.label}>
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.15 }}
                  className={`flex-1 rounded-2xl border ${colors.border} ${colors.bg} p-5 flex flex-col gap-2.5`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={20} className={colors.text} />
                    <span className="text-base font-black text-white/90">{step.label}</span>
                  </div>
                  <code className={`text-[11px] font-mono ${colors.badge} px-2 py-1 rounded w-fit`}>{step.command}</code>
                  <span className="text-xs text-white/45 leading-snug">{step.note}</span>
                </motion.div>
                {!isLast && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                    className="flex items-center justify-center text-white/25 rotate-90 sm:rotate-0 py-1 sm:py-0"
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Loop-back note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-2 mt-6 text-teal-300/60"
        >
          <RefreshCw size={14} />
          <span className="text-xs font-mono">{data.loopBackNote}</span>
        </motion.div>
      </Beat>

      {/* ── BEAT 3 — Two directories ── */}
      <Beat accentBorder="border-cyan-500/10">
        <BeatHeader kicker={data.dirKicker} heading={data.dirHeading} body={data.dirBody} align={align} accent="cyan" />

        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 items-center mt-2">
          {/* File tree */}
          <motion.pre
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            dir="ltr"
            className="text-xs sm:text-sm font-mono bg-slate-900/80 border border-cyan-500/20 rounded-xl p-5 text-white/70 overflow-x-auto leading-relaxed whitespace-pre"
          >
            {data.fileTree}
          </motion.pre>

          {/* Two legend cards */}
          <div className="flex flex-col gap-3">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -16 : 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="rounded-xl border border-emerald-500/30 bg-emerald-500/8 p-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <FolderTree size={16} className="text-emerald-400" />
                <code className="text-sm font-mono font-bold text-emerald-300">specs/</code>
              </div>
              <span className="text-xs text-white/55 leading-snug">{data.specsNote}</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -16 : 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45 }}
              className="rounded-xl border border-violet-500/30 bg-violet-500/8 p-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <FolderTree size={16} className="text-violet-400" />
                <code className="text-sm font-mono font-bold text-violet-300">changes/</code>
              </div>
              <span className="text-xs text-white/55 leading-snug">{data.changesNote}</span>
            </motion.div>
          </div>
        </div>
      </Beat>

      {/* ── BEAT 4 — Why it lands / works where you work ── */}
      <Beat accentBorder="border-teal-500/10">
        <BeatHeader kicker={data.whyKicker} heading={data.whyHeading} body={data.whyBody} align={align} accent="teal" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className={`flex flex-wrap gap-2.5 mt-3 ${isRTL ? 'justify-end' : ''}`}
        >
          {(data.tools ?? []).map((tool) => (
            <span
              key={tool}
              className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-teal-500/25 bg-teal-500/8 text-teal-100/80 font-mono"
            >
              <Boxes size={14} className="text-teal-400/70" />
              {tool}
            </span>
          ))}
        </motion.div>
      </Beat>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// VARIANT B — "Anatomy of a Spec"
// ════════════════════════════════════════════════════════════════════════════════
function AnatomyBeats({ data, isRTL, align }: { data: OpenSpecSlideData; isRTL: boolean; align: string }) {
  return (
    <>
      {/* ── BEAT 1 — Four artifacts in a change folder ── */}
      <Beat accentBorder="border-cyan-500/10">
        <BeatHeader kicker={data.artifactsKicker} heading={data.artifactsHeading} body={undefined} align={align} accent="cyan" />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          dir="ltr"
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-white/10 mb-5 ${isRTL ? 'self-end' : 'self-start'}`}
        >
          <FolderTree size={14} className="text-cyan-400/70" />
          <code className="text-xs font-mono text-white/60">{data.folderLabel}</code>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(data.artifacts ?? []).map((art, i) => {
            const colors = accentMap[art.accent] || accentMap.cyan;
            const Icon = iconMap[art.iconKey] || FileText;
            return (
              <motion.div
                key={art.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className={`rounded-xl border ${colors.border} ${colors.bg} p-4 flex items-start gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
              >
                <Icon size={20} className={`${colors.text} shrink-0 mt-0.5`} />
                <div className="flex flex-col gap-0.5">
                  <code className="text-sm font-mono font-bold text-white/90" dir="ltr">{art.name}</code>
                  <span className="text-xs text-white/50 leading-snug">{art.desc}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Beat>

      {/* ── BEAT 2 — The requirement in plain language ── */}
      <Beat accentBorder="border-teal-500/10">
        <BeatHeader kicker={data.reqKicker} heading={data.reqHeading} body={data.reqBody} align={align} accent="teal" />

        <motion.pre
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          dir="ltr"
          className="text-xs sm:text-sm font-mono bg-slate-900/80 border border-teal-500/25 rounded-xl p-5 text-teal-100/80 overflow-x-auto leading-relaxed whitespace-pre-wrap mt-2"
        >
          {data.requirementBlock}
        </motion.pre>
      </Beat>

      {/* ── BEAT 3 — WHEN / THEN scenarios ── */}
      <Beat accentBorder="border-cyan-500/10">
        <BeatHeader kicker={data.scenarioKicker} heading={data.scenarioHeading} body={data.scenarioBody} align={align} accent="cyan" />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-2"
        >
          <ScenarioBlock text={data.scenarioBlock ?? ''} />
        </motion.div>

        {/* WHEN/THEN legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          dir="ltr"
          className="flex items-center gap-4 mt-4 text-[11px] font-mono"
        >
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" /><span className="text-white/50">WHEN — condition</span></span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-white/50">THEN — outcome</span></span>
        </motion.div>
      </Beat>

      {/* ── BEAT 4 — Delta specs ── */}
      <Beat accentBorder="border-indigo-500/10">
        <BeatHeader kicker={data.deltaKicker} heading={data.deltaHeading} body={data.deltaBody} align={align} accent="indigo" />

        <div className="flex flex-col gap-3 mt-2">
          {(data.deltas ?? []).map((delta, i) => {
            const colors = accentMap[delta.accent] || accentMap.slate;
            const Icon = iconMap[delta.iconKey] || FileEdit;
            return (
              <motion.div
                key={delta.tag}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.12 }}
                dir="ltr"
                className={`rounded-xl border ${colors.border} ${colors.bg} px-4 py-3 flex items-center gap-3`}
              >
                <Icon size={18} className={`${colors.text} shrink-0`} />
                <code className={`text-xs font-mono font-black ${colors.text} tracking-wide shrink-0`}>{delta.tag}</code>
                <span className="text-xs text-white/55 font-mono leading-snug">{delta.content}</span>
              </motion.div>
            );
          })}
        </div>
      </Beat>
    </>
  );
}

// ── Shared beat header (kicker + heading + optional body) ────────────────────────
function BeatHeader({
  kicker,
  heading,
  body,
  align,
  accent,
}: {
  kicker?: string;
  heading?: string;
  body?: string;
  align: string;
  accent: string;
}) {
  const colors = accentMap[accent] || accentMap.teal;
  return (
    <>
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`text-[10px] sm:text-xs tracking-[0.4em] uppercase font-mono mb-3 ${colors.text} opacity-80 ${align}`}
      >
        {kicker}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: -16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={`text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight ${align}`}
      >
        {heading}
      </motion.h2>
      {body && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`text-white/60 max-w-2xl leading-relaxed mb-8 text-base sm:text-lg ${align}`}
        >
          {body}
        </motion.p>
      )}
    </>
  );
}
