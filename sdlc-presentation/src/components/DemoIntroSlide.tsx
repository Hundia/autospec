import React from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  Activity,
  Compass,
  MapPin,
  Radio,
  Camera,
  Wind,
  ClipboardList,
  FileText,
  Code2,
  UserCheck,
  FlaskConical,
  GitPullRequest,
  ChevronDown,
  ArrowRight,
  Zap,
} from 'lucide-react';

// ── Accent map — all literal class strings, NO dynamic construction ─────────────
const accentMap: Record<string, {
  text: string;
  border: string;
  bg: string;
  badge: string;
  glow: string;
  number: string;
}> = {
  blue: {
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/8',
    badge: 'bg-blue-500/20 text-blue-300',
    glow: 'shadow-blue-500/25',
    number: 'text-blue-400',
  },
  violet: {
    text: 'text-violet-400',
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/8',
    badge: 'bg-violet-500/20 text-violet-300',
    glow: 'shadow-violet-500/25',
    number: 'text-violet-400',
  },
  indigo: {
    text: 'text-indigo-400',
    border: 'border-indigo-500/35',
    bg: 'bg-indigo-500/10',
    badge: 'bg-indigo-500/20 text-indigo-300',
    glow: 'shadow-indigo-500/25',
    number: 'text-indigo-400',
  },
  teal: {
    text: 'text-teal-400',
    border: 'border-teal-500/30',
    bg: 'bg-teal-500/8',
    badge: 'bg-teal-500/20 text-teal-300',
    glow: 'shadow-teal-500/25',
    number: 'text-teal-400',
  },
  emerald: {
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/8',
    badge: 'bg-emerald-500/20 text-emerald-300',
    glow: 'shadow-emerald-500/25',
    number: 'text-emerald-400',
  },
  cyan: {
    text: 'text-cyan-400',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/8',
    badge: 'bg-cyan-500/20 text-cyan-300',
    glow: 'shadow-cyan-500/25',
    number: 'text-cyan-400',
  },
  amber: {
    text: 'text-amber-400',
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/10',
    badge: 'bg-amber-500/20 text-amber-300',
    glow: 'shadow-amber-500/30',
    number: 'text-amber-400',
  },
};

// MFL status colors — literal lookups only
const mflStatusMap: Record<string, { bg: string; text: string; border: string }> = {
  OK: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40' },
  DEGRADED: { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/40' },
  FAIL: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/40' },
};

// Icon map for drone modules
const droneIconMap: Record<string, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  Cpu,
  Activity,
  Compass,
  MapPin,
  Radio,
  Camera,
  Wind,
};

// Per-subsystem icon tints — foreshadows Beat 3 status colors
const droneIconColorMap: Record<string, string> = {
  Cpu:      'text-blue-400/70',
  Camera:   'text-violet-400/70',
  Wind:     'text-teal-400/70',
  Compass:  'text-indigo-400/70',
  Activity: 'text-cyan-400/70',
  MapPin:   'text-emerald-400/70',
  Radio:    'text-blue-300/60',
};

// Icon map for workflow steps
const workflowIconMap: Record<string, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  ClipboardList,
  FileText,
  Code2,
  UserCheck,
  FlaskConical,
  GitPullRequest,
};

// ── Data shape ──────────────────────────────────────────────────────────────────
interface DroneModule {
  iconKey: string;
  label: string;
  subLabel: string;
}

interface MessageType {
  type: string;
  accentKey: string;
  desc: string;
}

interface MflModule {
  id: string;
  label: string;
}

interface WorkflowStep {
  num: string;
  label: string;
  detail: string;
  icon: string;
  accent: string;
}

interface DemoIntroSlideData {
  type: string;
  scrollable: boolean;
  kicker: string;
  heroTitle: string;
  heroSubtitle: string;
  heroTag: string;
  scrollHint: string;

  // Beat 1 — Project
  projectKicker: string;
  projectTitle: string;
  projectBody: string;
  droneModules: DroneModule[];
  droneImageUrl?: string;

  // Beat 2 — ICD / Comms
  commsKicker: string;
  commsTitle: string;
  commsBody: string;
  currentMessages: MessageType[];
  newMessage: MessageType;
  commsImageUrl?: string;

  // Beat 3 — Requirement
  demandKicker: string;
  demandTitle: string;
  demandBody: string;
  mflModules: MflModule[];
  mflPayloadSample: string;
  scope: string[];

  // Beat 4 — Workflow
  workflowKicker: string;
  workflowTitle: string;
  workflowSteps: WorkflowStep[];

  // Beat 5 — Handoff
  handoffKicker: string;
  handoffTitle: string;
  handoffBody: string;
  handoffCallout: string;
}

interface DemoIntroSlideProps {
  data: DemoIntroSlideData;
  lang: 'en' | 'he';
}

// ── Drone Schematic Fallback (CSS/SVG) ─────────────────────────────────────────
function DroneSchematicFallback() {
  return (
    <div className="relative w-full max-w-sm mx-auto h-40 flex items-center justify-center select-none pointer-events-none">
      {/* Body */}
      <div className="absolute w-14 h-10 rounded-lg bg-slate-700/80 border border-blue-400/30 flex items-center justify-center z-10">
        <Cpu size={14} className="text-blue-300/70" />
      </div>
      {/* Arms + rotors — 4 corners */}
      {[
        { top: '4px', left: '30px', rotate: '-45deg' },
        { top: '4px', right: '30px', rotate: '45deg' },
        { bottom: '4px', left: '30px', rotate: '45deg' },
        { bottom: '4px', right: '30px', rotate: '-45deg' },
      ].map((pos, i) => (
        <div key={i} className="absolute" style={pos as React.CSSProperties}>
          <div
            className="w-8 h-8 rounded-full border border-blue-400/25 bg-slate-800/60 flex items-center justify-center"
          >
            <Wind size={10} className="text-blue-300/40" />
          </div>
        </div>
      ))}
      {/* Connecting lines as SVG overlay */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 160" fill="none">
        <line x1="160" y1="80" x2="72" y2="24" stroke="rgba(96,165,250,0.2)" strokeWidth="1.5" />
        <line x1="160" y1="80" x2="248" y2="24" stroke="rgba(96,165,250,0.2)" strokeWidth="1.5" />
        <line x1="160" y1="80" x2="72" y2="136" stroke="rgba(96,165,250,0.2)" strokeWidth="1.5" />
        <line x1="160" y1="80" x2="248" y2="136" stroke="rgba(96,165,250,0.2)" strokeWidth="1.5" />
      </svg>
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] font-mono text-blue-300/40 tracking-widest uppercase whitespace-nowrap">
        Drone Schematic
      </span>
    </div>
  );
}

// ── Comms Arrow Flow Fallback ────────────────────────────────────────────────────
function CommsFlowFallback() {
  return (
    <div dir="ltr" className="flex items-center justify-center gap-2 py-4">
      <div className="flex flex-col items-center gap-1">
        <div className="w-14 h-10 rounded-lg bg-slate-700/80 border border-blue-400/30 flex items-center justify-center">
          <Wind size={14} className="text-blue-300/70" />
        </div>
        <span className="text-[9px] font-mono text-white/40">DRONE</span>
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-1">
          <div className="h-px w-10 bg-gradient-to-r from-blue-400/40 to-teal-400/40" />
          <ArrowRight size={10} className="text-teal-400/60" />
        </div>
        <span className="text-[8px] font-mono text-white/30">ICD messages</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="w-14 h-10 rounded-lg bg-slate-700/80 border border-teal-400/30 flex items-center justify-center">
          <Radio size={14} className="text-teal-300/70" />
        </div>
        <span className="text-[9px] font-mono text-white/40">GROUND</span>
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────────
export default function DemoIntroSlide({ data, lang }: DemoIntroSlideProps) {
  const isRTL = lang === 'he';
  const base = import.meta.env.BASE_URL;
  const resolveUrl = (path: string) => `${base}${path.replace(/^\//, '')}`;

  return (
    <div className="w-full max-w-5xl mx-auto">

      {/* ══ HERO ══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center py-24 px-6 text-center overflow-hidden">
        {/* Looping drone-battle video — scoped to hero only */}
        <video
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          src={`${base}drone-battle.mp4`}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        />
        {/* Dark overlay — keeps text legible, lets corner drones show through */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 45%, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.75) 45%, rgba(15,23,42,0.60) 100%)',
          }}
        />
        {/* Content sits above video layers */}
        <div className="relative z-10 flex flex-col items-center">
          <motion.p
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[10px] sm:text-xs tracking-[0.45em] text-blue-400/80 uppercase font-mono mb-6"
          >
            {data.kicker}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl sm:text-7xl lg:text-8xl leading-none mb-5 bg-gradient-to-r from-blue-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent pb-2 tracking-wide"
            style={{ fontFamily: "'Cinzel', serif", fontWeight: 900 }}
          >
            {data.heroTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-lg sm:text-xl text-white/85 max-w-2xl mb-4 leading-relaxed font-medium"
          >
            {data.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/8 mb-12"
          >
            <span className="text-xs font-mono text-violet-300/50 tracking-wide">{data.heroTag}</span>
          </motion.div>

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
            className="flex flex-col items-center gap-2 text-white/30"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
            >
              <ChevronDown size={24} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ BEAT 1 — THE PROJECT ══════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5 }}
        className="min-h-[85vh] flex flex-col justify-center px-6 py-16 border-t border-blue-500/10"
      >
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-[10px] sm:text-xs tracking-[0.4em] text-blue-400/70 uppercase font-mono mb-3 ${isRTL ? 'text-right' : ''}`}
        >
          {data.projectKicker}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={`text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 leading-tight ${isRTL ? 'text-right' : ''}`}
        >
          {data.projectTitle}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`text-white/60 max-w-2xl leading-relaxed mb-10 text-base sm:text-lg ${isRTL ? 'text-right' : ''}`}
        >
          {data.projectBody}
        </motion.p>

        {/* Drone modules grid + optional image */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-start ${isRTL ? 'direction-rtl' : ''}`}>
          {/* Modules */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data.droneModules.map((mod, i) => {
              const Icon = droneIconMap[mod.iconKey] || Cpu;
              return (
                <motion.div
                  key={mod.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 + i * 0.07 }}
                  className={`rounded-xl border border-blue-500/20 bg-slate-800/50 p-4 flex flex-col gap-2 ${isRTL ? 'items-end' : 'items-start'}`}
                >
                  <Icon size={20} className={droneIconColorMap[mod.iconKey] ?? 'text-blue-400/70'} />
                  <span className="text-sm font-bold text-white/85 leading-tight">{mod.label}</span>
                  <span className="text-[11px] text-white/40 font-mono leading-snug">{mod.subLabel}</span>
                </motion.div>
              );
            })}
          </div>

          {/* Image or fallback */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center"
          >
            {data.droneImageUrl ? (
              <img
                src={resolveUrl(data.droneImageUrl)}
                alt="Drone hardware diagram"
                className="rounded-2xl border border-blue-500/20 max-w-full max-h-80 object-contain"
              />
            ) : (
              <div className="w-full rounded-2xl border border-blue-500/15 bg-slate-800/40 p-6">
                <DroneSchematicFallback />
              </div>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* ══ BEAT 2 — THE ICD / COMMUNICATION ═════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5 }}
        className="min-h-[85vh] flex flex-col justify-center px-6 py-16 border-t border-teal-500/10"
      >
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-[10px] sm:text-xs tracking-[0.4em] text-teal-400/70 uppercase font-mono mb-3 ${isRTL ? 'text-right' : ''}`}
        >
          {data.commsKicker}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={`text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 leading-tight ${isRTL ? 'text-right' : ''}`}
        >
          {data.commsTitle}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`text-white/60 max-w-2xl leading-relaxed mb-10 text-base sm:text-lg ${isRTL ? 'text-right' : ''}`}
        >
          {data.commsBody}
        </motion.p>

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-start ${isRTL ? '' : ''}`}>
          {/* Message types */}
          <div className="flex flex-col gap-4">
            {/* Existing messages */}
            {data.currentMessages.map((msg, i) => {
              const colors = accentMap[msg.accentKey] || accentMap.blue;
              return (
                <motion.div
                  key={msg.type}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 + i * 0.1 }}
                  className={`rounded-xl border ${colors.border} ${colors.bg} px-5 py-4 flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <span dir="ltr" className={`font-mono font-black text-lg tracking-wider ${colors.text} shrink-0`}>
                    {msg.type}
                  </span>
                  <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
                    <span className="text-sm text-white/65">{msg.desc}</span>
                    <span className={`text-[10px] font-mono mt-0.5 ${colors.badge} px-1.5 py-0.5 rounded w-fit`}>
                      {lang === 'he' ? 'קיים' : 'existing'}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {/* New MFL message — highlighted */}
            {(() => {
              const colors = accentMap[data.newMessage.accentKey] || accentMap.amber;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.45 }}
                  className={`rounded-xl border-2 ${colors.border} bg-amber-500/15 px-5 py-4 flex items-center gap-4 relative ${isRTL ? 'flex-row-reverse' : ''}`}
                  style={{ boxShadow: '0 0 32px rgba(251,191,36,0.35), 0 0 12px rgba(251,191,36,0.20)' }}
                >
                  {/* NEW badge */}
                  <span className="absolute -top-3 left-4 text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-amber-500 text-slate-900 tracking-wider">
                    NEW
                  </span>
                  <span dir="ltr" className={`font-mono font-black text-lg tracking-wider ${colors.text} shrink-0`}>
                    {data.newMessage.type}
                  </span>
                  <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
                    <span className="text-sm text-white/80 font-medium">{data.newMessage.desc}</span>
                    <span className={`text-[10px] font-mono mt-0.5 ${colors.badge} px-1.5 py-0.5 rounded w-fit`}>
                      {lang === 'he' ? 'דרישה חדשה' : 'new requirement'}
                    </span>
                  </div>
                </motion.div>
              );
            })()}
          </div>

          {/* Comms flow image or fallback */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center"
          >
            {data.commsImageUrl ? (
              <img
                src={resolveUrl(data.commsImageUrl)}
                alt="Drone-to-ground comms flow"
                className="rounded-2xl border border-teal-500/20 max-w-full max-h-80 object-contain"
              />
            ) : (
              <div className="w-full rounded-2xl border border-teal-500/15 bg-slate-800/40 p-6">
                <div className="text-[10px] font-mono text-white/30 mb-4 text-center tracking-widest uppercase">
                  {lang === 'he' ? 'זרימת תקשורת' : 'Communication Flow'}
                </div>
                <CommsFlowFallback />
                <p className="text-center text-[11px] text-white/30 mt-4 font-mono">
                  {lang === 'he' ? 'ICD — פורמט הודעות מוגדר בלבד' : 'ICD — strictly defined message format'}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* ══ BEAT 3 — THE REQUIREMENT (REQ-MFL-001) ═══════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5 }}
        className="min-h-[85vh] flex flex-col justify-center px-6 py-16 border-t border-violet-500/10"
      >
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-[10px] sm:text-xs tracking-[0.4em] text-violet-400/70 uppercase font-mono mb-3 ${isRTL ? 'text-right' : ''}`}
        >
          {data.demandKicker}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-5 leading-tight bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent ${isRTL ? 'text-right' : ''}`}
        >
          {data.demandTitle}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`text-white/60 max-w-2xl leading-relaxed mb-8 text-base sm:text-lg ${isRTL ? 'text-right' : ''}`}
        >
          {data.demandBody}
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: modules */}
          <div>
            {/* MFL modules with sample statuses */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="mb-6"
            >
              <span className={`text-[10px] font-mono tracking-[0.3em] text-white/30 uppercase mb-3 block ${isRTL ? 'text-right' : ''}`}>
                {lang === 'he' ? 'מודולים מדווחים' : 'Reporting Modules'}
              </span>
              <div className="flex flex-wrap gap-2" dir="ltr">
                {data.mflModules.map((mod, i) => {
                  const sampleStatuses: Array<'OK' | 'DEGRADED' | 'FAIL'> = ['OK', 'OK', 'OK', 'DEGRADED', 'OK', 'FAIL'];
                  const status = sampleStatuses[i] ?? 'OK';
                  const s = mflStatusMap[status];
                  return (
                    <motion.div
                      key={mod.id}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.06 }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${s.border} ${s.bg}`}
                    >
                      <span className="font-mono text-xs text-white/70">{mod.id}</span>
                      <span className={`text-[10px] font-mono font-bold ${s.text} tracking-wide`}>{status}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right: JSON payload sample */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
          >
            <span className="text-[10px] font-mono tracking-[0.3em] text-white/30 uppercase mb-3 block">
              {lang === 'he' ? 'פורמט עומס (MFL)' : 'MFL Payload Format'}
            </span>
            <pre
              dir="ltr"
              className="text-[11px] sm:text-xs font-mono bg-slate-900/80 border border-violet-500/20 rounded-xl p-4 text-emerald-300/80 overflow-x-auto leading-relaxed whitespace-pre"
            >
              {data.mflPayloadSample}
            </pre>
          </motion.div>
        </div>

        {/* Scope pills — full-width row below the grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-6 pt-5 border-t border-violet-500/10"
        >
          <span className={`text-[10px] font-mono tracking-[0.3em] text-white/30 uppercase mb-3 block ${isRTL ? 'text-right' : ''}`}>
            {lang === 'he' ? 'היקף המשימה' : 'Scope'}
          </span>
          <div className={`flex gap-2 flex-wrap ${isRTL ? 'justify-end' : ''}`}>
            {data.scope.map((s, i) => {
              const scopeAccents = ['bg-blue-500/15 text-blue-300 border-blue-500/25', 'bg-violet-500/15 text-violet-300 border-violet-500/25', 'bg-teal-500/15 text-teal-300 border-teal-500/25'];
              return (
                <span key={i} className={`text-xs px-3 py-1.5 rounded-lg border font-mono ${scopeAccents[i] || scopeAccents[0]}`}>
                  {s}
                </span>
              );
            })}
          </div>
        </motion.div>
      </motion.section>

      {/* ══ BEAT 4 — THE SDD WORKFLOW PIPELINE ═══════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5 }}
        className="min-h-[85vh] flex flex-col justify-center px-6 py-16 border-t border-indigo-500/10"
      >
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-[10px] sm:text-xs tracking-[0.4em] text-indigo-400/70 uppercase font-mono mb-3 ${isRTL ? 'text-right' : ''}`}
        >
          {data.workflowKicker}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={`text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-10 leading-tight ${isRTL ? 'text-right' : ''}`}
        >
          {data.workflowTitle}
        </motion.h2>

        {/* Pipeline — vertical with connecting lines */}
        <div className="relative max-w-2xl mx-auto w-full" dir="ltr">
          {/* Vertical connector line — centered on the 48px node (left-6 = 24px = center of w-12) */}
          <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-blue-500/40 via-indigo-500/40 to-cyan-500/40 pointer-events-none" />

          <div className="flex flex-col gap-0">
            {data.workflowSteps.map((step, i) => {
              const colors = accentMap[step.accent] || accentMap.blue;
              const Icon = workflowIconMap[step.icon] || FileText;
              const isLast = i === data.workflowSteps.length - 1;

              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className={`relative flex items-start gap-5 ${isLast ? 'pb-4' : 'pb-6'}`}
                >
                  {/* Step node */}
                  <div className={`relative z-10 shrink-0 w-12 h-12 rounded-xl border-2 ${colors.border} ${colors.bg} flex flex-col items-center justify-center gap-0`}
                    style={{ boxShadow: `0 0 16px rgba(0,0,0,0.4)` }}>
                    <Icon size={14} className={`${colors.text}`} />
                    <span className={`font-mono font-black text-[9px] ${colors.number} mt-0.5`}>{step.num}</span>
                  </div>

                  {/* Step content */}
                  <div className="flex flex-col gap-1 pt-1.5">
                    <span className="font-bold text-white/90 text-sm sm:text-base leading-tight">{step.label}</span>
                    <span className="text-xs text-white/45 leading-snug max-w-sm">{step.detail}</span>
                  </div>
                </motion.div>
              );
            })}

            {/* Pipeline terminal node */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + data.workflowSteps.length * 0.1 }}
              className="relative flex items-center gap-5"
            >
              <div className="relative z-10 shrink-0 w-12 flex justify-center">
                <div className="w-3 h-3 rounded-full bg-cyan-400/60 border border-cyan-400/40" />
              </div>
              <span className="text-xs font-mono text-white/30 pt-0.5">
                {lang === 'he' ? 'PR נמזג · פיצ׳ר בייצור' : 'PR merged · feature shipped'}
              </span>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ══ BEAT 5 — THE HANDOFF ═════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5 }}
        className="min-h-[85vh] flex flex-col items-center justify-center px-6 py-24 border-t border-emerald-500/10 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] sm:text-xs tracking-[0.45em] text-emerald-400/80 uppercase font-mono mb-6"
        >
          {data.handoffKicker}
        </motion.p>

        {/* GO signal orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 180, damping: 14 }}
          className="relative mb-8"
        >
          <div className="w-24 h-24 rounded-full bg-emerald-500/15 border-2 border-emerald-400/50 flex items-center justify-center">
            <ArrowRight size={36} className="text-emerald-300" strokeWidth={2.5} />
          </div>
          {/* Pulse rings */}
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full border border-emerald-400/40 pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ repeat: Infinity, duration: 2.2, delay: 0.4, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full border border-emerald-400/25 pointer-events-none"
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-6 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent pb-1"
        >
          {data.handoffTitle}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="text-lg sm:text-xl text-white/60 max-w-xl leading-relaxed mb-10"
        >
          {data.handoffBody}
        </motion.p>

        {/* Callout badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          dir="ltr"
          className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border-2 border-emerald-400/40 bg-emerald-500/10 font-mono font-bold tracking-wider text-emerald-300 text-sm sm:text-base"
          style={{ boxShadow: '0 0 32px rgba(52,211,153,0.15), 0 0 64px rgba(52,211,153,0.06)' }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          {data.handoffCallout}
        </motion.div>
      </motion.section>

    </div>
  );
}
