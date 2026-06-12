import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface TerminalLine {
  kind: 'you' | 'agent' | 'cmd' | 'sys';
  time?: string;
  text: string;
  result?: string;
  tone?: 'warn' | 'fail';
}

interface Chapter {
  number: string;
  name: string;
  accent: string;
}

interface SecondFeatureSlideProps {
  data: {
    kicker: string;
    title: string;
    subtitle: string;
    scrollHint: string;
    chapters: Chapter[];
    chapter1: {
      label: string;
      headline: string;
      setup: string[];
      terminal: { windowTitle: string; lines: TerminalLine[] };
      meter: { to: number; unit: string; caption: string };
      invoice: {
        title: string;
        items: Array<{ hours: string; label: string }>;
        total: { hours: string; label: string };
      };
      callout: { stat: string; text: string };
    };
    chapter2: {
      label: string;
      headline: string;
      build: Array<{ value: string; label: string }>;
      debt: Array<{ value: string; label: string }>;
      graveyard: { count: number; youAreHereLabel: string; stamp: string };
      stats: Array<{ value: string; label: string }>;
      bottomLine: string;
    };
  };
  lang: 'en' | 'he';
}

const accentMap: Record<string, { text: string; border: string; bg: string; badge: string }> = {
  amber: {
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/5',
    badge: 'bg-amber-500/20 text-amber-300',
  },
  red: {
    text: 'text-red-400',
    border: 'border-red-500/30',
    bg: 'bg-red-500/5',
    badge: 'bg-red-500/20 text-red-300',
  },
};

function TerminalLineRow({ line, index }: { line: TerminalLine; index: number }) {
  const delay = 0.15 + index * 0.12;

  if (line.kind === 'sys') {
    const isFail = line.tone === 'fail';
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={isFail ? { opacity: 1, x: [0, -2, 2, -1, 1, 0] } : { opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className={`my-1.5 px-3 py-1.5 text-[11px] sm:text-xs ${
          isFail
            ? 'bg-red-500/10 border-l-2 border-red-500/50 text-red-300'
            : 'bg-amber-500/10 border-l-2 border-amber-500/50 text-amber-300'
        }`}
      >
        {line.time && <span className="opacity-50 mr-2">[{line.time}]</span>}
        <span className="font-semibold">{line.text}</span>
      </motion.div>
    );
  }

  if (line.kind === 'cmd') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="pl-14 text-[11px] sm:text-xs"
      >
        <span className="text-green-400">$ {line.text}</span>
        {line.result && <span className="text-slate-500 ml-3">{line.result}</span>}
      </motion.div>
    );
  }

  const isYou = line.kind === 'you';
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="flex items-start gap-2 text-[11px] sm:text-xs leading-relaxed"
    >
      {line.time && <span className="text-slate-600 shrink-0">[{line.time}]</span>}
      <span className={`shrink-0 font-semibold ${isYou ? 'text-blue-300' : 'text-violet-300'}`}>
        {isYou ? 'you' : 'agent'} ▸
      </span>
      <span className={isYou ? 'text-slate-200' : 'text-slate-300'}>{line.text}</span>
    </motion.div>
  );
}

function TaxMeter({ to, unit, caption }: { to: number; unit: string; caption: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const started = useRef(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      onViewportEnter={() => {
        if (started.current) return;
        started.current = true;
        animate(count, to, { duration: 2, ease: 'easeOut' });
      }}
      className="bg-amber-500/5 border border-amber-500/30 rounded-2xl px-8 py-6 text-center"
    >
      <div className="flex items-baseline justify-center gap-2 mb-2">
        <motion.span className="text-6xl font-black text-amber-400">{rounded}</motion.span>
        <span className="text-2xl font-bold text-amber-400">{unit}</span>
      </div>
      <p className="text-white/45 text-xs leading-relaxed max-w-[220px] mx-auto">{caption}</p>
    </motion.div>
  );
}

function SessionGraveyard({
  count,
  youAreHereLabel,
  stamp,
}: {
  count: number;
  youAreHereLabel: string;
  stamp: string;
}) {
  const chips = Array.from({ length: count }, (_, i) => i + 1);

  return (
    <div dir="ltr" className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-w-3xl mx-auto">
      {chips.map((n, idx) => (
        <motion.div
          key={n}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.02, duration: 0.3 }}
          className="relative rounded border border-slate-700 bg-slate-900 px-1.5 py-1.5"
        >
          <div className="flex items-center gap-0.5 mb-1">
            <motion.span
              initial={{ backgroundColor: '#22c55e' }}
              whileInView={{ backgroundColor: '#475569' }}
              viewport={{ once: true }}
              transition={{ delay: 1.2 + idx * 0.02, duration: 0.4 }}
              className="w-1 h-1 rounded-full"
            />
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="w-1 h-1 rounded-full bg-slate-700" />
          </div>
          <div className="font-mono text-[8px] text-slate-600">#{String(n).padStart(2, '0')}</div>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.4 + idx * 0.02 }}
            className="absolute inset-0 flex items-center justify-center font-mono font-black text-[8px] text-red-500/80 -rotate-6 select-none"
          >
            {stamp}
          </motion.span>
        </motion.div>
      ))}
      {/* The survivor — session #51, the one from the terminal above */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: count * 0.02 + 0.3, duration: 0.4 }}
        className="relative col-span-2 rounded border border-amber-500/50 bg-amber-500/10 px-1.5 py-1.5"
      >
        <div className="flex items-center gap-0.5 mb-1">
          <span className="w-1 h-1 rounded-full bg-amber-400" />
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span className="w-1 h-1 rounded-full bg-slate-700" />
        </div>
        <div className="font-mono text-[8px] text-amber-400">
          #{count + 1} · {youAreHereLabel}
        </div>
      </motion.div>
    </div>
  );
}

export default function SecondFeatureSlide({ data }: SecondFeatureSlideProps) {
  const { chapter1, chapter2 } = data;
  const terminalLines = chapter1.terminal.lines;

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* ── BEAT 0: Cinematic intro ── */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-[11px] font-mono tracking-[0.35em] text-white/35 uppercase mb-5"
        >
          {data.kicker}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl sm:text-7xl font-black mb-6 bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent leading-tight pb-2"
        >
          {data.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-lg sm:text-xl text-white/60 max-w-2xl mb-14 leading-relaxed"
        >
          {data.subtitle}
        </motion.p>

        {/* Two-chapter roadmap (slide-4 danger callback survives here) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center mb-14"
        >
          {data.chapters.map((chapter, idx) => {
            const colors = accentMap[chapter.accent] || accentMap.amber;
            return (
              <React.Fragment key={chapter.number}>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + idx * 0.25 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`shrink-0 flex items-center justify-center w-[28px] h-[28px] rounded-full border-2 ${colors.border} ${colors.bg}`}
                  >
                    <span className={`font-mono font-black text-[10px] ${colors.text}`}>
                      {chapter.number}
                    </span>
                  </div>
                  <span className={`font-black tracking-wide text-sm sm:text-base ${colors.text}`}>
                    {chapter.name}
                  </span>
                </motion.div>
                {idx < data.chapters.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ delay: 0.75 }}
                    className="w-px h-10 my-1.5"
                    style={{ background: 'linear-gradient(180deg, #fbbf24, #ef4444)' }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col items-center gap-2 text-white/35"
        >
          <span className="text-sm">{data.scrollHint}</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-2xl"
          >
            ↓
          </motion.div>
        </motion.div>
      </div>

      {/* ── BEAT 1: Chapter 01 scene-setting ── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5 }}
        className="relative min-h-[70vh] flex flex-col justify-center px-6 py-16 border-t border-white/5"
      >
        <div className="absolute inset-0 flex items-center justify-end pr-4 sm:pr-12 pointer-events-none select-none overflow-hidden">
          <span className="text-[18vw] font-black text-amber-400" style={{ opacity: 0.022, lineHeight: 1 }}>
            01
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="flex items-center gap-3 mb-4 flex-wrap"
        >
          <span className="text-[10px] font-mono tracking-[0.3em] text-amber-400 uppercase">
            {data.chapters[0].number} · {chapter1.label}
          </span>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-black mb-8 tracking-tight text-white"
        >
          {chapter1.headline}
        </motion.h3>

        <div className="space-y-3 max-w-2xl">
          {chapter1.setup.map((line, idx) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 + idx * 0.15 }}
              className="text-base sm:text-lg text-white/65 leading-relaxed"
            >
              {line}
            </motion.p>
          ))}
        </div>
      </motion.section>

      {/* ── BEAT 2: Session #51 terminal + tax meter ── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col justify-center px-6 py-16 border-t border-white/5"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
          {/* Terminal — forced LTR regardless of deck language */}
          <div
            dir="ltr"
            className="text-left bg-slate-950 rounded-xl border border-slate-700 overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border-b border-slate-700">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs text-slate-400 font-mono">
                {chapter1.terminal.windowTitle}
              </span>
            </div>
            <div className="p-4 font-mono space-y-2">
              {terminalLines.map((line, idx) => (
                <TerminalLineRow key={idx} line={line} index={idx} />
              ))}
              {/* The session that never starts the work */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + terminalLines.length * 0.12 }}
                className="pt-1"
              >
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 1.1 }}
                  className="inline-block w-2 h-4 bg-slate-300/70 align-middle"
                />
              </motion.div>
            </div>
          </div>

          {/* Tax meter */}
          <TaxMeter to={chapter1.meter.to} unit={chapter1.meter.unit} caption={chapter1.meter.caption} />
        </div>
      </motion.section>

      {/* ── BEAT 3: The invoice + 73% callout ── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5 }}
        className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-16 border-t border-white/5"
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-xl bg-slate-900/80 border border-slate-700 rounded-xl p-6 font-mono mb-20"
        >
          <div className="text-[10px] tracking-[0.25em] text-white/40 uppercase mb-5">
            {chapter1.invoice.title}
          </div>
          {chapter1.invoice.items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + idx * 0.15 }}
              className="flex items-baseline justify-between gap-4 py-2.5 border-t border-dashed border-slate-700 text-xs sm:text-sm"
            >
              <span className="text-white/60">{item.label}</span>
              <span className="text-white/80 font-semibold shrink-0">{item.hours}</span>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="flex items-baseline justify-between gap-4 py-3 mt-1 border-t border-amber-500/40 text-sm sm:text-base"
          >
            <span className="text-amber-300 font-bold uppercase tracking-wide">
              {chapter1.invoice.total.label}
            </span>
            <span className="text-amber-400 font-black shrink-0">{chapter1.invoice.total.hours}</span>
          </motion.div>
        </motion.div>

        {/* The kill stat */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl"
        >
          <div className="text-7xl sm:text-8xl font-black text-red-500 mb-4">
            {chapter1.callout.stat}
          </div>
          <p className="text-lg sm:text-xl text-white/65 leading-relaxed">{chapter1.callout.text}</p>
        </motion.div>
      </motion.section>

      {/* ── BEAT 4: Chapter 02 — the zoom-out ── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5 }}
        className="relative min-h-screen flex flex-col justify-center px-6 py-16 border-t border-red-500/15 bg-red-500/[0.02]"
      >
        <div className="absolute inset-0 flex items-center justify-end pr-4 sm:pr-12 pointer-events-none select-none overflow-hidden">
          <span className="text-[18vw] font-black text-red-400" style={{ opacity: 0.022, lineHeight: 1 }}>
            02
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="flex items-center gap-3 mb-4 flex-wrap"
        >
          <span className="text-[10px] font-mono tracking-[0.3em] text-red-400 uppercase">
            {data.chapters[1].number} · {chapter2.label}
          </span>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-black mb-10 tracking-tight text-white"
        >
          {chapter2.headline}
        </motion.h3>

        {/* Build vs debt counters */}
        <div className="grid grid-cols-3 gap-3 max-w-3xl mx-auto w-full mb-4">
          {chapter2.build.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + idx * 0.12 }}
              className="text-center bg-cyan-500/5 border border-cyan-500/25 rounded-xl px-3 py-4"
            >
              <div className="text-2xl sm:text-3xl font-black text-cyan-400">{item.value}</div>
              <div className="text-[11px] text-white/45 mt-1">{item.label}</div>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 max-w-3xl mx-auto w-full mb-12">
          {chapter2.debt.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + idx * 0.12 }}
              className="text-center bg-red-500/5 border border-red-500/25 rounded-xl px-3 py-4"
            >
              <div className="text-2xl sm:text-3xl font-black text-red-400">{item.value}</div>
              <div className="text-[11px] text-white/45 mt-1">{item.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Session graveyard */}
        <SessionGraveyard
          count={chapter2.graveyard.count}
          youAreHereLabel={chapter2.graveyard.youAreHereLabel}
          stamp={chapter2.graveyard.stamp}
        />
      </motion.section>

      {/* ── BEAT 5: Stats + flatline verdict ── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5 }}
        className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-16 pb-32 border-t border-white/5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full mb-16">
          {chapter2.stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="text-center bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-6"
            >
              <div className="text-3xl sm:text-4xl font-black text-red-400 mb-2">{stat.value}</div>
              <div className="text-xs text-white/50 leading-relaxed">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Flatline */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="h-px bg-red-500/60 w-full max-w-3xl mb-10"
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-xl sm:text-2xl text-white/80 italic font-light leading-relaxed text-center max-w-3xl"
        >
          "{chapter2.bottomLine}"
        </motion.p>
      </motion.section>
    </div>
  );
}
