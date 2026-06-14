import { motion } from 'framer-motion';

interface SDDCostOfChaosSlideProps {
  data: {
    kicker: string;
    title: string;
    reframe: { myth: string; truth: string };
    contrast: {
      disease: string;
      diseaseNote: string;
      left: { header: string; sub: string; symptoms: string[] };
      right: { header: string; sub: string; cures: string[] };
    };
    crystal: { word: string; definition: string };
  };
  lang: 'en' | 'he';
}

// Static tone maps — literal Tailwind classes only
const TONE = {
  problem: { text: 'text-red-400/80', sub: 'text-red-400/50', border: 'border-red-500/20', bg: 'bg-red-950/15' },
  cure: { text: 'text-cyan-200', sub: 'text-cyan-300/60', border: 'border-cyan-500/30', bg: 'bg-cyan-950/25' },
} as const;

export default function SDDCostOfChaosSlide({ data }: SDDCostOfChaosSlideProps) {
  const { reframe, contrast, crystal } = data;

  return (
    <div className="max-w-5xl mx-auto w-full flex flex-col gap-5">
      {/* Kicker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-[10px] font-mono tracking-[0.4em] text-slate-500 uppercase"
      >
        {data.kicker}
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-3xl sm:text-4xl font-black text-white tracking-tight"
      >
        {data.title}
      </motion.h2>

      {/* Reframe block */}
      <div className="flex flex-col gap-2">
        {/* Myth with animated strikethrough */}
        <div className="relative inline-block self-start">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.3 }}
            className="text-base sm:text-lg text-red-400/60"
          >
            {reframe.myth}
          </motion.span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.5, ease: 'easeInOut' }}
            className="absolute left-0 right-0 bg-red-500/60 h-px top-1/2"
            style={{ transformOrigin: 'left' }}
          />
        </div>
        {/* Truth */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.4 }}
          className="text-xl sm:text-2xl font-bold text-white"
        >
          {reframe.truth}
        </motion.p>
      </div>

      {/* Prompt-first vs Spec-first diagnostic — forced LTR (problem→cure reads left→right) */}
      <div dir="ltr">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.4, ease: 'easeOut' }}
          className="relative grid grid-cols-2 rounded-2xl border border-slate-700/40 overflow-hidden"
        >
          {/* LEFT — the disease */}
          <div className={`${TONE.problem.bg} px-5 py-4 flex flex-col gap-2.5`}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.25, duration: 0.4 }}
            >
              <div className={`text-sm font-black tracking-widest uppercase ${TONE.problem.text}`}>
                {contrast.left.header}
              </div>
              <div className={`text-[11px] ${TONE.problem.sub}`}>{contrast.left.sub}</div>
            </motion.div>
            <div className="flex flex-col gap-1.5 mt-1">
              {contrast.left.symptoms.map((line, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + idx * 0.1, duration: 0.35 }}
                  className="text-xs text-slate-400 font-mono"
                >
                  {line}
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT — the cure */}
          <div className={`${TONE.cure.bg} px-5 py-4 flex flex-col gap-2.5 border-l ${TONE.cure.border}`}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.4 }}
            >
              <div className={`text-sm font-black tracking-widest uppercase ${TONE.cure.text}`}>
                {contrast.right.header}
              </div>
              <div className={`text-[11px] ${TONE.cure.sub}`}>{contrast.right.sub}</div>
            </motion.div>
            <div className="flex flex-col gap-1.5 mt-1">
              {contrast.right.cures.map((line, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.85 + idx * 0.1, duration: 0.35 }}
                  className="text-xs text-cyan-100/70 font-mono"
                >
                  {line}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Center seam — the named disease */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 1.55, duration: 0.4, ease: 'easeInOut' }}
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-slate-600/40"
            style={{ transformOrigin: 'top' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.7, duration: 0.4, ease: 'easeOut' }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
          >
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-amber-500/40 text-sm font-black tracking-[0.3em] text-amber-300">
              {contrast.disease}
            </span>
            <span className="mt-1 text-[9px] font-mono text-amber-300/50 tracking-wide">
              {contrast.diseaseNote}
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Cyan scan line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 2.2, duration: 0.6, ease: 'easeInOut' }}
        className="h-px w-full bg-cyan-400/50"
        style={{ transformOrigin: 'left' }}
      />

      {/* SPECIFICATION crystal card — forced LTR for visual symmetry */}
      <div dir="ltr">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.45, duration: 0.5, ease: 'easeOut' }}
          className="bg-cyan-950/40 border border-cyan-500/50 rounded-2xl px-8 py-5 flex flex-col items-center gap-1.5"
        >
          <span className="text-4xl sm:text-5xl font-black text-cyan-200 tracking-[0.15em]">
            {crystal.word}
          </span>
          <span className="text-sm italic text-cyan-300/70">{crystal.definition}</span>
        </motion.div>
      </div>
    </div>
  );
}
