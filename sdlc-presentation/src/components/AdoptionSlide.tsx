import React from 'react';
import { motion } from 'framer-motion';
import {
  Wrench, Zap, Brain, FileCheck, ShieldCheck,
  Users, Tag, GitBranch, Calendar, BarChart2,
  Search, Sliders, BookOpen, TrendingUp, RefreshCw,
  ExternalLink,
} from 'lucide-react';

// ── Icon registry ─────────────────────────────────────────────────────────────
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Wrench, Zap, Brain, FileCheck, ShieldCheck,
  Users, Tag, GitBranch, Calendar, BarChart2,
  Search, Sliders, BookOpen, TrendingUp, RefreshCw,
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface AdoptionCapability {
  icon: string;
  label: string;
  toolingLink?: boolean;
  toolBadge?: string;
}

interface AdoptionPhase {
  number: string;
  name: string;
  timeline: string;
  claim: string;
  color: string;
  capabilities: AdoptionCapability[];
  terminalLines?: string[];
  vignette: 'cockpit' | 'teamTopology' | 'compoundChart';
  milestone: string;
}

interface AdoptionMetric {
  icon: string;
  value: string;
  label: string;
  color: string;
}

interface AdoptionSlideData {
  type: string;
  scrollable: boolean;
  title: string;
  subtitle: string;
  phases: AdoptionPhase[];
  metrics: AdoptionMetric[];
  closingQuote: string;
}

interface AdoptionSlideProps {
  data: AdoptionSlideData;
  lang: 'en' | 'he';
  onNavigateTo?: (slideType: string) => void;
}

// ── Color maps (all literal Tailwind strings) ─────────────────────────────────
const phaseColors: Record<string, {
  text: string; border: string; bg: string;
  badgeBg: string; badgeText: string;
  milestoneBorder: string; milestoneBg: string;
  number: string;
}> = {
  emerald: {
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
    milestoneBorder: 'border-emerald-500/30',
    milestoneBg: 'bg-emerald-500/10',
    number: 'text-emerald-500/15',
  },
  blue: {
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
    badgeBg: 'bg-blue-500/20',
    badgeText: 'text-blue-300',
    milestoneBorder: 'border-blue-500/30',
    milestoneBg: 'bg-blue-500/10',
    number: 'text-blue-500/15',
  },
  violet: {
    text: 'text-violet-400',
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/10',
    badgeBg: 'bg-violet-500/20',
    badgeText: 'text-violet-300',
    milestoneBorder: 'border-violet-500/30',
    milestoneBg: 'bg-violet-500/10',
    number: 'text-violet-500/15',
  },
};

const metricColors: Record<string, { border: string; bg: string; valueText: string }> = {
  emerald: { border: 'border-emerald-500/25', bg: 'bg-emerald-500/8', valueText: 'text-emerald-300' },
  teal:    { border: 'border-teal-500/25',    bg: 'bg-teal-500/8',    valueText: 'text-teal-300' },
  blue:    { border: 'border-blue-500/25',    bg: 'bg-blue-500/8',    valueText: 'text-blue-300' },
  violet:  { border: 'border-violet-500/25',  bg: 'bg-violet-500/8',  valueText: 'text-violet-300' },
};

const toolBadgeStyles: Record<string, string> = {
  confluence: 'bg-blue-600/20 text-blue-300 border border-blue-500/30',
  jira:       'bg-blue-500/20 text-blue-200 border border-blue-400/30',
  github:     'bg-slate-600/20 text-slate-300 border border-slate-500/30',
  playwright: 'bg-green-600/20 text-green-300 border border-green-500/30',
};
const toolBadgeLabels: Record<string, string> = {
  confluence: 'Confluence',
  jira: 'Jira',
  github: 'GitHub',
  playwright: 'Playwright',
};

// ── Sub-components ────────────────────────────────────────────────────────────

function ToolBadge({ name }: { name: string }) {
  return (
    <span
      dir="ltr"
      className={`inline-block text-[9px] font-mono tracking-wide px-1.5 py-0.5 rounded ${
        toolBadgeStyles[name] || 'bg-white/10 text-white/40 border border-white/10'
      }`}
    >
      {toolBadgeLabels[name] || name}
    </span>
  );
}

function CockpitVignette({ lines }: { lines: string[] }) {
  return (
    <div dir="ltr" className="w-full bg-slate-950 rounded-xl border border-emerald-500/20 p-4 font-mono text-xs">
      <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-slate-800">
        <div className="w-2 h-2 rounded-full bg-red-500/60" />
        <div className="w-2 h-2 rounded-full bg-amber-500/60" />
        <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
        <span className="ml-2 text-slate-500 text-[10px]">mission-control — pre-flight</span>
      </div>
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 + i * 0.18 }}
          className={`py-0.5 ${
            line.startsWith('✓') ? 'text-emerald-400' :
            line.startsWith('→') ? 'text-blue-400' :
            'text-slate-400'
          }`}
        >
          {line}
        </motion.div>
      ))}
    </div>
  );
}

function TeamTopologyVignette() {
  const agents = ['Backend', 'Frontend', 'QA', 'Docs'];
  return (
    <div dir="ltr" className="w-full flex flex-col items-center gap-3 py-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/40 text-blue-300 text-sm font-bold"
      >
        🎯 Orchestrator
      </motion.div>
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="w-px h-5 bg-blue-400/40 origin-top"
      />
      <div className="flex flex-wrap justify-center gap-2">
        {agents.map((agent, i) => (
          <motion.div
            key={agent}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs"
          >
            🤖 {agent}
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.85 }}
        className="text-blue-400/60 text-xs font-mono mt-1"
      >
        30%+ tickets → AI this sprint
      </motion.div>
    </div>
  );
}

function CompoundChartVignette() {
  const bars = [
    { label: 'W1', h: 16, color: 'bg-violet-500/40' },
    { label: 'W2', h: 28, color: 'bg-violet-500/50' },
    { label: 'W4', h: 42, color: 'bg-violet-500/60' },
    { label: 'M2', h: 62, color: 'bg-violet-400/70' },
    { label: 'M3', h: 90, color: 'bg-violet-400/85' },
  ];
  return (
    <div dir="ltr" className="w-full flex flex-col items-center gap-2 py-6">
      <div className="flex items-end gap-3 h-24 mb-1">
        {bars.map((bar, i) => (
          <div key={bar.label} className="flex flex-col items-center gap-1.5">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: bar.h }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.6, ease: 'easeOut' }}
              className={`w-10 rounded-t ${bar.color}`}
            />
            <span className="text-slate-500 text-[10px] font-mono">{bar.label}</span>
          </div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.0 }}
        className="text-violet-400/70 text-xs font-mono"
      >
        velocity ↑↑ compounds over time
      </motion.div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AdoptionSlide({ data, lang, onNavigateTo }: AdoptionSlideProps) {
  const isRTL = lang === 'he';

  return (
    <div className="w-full max-w-5xl mx-auto">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="min-h-screen flex flex-col items-center justify-center py-24 px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs tracking-[0.3em] text-emerald-400/70 uppercase font-mono mb-4"
        >
          {isRTL ? 'שלב 5 · אימוץ' : 'ACT 5 · ADOPTION'}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-emerald-400 via-blue-400 to-violet-400 bg-clip-text text-transparent leading-tight"
        >
          {data.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-base text-white/50 max-w-xl mx-auto mb-14"
        >
          {data.subtitle}
        </motion.p>

        {/* Journey spine — always LTR, left→right metaphor */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          dir="ltr"
          className="flex items-start max-w-sm mx-auto mb-14 w-full"
        >
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="w-4 h-4 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
            <span className="text-[11px] text-emerald-400/80 font-mono whitespace-nowrap">01 Foundation</span>
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="flex-1 h-px bg-gradient-to-r from-emerald-400/50 to-blue-400/50 origin-left mt-2 mx-2"
          />
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="w-4 h-4 rounded-full bg-blue-400 ring-4 ring-blue-400/20" />
            <span className="text-[11px] text-blue-400/80 font-mono whitespace-nowrap">02 Scale</span>
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="flex-1 h-px bg-gradient-to-r from-blue-400/50 to-violet-400/50 origin-left mt-2 mx-2"
          />
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="w-4 h-4 rounded-full bg-violet-400 ring-4 ring-violet-400/20" />
            <span className="text-[11px] text-violet-400/80 font-mono whitespace-nowrap">03 Optimize</span>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9 }}
          className="flex flex-col items-center gap-1.5 text-white/30"
        >
          <span className="text-xs">{isRTL ? 'גלול למטה לכל שלב' : 'Scroll to walk each phase'}</span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="text-xl"
          >↓</motion.div>
        </motion.div>
      </div>

      {/* ── Phase sections ─────────────────────────────────────────────────── */}
      {data.phases.map((phase) => {
        const colors = phaseColors[phase.color] || phaseColors.emerald;

        return (
          <motion.section
            key={phase.number}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="min-h-screen flex flex-col justify-center py-20 px-6"
          >
            {/* Phase divider line */}
            <div className={`flex items-center gap-4 mb-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`h-px flex-1 border-t ${colors.border}`} />
              <span className={`text-[11px] font-mono tracking-[0.25em] ${colors.text} uppercase shrink-0`}>
                {isRTL ? 'שלב' : 'Phase'} {phase.number}
              </span>
              <div className={`h-px flex-1 border-t ${colors.border}`} />
            </div>

            {/* Two-column layout */}
            <div className={`flex flex-col md:flex-row items-start gap-10 lg:gap-16 ${isRTL ? 'md:flex-row-reverse' : ''}`}>

              {/* LEFT: Text column */}
              <div className="flex-1 relative">
                {/* Faded large number */}
                <div
                  className={`absolute -top-10 text-9xl font-black ${colors.number} leading-none select-none pointer-events-none ${isRTL ? '-right-3' : '-left-3'}`}
                >
                  {phase.number}
                </div>

                <div className="relative">
                  {/* Timeline badge */}
                  <span
                    dir="ltr"
                    className={`inline-block text-xs font-mono px-3 py-1 rounded-full ${colors.badgeBg} ${colors.badgeText} mb-4`}
                  >
                    {phase.timeline}
                  </span>

                  {/* Phase name */}
                  <h3 className={`text-2xl sm:text-3xl font-black ${colors.text} mb-3 leading-tight ${isRTL ? 'text-right' : ''}`}>
                    {phase.name}
                  </h3>

                  {/* Bold claim — single anchor sentence */}
                  <p className={`text-white/75 text-lg font-semibold italic mb-8 leading-relaxed ${isRTL ? 'text-right' : ''}`}>
                    "{phase.claim}"
                  </p>

                  {/* Capability icon grid */}
                  <div className={`flex flex-wrap gap-4 ${isRTL ? 'justify-end' : ''}`}>
                    {phase.capabilities.map((cap, capIdx) => {
                      const IconComponent = iconMap[cap.icon];
                      return (
                        <motion.div
                          key={capIdx}
                          initial={{ opacity: 0, y: 14 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + capIdx * 0.1 }}
                          className="flex flex-col items-center gap-1.5"
                          style={{ minWidth: '72px', maxWidth: '90px' }}
                        >
                          <div className={`p-2.5 rounded-xl ${colors.bg} border ${colors.border}`}>
                            {IconComponent && (
                              <IconComponent size={20} className={colors.text} />
                            )}
                          </div>
                          <span className="text-white/55 text-[11px] text-center leading-tight">
                            {cap.label}
                          </span>
                          {cap.toolBadge && <ToolBadge name={cap.toolBadge} />}
                          {cap.toolingLink && onNavigateTo && (
                            <button
                              onClick={() => onNavigateTo('tooling')}
                              className="text-emerald-300 text-[10px] flex items-center gap-0.5 hover:text-emerald-200 transition-colors underline underline-offset-2 font-mono mt-0.5"
                            >
                              {isRTL ? 'ראה כלים' : 'See toolkit'}
                              <ExternalLink size={9} />
                            </button>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* RIGHT: Vignette */}
              <div className="flex-1 flex items-center justify-center">
                {phase.vignette === 'cockpit' && phase.terminalLines && (
                  <CockpitVignette lines={phase.terminalLines} />
                )}
                {phase.vignette === 'teamTopology' && <TeamTopologyVignette />}
                {phase.vignette === 'compoundChart' && <CompoundChartVignette />}
              </div>
            </div>

            {/* Milestone strip */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className={`mt-10 flex items-center gap-3 px-5 py-3.5 rounded-xl border ${colors.milestoneBorder} ${colors.milestoneBg} ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <span className={`shrink-0 text-lg ${colors.text}`}>★</span>
              <span className={`text-white/70 text-sm font-medium leading-snug ${isRTL ? 'text-right' : ''}`}>
                {phase.milestone}
              </span>
            </motion.div>
          </motion.section>
        );
      })}

      {/* ── Compounding strip ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        className="px-6 py-10 text-center"
      >
        <div dir="ltr" className="inline-flex items-center gap-3 text-xs text-white/30 font-mono">
          <span className="text-emerald-400/60">Risk ↓</span>
          <span className="text-white/15">────</span>
          <span className="text-blue-400/60">Coverage ↑</span>
          <span className="text-white/15">────</span>
          <span className="text-violet-400/60">Velocity ↑↑</span>
        </div>
      </motion.div>

      {/* ── Metrics grid ─────────────────────────────────────────────────── */}
      <div className="px-6 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {data.metrics.map((metric, i) => {
            const mc = metricColors[metric.color] || metricColors.blue;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`${mc.bg} border ${mc.border} rounded-xl p-5 text-center`}
              >
                <div className="text-2xl mb-1">{metric.icon}</div>
                <div className={`text-3xl font-black ${mc.valueText} mb-1`}>{metric.value}</div>
                <div className="text-white/45 text-xs leading-tight">{metric.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Closing quote ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        className="px-6 pb-24 text-center"
      >
        <p className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-emerald-400 via-blue-400 to-violet-400 bg-clip-text text-transparent leading-tight">
          "{data.closingQuote}"
        </p>
      </motion.div>
    </div>
  );
}
