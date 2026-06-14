import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, UserCheck, History, ShieldCheck as SealIcon, type LucideIcon } from 'lucide-react';

interface Pillar {
  key: 'teal' | 'emerald' | 'blue' | 'violet';
  icon: 'spec' | 'guardrails' | 'human' | 'trail';
  ordinal: string;
  label: string;
  detail: string;
}

interface NotVibeCodingSlideProps {
  data: {
    title: string;
    subtitle: string;
    definitionLead: string;
    definitionTerm: string;
    pillars: Pillar[];
    verdict: string;
  };
  lang: 'en' | 'he';
}

const iconMap: Record<Pillar['icon'], LucideIcon> = {
  spec: FileText,
  guardrails: ShieldCheck,
  human: UserCheck,
  trail: History,
};

// Literal class strings only — no dynamic construction.
const accentMap: Record<
  Pillar['key'],
  { border: string; text: string; iconBg: string; rail: string; glow: string }
> = {
  teal: {
    border: 'border-teal-400/25',
    text: 'text-teal-300',
    iconBg: 'bg-teal-500/15',
    rail: 'bg-teal-400/60',
    glow: 'rgba(45,212,191,0.16)',
  },
  emerald: {
    border: 'border-emerald-400/25',
    text: 'text-emerald-300',
    iconBg: 'bg-emerald-500/15',
    rail: 'bg-emerald-400/60',
    glow: 'rgba(52,211,153,0.16)',
  },
  blue: {
    border: 'border-blue-400/25',
    text: 'text-blue-300',
    iconBg: 'bg-blue-500/15',
    rail: 'bg-blue-400/60',
    glow: 'rgba(96,165,250,0.16)',
  },
  violet: {
    border: 'border-violet-400/25',
    text: 'text-violet-300',
    iconBg: 'bg-violet-500/15',
    rail: 'bg-violet-400/60',
    glow: 'rgba(167,139,250,0.16)',
  },
};

export default function NotVibeCodingSlide({ data, lang }: NotVibeCodingSlideProps) {
  const isRTL = lang === 'he';

  return (
    <div className="max-w-6xl mx-auto w-full">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl sm:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-teal-300 via-emerald-300 to-blue-300 bg-clip-text text-transparent"
      >
        {data.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-center text-slate-400 text-base mb-6 max-w-2xl mx-auto"
      >
        {data.subtitle}
      </motion.p>

      {/* The charter: a definition plate on one side, the four clauses on the other */}
      <div
        className={`flex flex-col lg:flex-row gap-5 items-stretch ${
          isRTL ? 'lg:flex-row-reverse' : 'lg:flex-row'
        }`}
      >
        {/* ── Definition plate — names the practice (the "title page" of the charter) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
          className="relative lg:w-[34%] flex-shrink-0 rounded-2xl border border-emerald-400/25 px-6 py-7 overflow-hidden flex flex-col justify-center text-center"
          style={{
            background:
              'linear-gradient(150deg, rgba(45,212,191,0.12), rgba(96,165,250,0.08))',
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(70% 90% at 50% 0%, rgba(52,211,153,0.14), transparent 70%)',
            }}
          />
          <div className="relative mx-auto mb-4 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-300">
            <SealIcon className="w-7 h-7" strokeWidth={1.8} />
          </div>
          <p className="relative text-xs uppercase tracking-[0.22em] text-emerald-300/70 mb-2">
            {data.definitionLead}
          </p>
          <p className="relative text-2xl sm:text-3xl font-bold leading-tight bg-gradient-to-r from-teal-200 via-emerald-200 to-blue-200 bg-clip-text text-transparent">
            {data.definitionTerm}
          </p>
        </motion.div>

        {/* ── The four clauses — what it IS, read top to bottom like a contract ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {data.pillars.map((pillar, idx) => {
            const a = accentMap[pillar.key];
            const Icon = iconMap[pillar.icon];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.12, duration: 0.4 }}
                className={`group relative rounded-xl border ${a.border} bg-white/[0.03] overflow-hidden`}
              >
                <div
                  className="pointer-events-none absolute -top-8 -right-6 w-24 h-24 rounded-full blur-2xl"
                  style={{ background: a.glow }}
                />
                {/* accent rail */}
                <div
                  className={`absolute top-0 bottom-0 w-[3px] ${a.rail} ${
                    isRTL ? 'right-0' : 'left-0'
                  }`}
                />
                <div
                  className={`relative flex items-center gap-4 px-5 py-3.5 ${
                    isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-xl ${a.iconBg} ${a.text}`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <div
                      className={`flex items-baseline gap-2 ${
                        isRTL ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <span className={`font-mono text-xs ${a.text} opacity-70`} dir="ltr">
                        {pillar.ordinal}
                      </span>
                      <h3 className={`font-bold text-base ${a.text}`}>{pillar.label}</h3>
                    </div>
                    <p className="text-sm text-slate-300/80 leading-snug mt-0.5">
                      {pillar.detail}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Verdict — the quiet consequence, signed at the foot of the charter */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="flex justify-center mt-6"
      >
        <div
          className={`inline-flex items-center gap-2.5 rounded-full border border-emerald-400/25 bg-emerald-500/[0.08] px-5 py-2 ${
            isRTL ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 flex-shrink-0" />
          <p className="text-sm sm:text-base font-medium text-emerald-200/90 italic">
            {data.verdict}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
