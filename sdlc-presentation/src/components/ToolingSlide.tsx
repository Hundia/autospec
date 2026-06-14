import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface TerminalLine {
  text: string;
  type: 'command' | 'success' | 'error' | 'info';
}

interface Framework {
  id: string;
  glyph: string;
  name: string;
  short: string;
  role: string;
  accent: string;
  home?: boolean;
  tagline: string;
  whatItIs: string;
  bullets: string[];
  terminal: TerminalLine[];
  repo: string;
  cells: string[];
}

interface ComparePage {
  page: string;
  accent: string;
  label: string;
  eyebrow: string;
  thesis?: string;
  dimensions: string[];
  frameworks: Framework[];
}

interface PipelinePage {
  page: string;
  accent: string;
  label: string;
  eyebrow: string;
  headline: string;
  source: { id: string; title: string; status: string };
  stages: Array<{ n: string; verb: string; sub: string }>;
  terminal: TerminalLine[];
  callout: string;
}

interface MemoryPage {
  page: string;
  accent: string;
  label: string;
  eyebrow: string;
  headline: string;
  syncBadge: string;
  bullets: string[];
  tree: Array<{ name: string; depth: number; icon: string; files?: string[] }>;
  treeFooter: string;
  callout: string;
}

interface ToolingSlideProps {
  data: {
    kicker: string;
    title: string;
    subtitle: string;
    scrollHint: string;
    intro: { roadmap: Array<{ id: string; label: string; accent: string }> };
    specPage: ComparePage;
    guardPage: ComparePage;
    pipelinePage: PipelinePage;
    memoryPage: MemoryPage;
    closing: string;
  };
  lang: 'en' | 'he';
}

// ─────────────────────────────────────────────────────────────────────────────
// Literal accent maps (no dynamic class construction)
// ─────────────────────────────────────────────────────────────────────────────

const accentMap: Record<string, {
  text: string;
  border: string;
  bg: string;
  badge: string;
  ring: string;
  headBg: string;
  cellBg: string;
  stripe: string;
}> = {
  teal: {
    text: 'text-teal-400', border: 'border-teal-500/30', bg: 'bg-teal-500/5',
    badge: 'bg-teal-500/20 text-teal-300', ring: 'ring-teal-500/40',
    headBg: 'bg-teal-500/20', cellBg: 'bg-teal-500/[0.07]', stripe: 'bg-teal-500',
  },
  violet: {
    text: 'text-violet-400', border: 'border-violet-500/30', bg: 'bg-violet-500/5',
    badge: 'bg-violet-500/20 text-violet-300', ring: 'ring-violet-500/40',
    headBg: 'bg-violet-500/20', cellBg: 'bg-violet-500/[0.07]', stripe: 'bg-violet-500',
  },
  cyan: {
    text: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/5',
    badge: 'bg-cyan-500/20 text-cyan-300', ring: 'ring-cyan-500/40',
    headBg: 'bg-cyan-500/20', cellBg: 'bg-cyan-500/[0.07]', stripe: 'bg-cyan-500',
  },
  emerald: {
    text: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/5',
    badge: 'bg-emerald-500/20 text-emerald-300', ring: 'ring-emerald-500/40',
    headBg: 'bg-emerald-500/20', cellBg: 'bg-emerald-500/[0.07]', stripe: 'bg-emerald-500',
  },
};

const lineColors: Record<string, string> = {
  command: 'text-cyan-400',
  success: 'text-green-400',
  error: 'text-red-400',
  info: 'text-white/50',
};

function cellColor(cell: string): string {
  const c = cell.trim().charAt(0);
  if (c === '✓') return 'text-emerald-300';
  if (c === '~') return 'text-amber-400/80';
  if (c === '✗') return 'text-white/20';
  return 'text-white/55';
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared: mini terminal
// ─────────────────────────────────────────────────────────────────────────────

function MiniTerminal({ lines, stagger = 0.08 }: { lines: TerminalLine[]; stagger?: number }) {
  return (
    <div dir="ltr" className="bg-slate-950 rounded-lg border border-white/10 px-4 py-3 font-mono text-[11px] space-y-1 text-left">
      <div className="flex gap-1.5 mb-2">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
      </div>
      {lines.map((line, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + idx * stagger }}
          className={lineColors[line.type] || 'text-white/50'}
        >
          {line.text}
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section shell (label row + watermark)
// ─────────────────────────────────────────────────────────────────────────────

function SectionShell({
  accent, page, label, eyebrow, isRTL, children,
}: {
  accent: string; page: string; label: string; eyebrow: string; isRTL: boolean; children: React.ReactNode;
}) {
  const colors = accentMap[accent] || accentMap.teal;
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-[85vh] flex flex-col justify-center px-2 sm:px-6 py-16 border-t border-white/5"
    >
      <div className="absolute inset-0 flex items-center justify-end pr-4 sm:pr-12 pointer-events-none select-none overflow-hidden">
        <span className={`text-[18vw] font-black ${colors.text}`} style={{ opacity: 0.022, lineHeight: 1 }}>
          {page}
        </span>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.05 }}
        className="mb-5"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-mono tracking-[0.3em] ${colors.text} uppercase`}>
            {isRTL ? 'עמוד' : 'Page'} {page}
          </span>
          <span className="text-white/15">·</span>
          <span className="text-[11px] text-white/40 font-mono uppercase tracking-wider">{label}</span>
        </div>
        <p className="text-white/50 text-sm italic mt-1.5">{eyebrow}</p>
      </motion.div>
      {children}
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tabbed compare (Pages 1 & 2)
// ─────────────────────────────────────────────────────────────────────────────

function TabbedCompare({ data, isRTL }: { data: ComparePage; isRTL: boolean }) {
  const [active, setActive] = useState(0);
  const colors = accentMap[data.accent] || accentMap.teal;
  const fw = data.frameworks[active];

  return (
    <SectionShell accent={data.accent} page={data.page} label={data.label} eyebrow={data.eyebrow} isRTL={isRTL}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* LEFT: tabs + detail */}
        <div>
          {/* Tab rail */}
          <div className={`flex flex-wrap gap-2 mb-4 ${isRTL ? 'justify-end' : ''}`}>
            {data.frameworks.map((f, idx) => {
              const isActive = idx === active;
              const fc = accentMap[f.accent] || colors;
              return (
                <button
                  key={f.id}
                  onClick={() => setActive(idx)}
                  aria-pressed={isActive}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors ${
                    isActive
                      ? `${fc.bg} ${fc.text} ${fc.border}`
                      : 'bg-white/5 text-white/50 border-transparent hover:bg-white/10'
                  }`}
                >
                  <span>{f.glyph}</span>
                  <span>{f.short}</span>
                  {f.home && <span className={`text-[8px] px-1 py-0.5 rounded ${fc.badge} font-mono`}>{isRTL ? '★ הבית' : '★ HOME'}</span>}
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={fw.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`rounded-2xl border ${colors.border} ${colors.bg} p-4`}
            >
              <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-2xl">{fw.glyph}</span>
                <span className={`font-black text-lg ${colors.text}`}>{fw.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${colors.badge} font-mono`}>{fw.role}</span>
              </div>
              <p className="text-white/65 text-sm italic mb-3">"{fw.tagline}"</p>
              <p className="text-white/55 text-xs leading-relaxed mb-3">{fw.whatItIs}</p>
              <ul className="space-y-1.5 mb-4">
                {fw.bullets.map((b, bIdx) => (
                  <li key={bIdx} className={`flex items-start gap-2 text-xs text-white/70 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <span className={`shrink-0 mt-0.5 ${colors.text}`}>▸</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <MiniTerminal lines={fw.terminal} />
              <div className={`mt-3 flex ${isRTL ? 'justify-end' : ''}`}>
                <span className="text-[11px] font-mono text-white/40 bg-slate-900/70 border border-white/10 rounded px-2.5 py-1">
                  {fw.repo}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT: comparison table (LTR) */}
        <div dir="ltr" className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="text-[9px] font-mono uppercase tracking-wider text-white/30 font-medium pb-2 pr-2 align-bottom"></th>
                {data.frameworks.map((f, idx) => (
                  <th
                    key={f.id}
                    className={`text-[10px] font-bold pb-2 px-1.5 text-center align-bottom border-b-2 ${
                      idx === active ? `${colors.text} ${colors.headBg}` : 'text-white/40 border-transparent'
                    } ${idx === active ? colors.border.replace('border-', 'border-b-') : ''}`}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span>{f.glyph}</span>
                      <span>{f.short}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.dimensions.map((dim, dIdx) => (
                <motion.tr
                  key={dIdx}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: dIdx * 0.05 }}
                  className="border-b border-white/5"
                >
                  <td className="text-[10px] text-white/55 py-2 pr-2 leading-tight">{dim}</td>
                  {data.frameworks.map((f, idx) => (
                    <td
                      key={f.id}
                      className={`text-[10px] py-2 px-1.5 text-center leading-tight ${cellColor(f.cells[dIdx])} ${
                        idx === active ? colors.cellBg : ''
                      }`}
                    >
                      {f.cells[dIdx]}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optional thesis strip (Page 2) */}
      {data.thesis && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className={`mt-6 inline-flex self-center items-center gap-2 rounded-full px-4 py-2 ${colors.bg} border ${colors.border}`}
        >
          <span className={`text-sm font-bold ${colors.text}`}>{data.thesis}</span>
        </motion.div>
      )}
    </SectionShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pipeline (Page 3)
// ─────────────────────────────────────────────────────────────────────────────

function TicketToPRFlow({ data, isRTL }: { data: PipelinePage; isRTL: boolean }) {
  const colors = accentMap[data.accent] || accentMap.cyan;

  return (
    <SectionShell accent={data.accent} page={data.page} label={data.label} eyebrow={data.eyebrow} isRTL={isRTL}>
      <motion.h3
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`text-3xl sm:text-4xl font-black mb-8 tracking-tight ${colors.text}`}
      >
        {data.headline}
      </motion.h3>

      {/* Flow chain (LTR) */}
      <div dir="ltr" className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-8">
        {/* Source ticket card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2.5 font-mono text-[11px] shrink-0"
        >
          <div className="text-blue-300 font-bold">{data.source.id}</div>
          <div className="text-white/60 mt-0.5">"{data.source.title}"</div>
          <span className="inline-block mt-1.5 text-[9px] bg-blue-500/20 text-blue-300 rounded-full px-2 py-0.5">
            🟦 {data.source.status}
          </span>
        </motion.div>

        {data.stages.map((stage, idx) => (
          <React.Fragment key={stage.n}>
            <span className="hidden md:inline text-white/25 text-lg shrink-0">→</span>
            <span className="md:hidden text-white/25 text-lg text-center">↓</span>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12 }}
              className={`flex-1 rounded-lg border ${colors.border} bg-slate-900/60 px-3 py-2.5`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`flex items-center justify-center w-5 h-5 rounded-full ${colors.badge} font-mono font-black text-[10px]`}>
                  {stage.n}
                </span>
                <span className={`text-xs font-bold ${colors.text}`}>{stage.verb}</span>
              </div>
              <div className="text-[10px] text-white/45 leading-tight">{stage.sub}</div>
            </motion.div>
          </React.Fragment>
        ))}
      </div>

      {/* Terminal narration */}
      <div className="max-w-3xl">
        <MiniTerminal lines={data.terminal} stagger={0.18} />
      </div>

      {/* Callout */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className={`mt-5 inline-flex self-start items-center gap-2 rounded-lg px-4 py-2.5 ${colors.bg} border ${colors.border}`}
      >
        <span className={`text-sm ${colors.text} font-medium`}>{data.callout}</span>
      </motion.div>
    </SectionShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Memory tree (Page 4)
// ─────────────────────────────────────────────────────────────────────────────

function MemoryTree({ data, isRTL }: { data: MemoryPage; isRTL: boolean }) {
  const colors = accentMap[data.accent] || accentMap.emerald;

  return (
    <SectionShell accent={data.accent} page={data.page} label={data.label} eyebrow={data.eyebrow} isRTL={isRTL}>
      <motion.h3
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`text-3xl sm:text-4xl font-black mb-8 tracking-tight ${colors.text}`}
      >
        {data.headline}
      </motion.h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Left: prose */}
        <ul className="space-y-4">
          {data.bullets.map((b, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12 }}
              className={`flex items-start gap-3 text-sm text-white/70 leading-relaxed ${isRTL ? 'flex-row-reverse text-right' : ''}`}
            >
              <span className={`shrink-0 mt-0.5 ${colors.text}`}>✓</span>
              <span>{b}</span>
            </motion.li>
          ))}
        </ul>

        {/* Right: doc tree (LTR) */}
        <div dir="ltr">
          <div className="flex justify-center mb-3">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono rounded-full px-3 py-1 ${colors.bg} border ${colors.border} ${colors.text}`}>
              {data.syncBadge}
            </span>
          </div>
          <div className="bg-slate-950 rounded-xl border border-emerald-500/20 p-5 max-w-md mx-auto font-mono text-sm">
            {data.tree.map((folder, fi) => (
              <div key={fi}>
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: fi * 0.1 }}
                  className="flex items-center gap-2 py-1"
                  style={{ paddingLeft: `${folder.depth * 20}px` }}
                >
                  <span>{folder.icon}</span>
                  <span className="text-emerald-400 font-bold">{folder.name}</span>
                </motion.div>
                {folder.files?.map((file, i) => {
                  const isNew = file.includes('new');
                  return (
                    <motion.div
                      key={file}
                      initial={{ opacity: 0, x: -10, scale: isNew ? 0.96 : 1 }}
                      whileInView={{ opacity: 1, x: 0, scale: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ delay: fi * 0.1 + (i + 1) * 0.06 }}
                      className="flex items-center gap-2 py-0.5"
                      style={{ paddingLeft: `${(folder.depth + 1) * 20}px` }}
                    >
                      <span className={isNew ? 'text-emerald-400' : 'text-slate-600'}>{file.includes('/') ? '📁' : '📄'}</span>
                      <span className={isNew ? 'text-emerald-300 font-semibold' : 'text-slate-400'}>{file}</span>
                    </motion.div>
                  );
                })}
              </div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2 }}
              className="mt-3 pt-3 border-t border-emerald-500/10 text-emerald-400/60 text-xs text-center"
            >
              {data.treeFooter}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Thesis tie-back callout */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        className="mt-8 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl px-6 py-4 text-center max-w-3xl mx-auto"
      >
        <p className="text-emerald-200/90 text-sm font-medium italic leading-relaxed">{data.callout}</p>
      </motion.div>
    </SectionShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

export default function ToolingSlide({ data, lang }: ToolingSlideProps) {
  const isRTL = lang === 'he';

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* ── INTRO VIEWPORT ── */}
      <div className="min-h-[85vh] flex flex-col items-center justify-center px-6 text-center">
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
          className="text-5xl sm:text-7xl font-black mb-6 bg-gradient-to-r from-teal-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent leading-tight pb-2"
        >
          {data.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-lg sm:text-xl text-white/60 max-w-2xl mb-12 leading-relaxed"
        >
          {data.subtitle}
        </motion.p>

        {/* 4-stop roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-2 sm:gap-1 mb-12"
        >
          {data.intro.roadmap.map((stop, idx) => {
            const colors = accentMap[stop.accent] || accentMap.teal;
            return (
              <React.Fragment key={stop.id}>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + idx * 0.1 }}
                  className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 ${colors.bg} border ${colors.border}`}
                >
                  <span className={`font-mono font-black text-[10px] ${colors.text}`}>{stop.id}</span>
                  <span className={`text-xs font-semibold ${colors.text}`}>{stop.label}</span>
                </motion.div>
                {idx < data.intro.roadmap.length - 1 && (
                  <span className="hidden sm:inline text-white/20 text-sm">—</span>
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
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-2xl">
            ↓
          </motion.div>
        </motion.div>
      </div>

      {/* ── PAGES ── */}
      <TabbedCompare data={data.specPage} isRTL={isRTL} />
      <TabbedCompare data={data.guardPage} isRTL={isRTL} />
      <TicketToPRFlow data={data.pipelinePage} isRTL={isRTL} />
      <MemoryTree data={data.memoryPage} isRTL={isRTL} />

      {/* ── CLOSING HANDOFF ── */}
      <div className="min-h-[50vh] flex items-center justify-center px-6 pb-20">
        <motion.p
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          className="max-w-3xl text-center text-xl sm:text-2xl text-white/75 italic font-light leading-relaxed"
        >
          {data.closing}
        </motion.p>
      </div>
    </div>
  );
}
