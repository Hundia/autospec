import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Provider {
  id: string;
  name: string;
  icon: string;
  accent: 'indigo' | 'blue' | 'amber' | 'green';
  orchestratorModel: string;
  agentModel: string;
}

interface OrchestratorSlideProps {
  data: {
    title: string;
    subtitle?: string;
    providers: Provider[];
    orchestrator: {
      roleLabel: string;
      tasks: string[];
    };
    agents: Array<{
      roleLabel: string;
      task: string;
    }>;
    benefits: string[];
    callout?: string;
  };
  lang: 'en' | 'he';
}

const accentColors: Record<string, { border: string; bg: string; text: string; dot: string; gradientFrom: string; gradientTo: string }> = {
  indigo: {
    border: 'rgba(129,140,248,0.4)',
    bg: 'rgba(99,102,241,0.12)',
    text: '#a5b4fc',
    dot: '#818cf8',
    gradientFrom: 'rgba(99,102,241,0.20)',
    gradientTo: 'rgba(99,102,241,0.06)',
  },
  blue: {
    border: 'rgba(96,165,250,0.4)',
    bg: 'rgba(59,130,246,0.12)',
    text: '#93c5fd',
    dot: '#60a5fa',
    gradientFrom: 'rgba(59,130,246,0.20)',
    gradientTo: 'rgba(59,130,246,0.06)',
  },
  amber: {
    border: 'rgba(251,191,36,0.4)',
    bg: 'rgba(245,158,11,0.12)',
    text: '#fcd34d',
    dot: '#fbbf24',
    gradientFrom: 'rgba(245,158,11,0.20)',
    gradientTo: 'rgba(245,158,11,0.06)',
  },
  green: {
    border: 'rgba(74,222,128,0.4)',
    bg: 'rgba(34,197,94,0.12)',
    text: '#86efac',
    dot: '#4ade80',
    gradientFrom: 'rgba(34,197,94,0.20)',
    gradientTo: 'rgba(34,197,94,0.06)',
  },
};

export default function OrchestratorSlide({ data, lang }: OrchestratorSlideProps) {
  const defaultProvider = data.providers[0]?.id ?? 'claude';
  const [activeId, setActiveId] = useState<string>(defaultProvider);

  const activeProvider = data.providers.find((p) => p.id === activeId) ?? data.providers[0];
  const colors = accentColors[activeProvider.accent] ?? accentColors.indigo;

  const isRtl = lang === 'he';

  return (
    <div className="max-w-6xl mx-auto w-full">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-2">{data.title}</h2>
        {data.subtitle && (
          <p className="text-base text-white/50">{data.subtitle}</p>
        )}
      </motion.div>

      {/* Two-column layout */}
      <div className={`flex gap-5 ${isRtl ? 'flex-row-reverse' : 'flex-row'} items-start`}>

        {/* ── Provider Selector (left / right in RTL) ── */}
        <motion.div
          initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="w-44 flex-shrink-0 flex flex-col gap-2"
        >
          {data.providers.map((provider) => {
            const isActive = provider.id === activeId;
            const pc = accentColors[provider.accent] ?? accentColors.indigo;
            return (
              <button
                key={provider.id}
                onClick={() => setActiveId(provider.id)}
                className="w-full text-left rounded-xl p-3 border transition-all duration-300 cursor-pointer"
                style={
                  isActive
                    ? {
                        borderColor: pc.border,
                        backgroundColor: pc.bg,
                      }
                    : {
                        borderColor: 'rgba(255,255,255,0.08)',
                        backgroundColor: 'rgba(255,255,255,0.04)',
                      }
                }
              >
                <div className="flex items-center gap-2 mb-1">
                  {/* Pulsing active indicator */}
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300"
                    style={
                      isActive
                        ? { backgroundColor: pc.dot, animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' }
                        : { backgroundColor: 'rgba(255,255,255,0.15)' }
                    }
                  />
                  <span className="text-base">{provider.icon}</span>
                  <span
                    className="text-sm font-semibold transition-colors duration-300"
                    style={{ color: isActive ? pc.text : 'rgba(255,255,255,0.55)' }}
                  >
                    {provider.name}
                  </span>
                </div>
                <div className="pl-4 space-y-0.5">
                  <p className="text-xs font-mono truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    ↑ {provider.orchestratorModel}
                  </p>
                  <p className="text-xs font-mono truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    ↓ {provider.agentModel}
                  </p>
                </div>
              </button>
            );
          })}
        </motion.div>

        {/* ── Main Diagram (right column) ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">

          {/* Orchestrator card */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl p-5 border transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${colors.gradientFrom}, ${colors.gradientTo})`,
              borderColor: colors.border,
              transition: 'border-color 300ms, background 300ms',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: colors.dot, animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' }}
                />
                <h3 className="text-xl font-bold text-white">{data.orchestrator.roleLabel}</h3>
              </div>
              {/* Animated model badge */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-white/40 uppercase tracking-wide font-mono">Model:</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeProvider.id + '-orch'}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-mono font-semibold px-2 py-0.5 rounded"
                    style={{ color: colors.text, backgroundColor: 'rgba(0,0,0,0.25)' }}
                  >
                    {activeProvider.orchestratorModel}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.orchestrator.tasks.map((task, idx) => (
                <span
                  key={idx}
                  className="bg-black/20 rounded px-3 py-1.5 text-sm font-mono text-white/75"
                >
                  {task}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Flow arrows */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex justify-around text-xl font-bold"
            style={{ color: colors.text, transition: 'color 300ms' }}
          >
            {data.agents.map((_, idx) => (
              <span key={idx} style={{ opacity: 0.6 }}>↓</span>
            ))}
          </motion.div>

          {/* Agent cards */}
          <div className="grid grid-cols-3 gap-3">
            {data.agents.map((agent, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.15 }}
                className="rounded-xl p-4 border transition-all duration-300"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.bg,
                  transition: 'border-color 300ms, background-color 300ms',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: colors.dot }}
                  />
                  <h4 className="text-sm font-bold text-white">{agent.roleLabel}</h4>
                </div>
                <p className="text-xs text-white/55 font-mono mb-3 leading-relaxed">{agent.task}</p>
                {/* Animated model badge */}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeProvider.id + '-agent-' + idx}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="inline-block text-xs font-mono font-semibold px-2 py-0.5 rounded"
                    style={{ color: colors.text, backgroundColor: 'rgba(0,0,0,0.25)' }}
                  >
                    {activeProvider.agentModel}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Benefits bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-2 justify-center"
          >
            {data.benefits.map((benefit, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-full text-sm border transition-all duration-300"
                style={{
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.bg,
                  transition: 'border-color 300ms, background-color 300ms, color 300ms',
                }}
              >
                {benefit}
              </span>
            ))}
          </motion.div>

          {/* Callout */}
          {data.callout && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-center rounded-xl border py-3 px-4"
              style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.04)' }}
            >
              <p className="text-sm text-white/50 italic">{data.callout}</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
