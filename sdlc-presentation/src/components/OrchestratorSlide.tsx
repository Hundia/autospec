import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Cpu,
  GitBranch,
  ArrowRight,
  Zap,
  Shield,
  FileText,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';

// ── Provider types ──────────────────────────────────────────────────────────────
interface Provider {
  id: string;
  name: string;
  icon: string;
  accent: 'indigo' | 'blue' | 'green';
  orchestratorModel: string;
  agentModel: string;
}

// ── Data shape ──────────────────────────────────────────────────────────────────
interface OrchestratorSlideData {
  type: string;
  scrollable?: boolean;
  title: string;
  subtitle?: string;
  kicker?: string;
  providers: Provider[];
  orchestrator: {
    roleLabel: string;
    tasks: string[];
  };
  agents: Array<{ roleLabel: string; task: string }>;
  benefits: string[];
  callout?: string;
  // New beat data
  withoutBeat: {
    kicker: string;
    title: string;
    body: string;
    trapReference: string;
    contextSteps: string[];
  };
  withBeat: {
    kicker: string;
    title: string;
    body: string;
    agentLabels: string[];
    agentTasks: string[];
  };
  handoffBeat: {
    kicker: string;
    title: string;
    body: string;
    briefItems: string[];
    notIncluded: string;
  };
  payoffBeat: {
    kicker: string;
    title: string;
    body: string;
    callbackQuote: string;
    resolution: string;
    providerLine: string;
  };
}

interface OrchestratorSlideProps {
  data: OrchestratorSlideData;
  lang: 'en' | 'he';
}

// ── Accent color maps (literal Tailwind only) ────────────────────────────────
const providerAccentBorder: Record<string, string> = {
  indigo: 'border-indigo-500/40',
  blue: 'border-blue-500/40',
  green: 'border-green-500/40',
};
const providerAccentBg: Record<string, string> = {
  indigo: 'bg-indigo-500/10',
  blue: 'bg-blue-500/10',
  green: 'bg-green-500/10',
};
const providerAccentText: Record<string, string> = {
  indigo: 'text-indigo-300',
  blue: 'text-blue-300',
  green: 'text-green-300',
};
const providerAccentDot: Record<string, string> = {
  indigo: 'bg-indigo-400',
  blue: 'bg-blue-400',
  green: 'bg-green-400',
};

// Rgba values for dynamic inline styles (dynamic values can't be Tailwind classes)
const providerAccentRgba: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  indigo: { border: 'rgba(129,140,248,0.4)', bg: 'rgba(99,102,241,0.12)', text: '#a5b4fc', dot: '#818cf8' },
  blue:   { border: 'rgba(96,165,250,0.4)',  bg: 'rgba(59,130,246,0.12)',  text: '#93c5fd', dot: '#60a5fa' },
  green:  { border: 'rgba(74,222,128,0.4)',  bg: 'rgba(34,197,94,0.12)',   text: '#86efac', dot: '#4ade80' },
};

// ── Context Gauge Visual ──────────────────────────────────────────────────────
function ContextGauge({
  label,
  fillPercent,
  isHot,
  animated,
}: {
  label: string;
  fillPercent: number;
  isHot: boolean;
  animated?: boolean;
}) {
  const fillColor = isHot
    ? 'linear-gradient(180deg, #f97316 0%, #ef4444 100%)'
    : 'linear-gradient(180deg, #818cf8 0%, #6366f1 100%)';
  const trackBorder = isHot ? 'rgba(251,113,133,0.3)' : 'rgba(129,140,248,0.3)';
  const labelColor = isHot ? '#fb923c' : '#a5b4fc';
  const warningVisible = isHot && fillPercent > 70;

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: labelColor }}>
        {label}
      </span>
      {/* Tall thin bar */}
      <div
        className="relative w-6 rounded-full overflow-hidden"
        style={{
          height: '140px',
          border: `1px solid ${trackBorder}`,
          backgroundColor: 'rgba(0,0,0,0.4)',
        }}
      >
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-full"
          initial={{ height: animated ? '0%' : `${fillPercent}%` }}
          whileInView={{ height: `${fillPercent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          style={{ background: fillColor }}
        />
        {/* Compaction warning stripe */}
        {warningVisible && (
          <div
            className="absolute top-0 left-0 right-0"
            style={{
              height: '28%',
              background: 'repeating-linear-gradient(45deg, rgba(239,68,68,0.15) 0px, rgba(239,68,68,0.15) 4px, transparent 4px, transparent 8px)',
              borderBottom: '1px solid rgba(239,68,68,0.4)',
            }}
          />
        )}
      </div>
      <span className="text-[9px] font-mono" style={{ color: isHot ? '#f87171' : '#6366f1' }}>
        {fillPercent}%
      </span>
    </div>
  );
}

// ── Agent Context Bubble ──────────────────────────────────────────────────────
function AgentBubble({
  label,
  task,
  delay,
  accentColor,
}: {
  label: string;
  task: string;
  delay: number;
  accentColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-xl border px-3 py-2.5"
      style={{ borderColor: accentColor, backgroundColor: 'rgba(99,102,241,0.08)' }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <Cpu size={10} style={{ color: accentColor }} />
        <span className="text-[10px] font-bold" style={{ color: accentColor }}>{label}</span>
      </div>
      <p className="text-[9px] font-mono text-white/50 leading-relaxed">{task}</p>
      {/* Mini fill bar — agent context fills and then closes */}
      <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: '0%' }}
          whileInView={{ width: '85%' }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.4, duration: 1.0 }}
          className="h-full rounded-full"
          style={{ background: accentColor }}
        />
      </div>
      <span className="text-[8px] font-mono text-white/25 mt-0.5 block">context fills → task done → closed</span>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function OrchestratorSlide({ data, lang }: OrchestratorSlideProps) {
  const isRTL = lang === 'he';
  const defaultProvider = data.providers[0]?.id ?? 'copilot';
  const [activeId, setActiveId] = useState<string>(defaultProvider);
  const activeProvider = data.providers.find((p) => p.id === activeId) ?? data.providers[0];
  const activeRgba = providerAccentRgba[activeProvider.accent] ?? providerAccentRgba.indigo;

  return (
    <div className="w-full max-w-5xl mx-auto">

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO — "Humans Orchestrate. Agents Execute."
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center py-24 px-6 text-center">

        {/* Kicker */}
        <motion.p
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[10px] sm:text-xs tracking-[0.4em] text-indigo-400/70 uppercase font-mono mb-6"
        >
          {data.kicker ?? 'ACT 4 · THE PATTERN'}
        </motion.p>

        {/* Main title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl sm:text-7xl font-black mb-5 leading-tight pb-1 bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent"
        >
          {data.title}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-lg sm:text-xl text-white/55 max-w-xl mb-10 leading-relaxed"
        >
          {data.subtitle}
        </motion.p>

        {/* Context architecture insight pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-indigo-500/30 bg-indigo-500/8 mb-10"
        >
          <Layers size={14} className="text-indigo-400" />
          <span className="text-sm font-mono text-indigo-300">
            {isRTL ? 'הפרדת קונטקסט = פרויקטים ארוכים עם זיכרון מלא' : 'Context isolation = long projects with full memory'}
          </span>
        </motion.div>

        {/* Provider selector — interactive, lives in hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="flex gap-2 flex-wrap justify-center mb-12"
        >
          {data.providers.map((provider) => {
            const isActive = provider.id === activeId;
            const borderClass = providerAccentBorder[provider.accent];
            const bgClass = providerAccentBg[provider.accent];
            const textClass = providerAccentText[provider.accent];
            const dotClass = providerAccentDot[provider.accent];
            return (
              <button
                key={provider.id}
                onClick={() => setActiveId(provider.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isActive
                    ? `${borderClass} ${bgClass}`
                    : 'border-white/8 bg-white/4'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300 ${
                    isActive ? dotClass : 'bg-white/20'
                  }`}
                  style={isActive ? { animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' } : {}}
                />
                <span className="text-base">{provider.icon}</span>
                <span className={`text-sm font-semibold transition-colors duration-300 ${isActive ? textClass : 'text-white/50'}`}>
                  {provider.name}
                </span>
                {isActive && (
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={provider.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`text-xs font-mono ${textClass} opacity-70`}
                    >
                      ↑ {provider.orchestratorModel} · ↓ {provider.agentModel}
                    </motion.span>
                  </AnimatePresence>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Orchestrator role card — updates with provider */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-2xl border p-5 w-full max-w-lg mb-10 transition-all duration-300"
          style={{ borderColor: activeRgba.border, backgroundColor: activeRgba.bg }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Brain size={16} style={{ color: activeRgba.text }} />
              <h3 className="text-base font-bold text-white">{data.orchestrator.roleLabel}</h3>
            </div>
            <AnimatePresence mode="wait">
              <motion.span
                key={activeProvider.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xs font-mono px-2 py-0.5 rounded"
                style={{ color: activeRgba.text, backgroundColor: 'rgba(0,0,0,0.3)' }}
              >
                {activeProvider.orchestratorModel}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.orchestrator.tasks.map((task, i) => (
              <span key={i} className="text-xs font-mono px-2.5 py-1 rounded bg-black/25 text-white/70">{task}</span>
            ))}
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="flex flex-col items-center gap-2 text-white/30"
        >
          <span className="text-sm">{isRTL ? 'גלול לגלות' : 'Scroll to reveal'}</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown size={22} />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          BEAT 1 — THE WITHOUT (callback to slide 5)
      ═══════════════════════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5 }}
        className="min-h-[85vh] flex flex-col justify-center px-6 py-20 border-t border-white/5"
      >
        {/* Kicker */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="text-[10px] tracking-[0.4em] text-amber-400/70 uppercase font-mono mb-5"
        >
          {data.withoutBeat.kicker}
        </motion.p>

        <motion.h3
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-black mb-4 text-amber-300 tracking-tight"
        >
          {data.withoutBeat.title}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-base sm:text-lg text-white/60 max-w-2xl mb-10 leading-relaxed"
        >
          {data.withoutBeat.body}
        </motion.p>

        {/* Trap callback pill */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/40 bg-amber-500/8 mb-10 self-start"
        >
          <Zap size={12} className="text-amber-400" />
          <span className="text-xs font-mono text-amber-300/80">{data.withoutBeat.trapReference}</span>
        </motion.div>

        {/* WITHOUT diagram — single context filling fast */}
        <div className="flex flex-col sm:flex-row gap-10 items-start" dir="ltr">
          {/* Left: the single context gauge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <Brain size={14} className="text-amber-400/70" />
              <span className="text-xs font-mono text-amber-400/70 uppercase tracking-widest">
                {isRTL ? 'הקשר ראשי' : 'Main Context'}
              </span>
            </div>
            <ContextGauge label={isRTL ? 'מלא' : 'FULL'} fillPercent={88} isHot={true} animated={true} />
            <div
              className="px-3 py-1.5 rounded border border-red-500/30 bg-red-500/10 text-center"
              style={{ maxWidth: '100px' }}
            >
              <span className="text-[9px] font-mono text-red-400 block">COMPACTION</span>
              <span className="text-[9px] font-mono text-red-400/60">TRIGGERED</span>
            </div>
          </motion.div>

          {/* Right: tasks piling into that one context */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono text-white/35 uppercase tracking-widest mb-4">
              {isRTL ? 'כל המשימות נכנסות לאותו קונטקסט' : 'All tasks load into the same context'}
            </p>
            <div className="space-y-2.5">
              {data.withoutBeat.contextSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-2.5"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: i < 2 ? '#fbbf24' : i < 4 ? '#f97316' : '#ef4444' }}
                  />
                  <span className="text-sm text-white/65">{step}</span>
                </motion.div>
              ))}
            </div>
            {/* Heat meter label */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.85 }}
              className="mt-6 rounded-xl border border-red-500/30 bg-red-500/8 px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
                <span className="text-xs font-mono text-red-400">
                  {isRTL ? 'זיכרון ראשי נשחק → פרויקטים קצרי טווח בלבד' : 'Main memory depleted → short-horizon projects only'}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════════════
          BEAT 2 — THE WITH
      ═══════════════════════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5 }}
        className="min-h-[85vh] flex flex-col justify-center px-6 py-20 border-t border-indigo-500/15 bg-indigo-500/3"
      >
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="text-[10px] tracking-[0.4em] text-indigo-400/70 uppercase font-mono mb-5"
        >
          {data.withBeat.kicker}
        </motion.p>

        <motion.h3
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-black mb-4 text-indigo-300 tracking-tight"
        >
          {data.withBeat.title}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-base sm:text-lg text-white/60 max-w-2xl mb-10 leading-relaxed"
        >
          {data.withBeat.body}
        </motion.p>

        {/* WITH diagram — clean main + agents each filling/closing */}
        <div className="flex flex-col sm:flex-row gap-10 items-start" dir="ltr">

          {/* Main context — stays clean */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <Brain size={14} className="text-indigo-400" />
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">
                {isRTL ? 'הקשר ראשי' : 'Main Context'}
              </span>
            </div>
            <ContextGauge label={isRTL ? 'נקי' : 'CLEAN'} fillPercent={18} isHot={false} animated={true} />
            <div
              className="px-3 py-1.5 rounded border border-indigo-500/30 bg-indigo-500/10 text-center"
              style={{ maxWidth: '100px' }}
            >
              <span className="text-[9px] font-mono text-indigo-400 block">COHERENT</span>
              <span className="text-[9px] font-mono text-indigo-400/60">full project</span>
            </div>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-center self-center pt-4 sm:pt-0"
          >
            <ArrowRight size={20} className="text-indigo-500/50" />
          </motion.div>

          {/* Agent bubbles */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono text-white/35 uppercase tracking-widest mb-4">
              {isRTL ? 'כל סוכן עובד בקונטקסט מבודד משלו' : 'Each agent works in its own isolated context'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {data.withBeat.agentLabels.map((label, i) => (
                <AgentBubble
                  key={i}
                  label={label}
                  task={data.withBeat.agentTasks[i] ?? ''}
                  delay={0.35 + i * 0.15}
                  accentColor="rgba(129,140,248,0.8)"
                />
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.85 }}
              className="mt-6 rounded-xl border border-indigo-500/25 bg-indigo-500/8 px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <Shield size={12} className="text-indigo-400" />
                <span className="text-xs font-mono text-indigo-300">
                  {isRTL ? 'הקשר ראשי נשאר פתוח לכל משך הפרויקט' : 'Main context stays open for the entire project lifetime'}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════════════
          BEAT 3 — THE HANDOFF
      ═══════════════════════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5 }}
        className="min-h-[85vh] flex flex-col justify-center px-6 py-20 border-t border-white/5"
      >
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="text-[10px] tracking-[0.4em] text-violet-400/70 uppercase font-mono mb-5"
        >
          {data.handoffBeat.kicker}
        </motion.p>

        <motion.h3
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-black mb-4 text-violet-300 tracking-tight"
        >
          {data.handoffBeat.title}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-base sm:text-lg text-white/60 max-w-2xl mb-10 leading-relaxed"
        >
          {data.handoffBeat.body}
        </motion.p>

        {/* Handoff brief visual */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start" dir="ltr">

          {/* Left: orchestrator with brief items */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="rounded-xl border border-violet-500/30 bg-violet-500/8 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Brain size={14} className="text-violet-400" />
                <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">
                  {isRTL ? 'מה הסוכן מקבל' : 'What the agent receives'}
                </span>
              </div>
              <div className="space-y-2">
                {data.handoffBeat.briefItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.25 + i * 0.08 }}
                    className="flex items-center gap-2.5"
                  >
                    <FileText size={11} className="text-violet-400/70 flex-shrink-0" />
                    <span className="text-sm text-white/70">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: what's NOT included */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
          >
            <div className="rounded-xl border border-white/10 bg-white/3 p-5">
              <div className="flex items-center gap-2 mb-4">
                <GitBranch size={14} className="text-white/40" />
                <span className="text-xs font-bold text-white/40 uppercase tracking-wider">
                  {isRTL ? 'מה הסוכן לא מקבל' : 'What the agent does NOT get'}
                </span>
              </div>
              <p className="text-sm text-white/45 leading-relaxed font-mono">{data.handoffBeat.notIncluded}</p>
              <div className="mt-4 rounded-lg border border-white/8 bg-black/25 p-3">
                <span className="text-[10px] font-mono text-white/30 block">
                  {isRTL ? '→ פחות טוקנים. יותר מיקוד. תוצאות טובות יותר.' : '→ Fewer tokens. More focus. Better output.'}
                </span>
              </div>
            </div>

            {/* Brief arrow flow */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg border border-violet-500/20 bg-violet-500/5"
            >
              <Sparkles size={11} className="text-violet-400 flex-shrink-0" />
              <span className="text-xs font-mono text-violet-300/70">
                {isRTL ? 'context isolation = איזולציה מלאה. כל סוכן מתחיל טרי.' : 'context isolation = full isolation. Every agent starts fresh.'}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════════════
          BEAT 4 — THE PAYOFF
      ═══════════════════════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5 }}
        className="min-h-[85vh] flex flex-col justify-center items-center px-6 py-20 border-t border-indigo-500/20 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="text-[10px] tracking-[0.4em] text-indigo-400/70 uppercase font-mono mb-5"
        >
          {data.payoffBeat.kicker}
        </motion.p>

        <motion.h3
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black mb-5 leading-tight pb-1 bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent"
        >
          {data.payoffBeat.title}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl text-white/65 max-w-2xl mb-10 leading-relaxed"
        >
          {data.payoffBeat.body}
        </motion.p>

        {/* Slide 5 callback quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-xl mb-10 rounded-xl border border-amber-500/25 bg-amber-500/6 px-6 py-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap size={12} className="text-amber-400" />
            <span className="text-[10px] font-mono text-amber-400/60 uppercase tracking-widest">
              {isRTL ? 'שקופית 5 — מלכודת הדחיסה' : 'Slide 5 — The Compaction Trap'}
            </span>
          </div>
          <p className="text-sm text-amber-300/75 italic leading-relaxed">"{data.payoffBeat.callbackQuote}"</p>
        </motion.div>

        {/* Resolution */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45 }}
          className="max-w-xl mb-10 rounded-xl border border-indigo-500/30 bg-indigo-500/8 px-6 py-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Shield size={12} className="text-indigo-400" />
            <span className="text-[10px] font-mono text-indigo-400/60 uppercase tracking-widest">
              {isRTL ? 'ארכיטקטורת הפתרון' : 'The Solution Architecture'}
            </span>
          </div>
          <p className="text-base text-white/80 font-medium leading-relaxed">{data.payoffBeat.resolution}</p>
        </motion.div>

        {/* Provider-agnostic footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/10 bg-white/4"
        >
          <Sparkles size={12} className="text-white/50" />
          <span className="text-sm font-mono text-white/50 italic">{data.payoffBeat.providerLine}</span>
        </motion.div>
      </motion.section>

    </div>
  );
}
