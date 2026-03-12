import { motion } from 'framer-motion';

interface Era {
  name: string;
  period: string;
  tools: string[];
  traits: Array<{ text: string; type: 'positive' | 'negative' | 'neutral' }>;
  verdict: string;
  color: 'slate' | 'blue' | 'cyan';
}

interface ThreeErasSlideProps {
  data: {
    title: string;
    subtitle: string;
    eras: Era[];
  };
  lang: 'en' | 'he';
}

// Color palette per era
const COLOR_MAP = {
  slate: {
    border: 'border-slate-500/30',
    bg: 'bg-slate-500/10',
    nameCls: 'text-slate-300',
    badgeBg: 'bg-slate-600/40',
    badgeBorder: 'border-slate-500/40',
    badgeText: 'text-slate-300',
    verdictBg: 'bg-slate-700/50',
    verdictBorder: 'border-slate-500/30',
    verdictText: 'text-slate-300',
    glow: 'rgba(100,116,139,0.25)',
    arrowColor: 'text-slate-500',
  },
  blue: {
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
    nameCls: 'text-blue-400',
    badgeBg: 'bg-blue-500/20',
    badgeBorder: 'border-blue-400/40',
    badgeText: 'text-blue-300',
    verdictBg: 'bg-blue-900/40',
    verdictBorder: 'border-blue-500/30',
    verdictText: 'text-blue-300',
    glow: 'rgba(59,130,246,0.25)',
    arrowColor: 'text-blue-500',
  },
  cyan: {
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10',
    nameCls: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/20',
    badgeBorder: 'border-cyan-400/40',
    badgeText: 'text-cyan-300',
    verdictBg: 'bg-cyan-900/30',
    verdictBorder: 'border-amber-500/40',
    verdictText: 'text-amber-300',
    glow: 'rgba(6,182,212,0.25)',
    arrowColor: 'text-cyan-500',
  },
} as const;

const TRAIT_ICON: Record<Era['traits'][number]['type'], string> = {
  positive: '✓',
  negative: '✗',
  neutral: '·',
};

const TRAIT_COLOR: Record<Era['traits'][number]['type'], string> = {
  positive: 'text-emerald-400',
  negative: 'text-rose-400',
  neutral: 'text-slate-400',
};

interface ArrowProps {
  delay: number;
  rtl: boolean;
}

function ConnectingArrow({ delay, rtl }: ArrowProps) {
  return (
    <div className="hidden md:flex flex-col items-center justify-center flex-shrink-0 w-10 self-stretch pt-16">
      {/* Animated gradient line */}
      <div className="relative flex flex-col items-center gap-1 h-full justify-center">
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay, duration: 0.4, ease: 'easeOut' }}
          style={{ originY: 0.5 }}
          className="w-px flex-1 bg-gradient-to-b from-transparent via-slate-500/60 to-transparent max-h-20"
        />
        <motion.span
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.15, duration: 0.3, ease: 'backOut' }}
          className="text-slate-400 text-xl font-light select-none"
          style={{ transform: rtl ? 'scaleX(-1)' : undefined }}
        >
          →
        </motion.span>
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay, duration: 0.4, ease: 'easeOut' }}
          style={{ originY: 0.5 }}
          className="w-px flex-1 bg-gradient-to-b from-transparent via-slate-500/60 to-transparent max-h-20"
        />
      </div>
    </div>
  );
}

interface EraCardProps {
  era: Era;
  index: number;
  isLast: boolean;
}

function EraCard({ era, index }: EraCardProps) {
  const c = COLOR_MAP[era.color];
  const delay = 0.15 + index * 0.2;

  // For the agentic (cyan) era, split-color the card header
  const isAgentic = era.color === 'cyan';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: 'easeOut' }}
      className={`flex-1 min-w-0 flex flex-col rounded-xl border ${c.border} ${c.bg} overflow-hidden`}
      style={{
        boxShadow: `0 0 24px ${c.glow}`,
      }}
    >
      {/* Header */}
      <div
        className={`px-5 pt-5 pb-4 ${isAgentic ? 'bg-gradient-to-r from-cyan-900/40 to-amber-900/30' : ''}`}
      >
        {/* Period tag */}
        <span className="text-xs text-white/40 font-mono tracking-widest uppercase">
          {era.period}
        </span>

        {/* Era name */}
        <h3
          className={`mt-1 text-2xl font-black tracking-tight leading-tight ${
            isAgentic
              ? 'bg-gradient-to-r from-cyan-400 to-amber-400 bg-clip-text text-transparent'
              : c.nameCls
          }`}
          style={
            isAgentic
              ? {
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }
              : undefined
          }
        >
          {era.name}
        </h3>

        {/* Tool badges */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {era.tools.map((tool, ti) => (
            <motion.span
              key={ti}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.1 + ti * 0.07, duration: 0.25, ease: 'backOut' }}
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.badgeBg} ${c.badgeBorder} ${c.badgeText}`}
            >
              {tool}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className={`h-px mx-5 ${era.color === 'slate' ? 'bg-slate-600/30' : era.color === 'blue' ? 'bg-blue-500/20' : 'bg-cyan-500/20'}`} />

      {/* Traits */}
      <div className="flex-1 px-5 py-4 space-y-2">
        {era.traits.map((trait, ti) => (
          <motion.div
            key={ti}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.25 + ti * 0.08, duration: 0.3 }}
            className="flex items-start gap-2"
          >
            <span className={`flex-shrink-0 text-sm font-bold mt-0.5 ${TRAIT_COLOR[trait.type]}`}>
              {TRAIT_ICON[trait.type]}
            </span>
            <span className="text-white/75 text-sm leading-snug">{trait.text}</span>
          </motion.div>
        ))}
      </div>

      {/* Verdict footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.45, duration: 0.35 }}
        className={`mx-4 mb-4 px-4 py-2.5 rounded-lg border ${c.verdictBg} ${c.verdictBorder} flex items-center gap-2`}
      >
        {isAgentic && (
          <span className="text-base flex-shrink-0">⚡</span>
        )}
        <span className={`text-xs font-semibold leading-snug ${c.verdictText}`}>
          {era.verdict}
        </span>
      </motion.div>
    </motion.div>
  );
}

export default function ThreeErasSlide({ data, lang }: ThreeErasSlideProps): JSX.Element {
  const isRtl = lang === 'he';
  const eras = isRtl ? [...data.eras].reverse() : data.eras;

  return (
    <div
      className="max-w-5xl mx-auto w-full flex flex-col gap-6"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="text-center"
      >
        <h2
          className="text-4xl sm:text-5xl font-black tracking-tight mb-2"
          style={{
            background: 'linear-gradient(135deg, #94a3b8 0%, #60a5fa 45%, #22d3ee 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {data.title}
        </h2>
        <p className="text-white/50 text-base">{data.subtitle}</p>
      </motion.div>

      {/* Timeline row */}
      <div className="flex items-stretch gap-0">
        {eras.map((era, idx) => (
          <div key={era.name} className="contents">
            <EraCard era={era} index={idx} isLast={idx === eras.length - 1} />
            {idx < eras.length - 1 && (
              <ConnectingArrow
                delay={0.15 + idx * 0.2 + 0.5}
                rtl={isRtl}
              />
            )}
          </div>
        ))}
      </div>

      {/* Bottom timeline ruler */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 1.1, duration: 0.5, ease: 'easeOut' }}
        style={{ originX: isRtl ? 1 : 0 }}
        className="relative h-6 flex items-center"
      >
        {/* Track */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-slate-600/60 via-blue-500/50 to-cyan-500/60" />
        {/* Era dots */}
        {eras.map((era, idx) => {
          const pos =
            eras.length === 1 ? '50%' : `${(idx / (eras.length - 1)) * 100}%`;
          const dotColor =
            era.color === 'slate'
              ? '#94a3b8'
              : era.color === 'blue'
              ? '#60a5fa'
              : '#22d3ee';
          return (
            <motion.div
              key={era.name}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.25 + idx * 0.1, duration: 0.3, ease: 'backOut' }}
              className="absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 top-1/2"
              style={{ left: pos, backgroundColor: dotColor, boxShadow: `0 0 8px ${dotColor}` }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}
