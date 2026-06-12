import { motion } from 'framer-motion';

interface Pillar {
  number: string;
  icon: string;
  title: string;
  description: string;
  artifact: string;
  color: string;
}

interface ThesisBadge {
  text: string;
  color: string;
}

interface SDDThreePillarsSlideProps {
  data: {
    kicker: string;
    title: string;
    definition: string;
    pillars: Pillar[];
    thesis: ThesisBadge[];
  };
  lang: 'en' | 'he';
}

const pillarColorMap: Record<string, {
  border: string;
  borderLeft: string;
  bg: string;
  number: string;
  artifact: string;
  artifactBorder: string;
}> = {
  teal: {
    border: 'border-teal-500/30',
    borderLeft: 'border-l-teal-400',
    bg: 'bg-teal-500/5',
    number: 'text-teal-400/50',
    artifact: 'text-teal-300',
    artifactBorder: 'border-teal-500/20',
  },
  emerald: {
    border: 'border-emerald-500/30',
    borderLeft: 'border-l-emerald-400',
    bg: 'bg-emerald-500/5',
    number: 'text-emerald-400/50',
    artifact: 'text-emerald-300',
    artifactBorder: 'border-emerald-500/20',
  },
  cyan: {
    border: 'border-cyan-500/30',
    borderLeft: 'border-l-cyan-400',
    bg: 'bg-cyan-500/5',
    number: 'text-cyan-400/50',
    artifact: 'text-cyan-300',
    artifactBorder: 'border-cyan-500/20',
  },
};

const thesisColorMap: Record<string, { bg: string; border: string; text: string }> = {
  amber: { bg: 'bg-amber-500/15', border: 'border-amber-500/30', text: 'text-amber-300' },
  emerald: { bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', text: 'text-emerald-300' },
  blue: { bg: 'bg-blue-500/15', border: 'border-blue-500/30', text: 'text-blue-300' },
};

export default function SDDThreePillarsSlide({ data }: SDDThreePillarsSlideProps) {
  return (
    <div className="max-w-5xl mx-auto w-full flex flex-col gap-4">
      {/* Kicker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="text-[10px] font-mono tracking-[0.3em] text-slate-400 uppercase"
      >
        {data.kicker}
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent tracking-tight leading-tight"
      >
        {data.title}
      </motion.h2>

      {/* Definition */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.35 }}
        className="text-sm text-white/60 max-w-3xl leading-relaxed"
      >
        {data.definition}
      </motion.p>

      {/* Scan line 1 */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.5, ease: 'easeInOut' }}
        className="h-px w-full bg-teal-400/40"
        style={{ transformOrigin: 'left' }}
      />

      {/* Three pillar cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.pillars.map((pillar, idx) => {
          const colors = pillarColorMap[pillar.color] || pillarColorMap.teal;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + idx * 0.15, duration: 0.4 }}
              className={`${colors.bg} border ${colors.border} border-l-2 ${colors.borderLeft} rounded-xl px-4 py-4 flex flex-col gap-2`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-2xl font-black ${colors.number}`}>{pillar.number}</span>
                <span className="text-xl">{pillar.icon}</span>
              </div>
              <h3 className="text-base font-bold text-white leading-snug">{pillar.title}</h3>
              <p className="text-xs text-white/55 leading-relaxed flex-1">{pillar.description}</p>
              <code className={`text-xs font-mono ${colors.artifact} bg-slate-900/70 border ${colors.artifactBorder} rounded px-2.5 py-1 block`}>
                {pillar.artifact}
              </code>
            </motion.div>
          );
        })}
      </div>

      {/* Scan line 2 */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.1, duration: 0.45, ease: 'easeInOut' }}
        className="h-px w-full bg-teal-400/30"
        style={{ transformOrigin: 'left' }}
      />

      {/* Thesis badges — forced LTR so order reads correctly in both languages */}
      <div dir="ltr">
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          {data.thesis.map((badge, idx) => {
            const colors = thesisColorMap[badge.color] || thesisColorMap.amber;
            return (
              <motion.span
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + idx * 0.2, duration: 0.35 }}
                className={`${colors.bg} border ${colors.border} ${colors.text} text-[10px] font-mono tracking-[0.12em] uppercase rounded-full px-3 py-1.5`}
              >
                {badge.text}
              </motion.span>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
