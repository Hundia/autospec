import { motion } from 'framer-motion';
import { Brain, Workflow, Users, Compass } from 'lucide-react';

interface Dimension {
  label: string;
  detail: string;
}

interface ParadigmShiftSlideProps {
  data: {
    kicker: string;
    mistake: string;
    struckPhrase: string;
    truth: string;
    dimensionsLead: string;
    dimensions: {
      knowledge: Dimension;
      work: Dimension;
      responsibility: Dimension;
      engineers: Dimension;
    };
  };
  lang: 'en' | 'he';
}

// Literal Tailwind classes only — one entry per dimension, fixed order.
const DIMENSION_TONE = [
  { icon: Brain, ring: 'border-cyan-500/30', glow: 'bg-cyan-500/10', text: 'text-cyan-200' },
  { icon: Workflow, ring: 'border-blue-500/30', glow: 'bg-blue-500/10', text: 'text-blue-200' },
  { icon: Users, ring: 'border-indigo-500/30', glow: 'bg-indigo-500/10', text: 'text-indigo-200' },
  { icon: Compass, ring: 'border-violet-500/30', glow: 'bg-violet-500/10', text: 'text-violet-200' },
] as const;

export default function ParadigmShiftSlide({ data, lang }: ParadigmShiftSlideProps) {
  const isRTL = lang === 'he';
  const { dimensions } = data;

  const orderedDimensions = [
    dimensions.knowledge,
    dimensions.work,
    dimensions.responsibility,
    dimensions.engineers,
  ];

  return (
    <div
      className={`relative max-w-4xl mx-auto w-full flex flex-col gap-10 ${
        isRTL ? 'text-right' : 'text-left'
      }`}
    >
      {/* Soft ambient glow behind the thesis */}
      <motion.div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(99,102,241,0.16) 0%, rgba(34,211,238,0.08) 45%, transparent 70%)',
        }}
        animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Kicker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-[10px] font-mono tracking-[0.45em] text-slate-500 uppercase"
      >
        {data.kicker}
      </motion.div>

      {/* The reframe — the mistake, the demoted phrase, the deeper truth */}
      <div className="relative z-10 flex flex-col gap-6">
        {/* The mistake line */}
        <motion.p
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-lg sm:text-xl text-slate-400 font-light leading-relaxed max-w-2xl"
        >
          {data.mistake}
        </motion.p>

        {/* The struck-through phrase — demoted, replaced */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className={`flex items-baseline gap-4 flex-wrap ${
            isRTL ? 'justify-end' : 'justify-start'
          }`}
        >
          {/* "AI Adoption" stays LTR — Latin token */}
          <span dir="ltr" className="relative inline-block">
            <span className="text-3xl sm:text-4xl font-bold text-slate-600">
              {data.struckPhrase}
            </span>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.55, ease: 'easeInOut' }}
              className="absolute left-0 right-0 top-1/2 h-[3px] bg-slate-500/70 rounded-full"
              style={{ transformOrigin: 'left' }}
            />
          </span>
        </motion.div>

        {/* The deeper truth — the headline statement */}
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.55, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1] max-w-3xl"
          style={{
            background: 'linear-gradient(120deg, #67e8f9 0%, #818cf8 50%, #c4b5fd 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 24px rgba(129,140,248,0.25))',
          }}
        >
          {data.truth}
        </motion.h2>
      </div>

      {/* Lead-in to the four dimensions */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.45, duration: 0.5 }}
        className="relative z-10 text-sm font-mono tracking-[0.25em] text-slate-500 uppercase"
      >
        {data.dimensionsLead}
      </motion.p>

      {/* The four dimensions of the shift */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {orderedDimensions.map((dim, i) => {
          const tone = DIMENSION_TONE[i];
          const Icon = tone.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 + i * 0.15, duration: 0.45, ease: 'easeOut' }}
              className={`group flex items-start gap-4 rounded-2xl border ${tone.ring} bg-white/[0.02] px-5 py-4 ${
                isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'
              }`}
            >
              <div
                className={`shrink-0 flex items-center justify-center w-11 h-11 rounded-xl ${tone.glow} border ${tone.ring}`}
              >
                <Icon className={`w-5 h-5 ${tone.text}`} strokeWidth={1.75} />
              </div>
              <div className="flex flex-col gap-1">
                <span className={`text-lg font-bold ${tone.text}`}>{dim.label}</span>
                <span className="text-sm text-slate-400 font-light leading-snug">
                  {dim.detail}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
