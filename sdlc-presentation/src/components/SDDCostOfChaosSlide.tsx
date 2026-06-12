import { motion } from 'framer-motion';

interface SDDCostOfChaosSlideProps {
  data: {
    kicker: string;
    title: string;
    reframe: { myth: string; truth: string };
    findings: Array<{ label: string; cause: string }>;
    crystal: { word: string; definition: string };
  };
  lang: 'en' | 'he';
}

export default function SDDCostOfChaosSlide({ data }: SDDCostOfChaosSlideProps) {
  const { reframe, findings, crystal } = data;

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

      {/* Three forensic findings */}
      <div className="grid grid-cols-3 gap-4">
        {findings.map((finding, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05 + idx * 0.15, duration: 0.4 }}
            className="bg-slate-800/40 border border-slate-700/40 rounded-xl px-4 py-4 flex flex-col justify-between min-h-[90px]"
          >
            <span className="text-xs text-slate-400 leading-snug">{finding.label}</span>
            <span className="text-xs sm:text-sm font-black text-red-400/80 tracking-widest uppercase mt-3">
              {finding.cause}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Cyan scan line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.55, duration: 0.6, ease: 'easeInOut' }}
        className="h-px w-full bg-cyan-400/50"
        style={{ transformOrigin: 'left' }}
      />

      {/* SPECIFICATION crystal card — forced LTR for visual symmetry */}
      <div dir="ltr">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.85, duration: 0.5, ease: 'easeOut' }}
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
