import { motion } from 'framer-motion';

interface BreakingPointSlideProps {
  data: {
    kicker?: string;
    label: string;
    headline: string;
    build: Array<{ value: string; label: string }>;
    debt: Array<{ value: string; label: string }>;
    graveyard: { count: number; youAreHereLabel: string; stamp: string };
    bottomLine: string;
  };
  lang: 'en' | 'he';
}

// The session graveyard — 50 dead chat sessions stamped GONE, with the one
// survivor ("you are here") in amber. Forced LTR so the #IDs read identically
// in the Hebrew deck.
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
    <div dir="ltr" className="grid grid-cols-10 gap-1.5 max-w-3xl mx-auto">
      {chips.map((n, idx) => (
        <motion.div
          key={n}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + idx * 0.015, duration: 0.3 }}
          className="relative rounded border border-slate-700 bg-slate-900 px-1 py-1"
        >
          <div className="flex items-center gap-0.5 mb-0.5">
            <motion.span
              initial={{ backgroundColor: '#22c55e' }}
              animate={{ backgroundColor: '#475569' }}
              transition={{ delay: 1.0 + idx * 0.015, duration: 0.4 }}
              className="w-1 h-1 rounded-full"
            />
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="w-1 h-1 rounded-full bg-slate-700" />
          </div>
          <div className="font-mono text-[7px] text-slate-600">#{String(n).padStart(2, '0')}</div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 + idx * 0.015 }}
            className="absolute inset-0 flex items-center justify-center font-mono font-black text-[7px] text-red-500/80 -rotate-6 select-none"
          >
            {stamp}
          </motion.span>
        </motion.div>
      ))}
      {/* The survivor — session #51, the one from the Reverse Engineering Tax terminal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: count * 0.015 + 0.3, duration: 0.4 }}
        className="relative col-span-3 rounded border border-amber-500/50 bg-amber-500/10 px-1 py-1"
      >
        <div className="flex items-center gap-0.5 mb-0.5">
          <span className="w-1 h-1 rounded-full bg-amber-400" />
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span className="w-1 h-1 rounded-full bg-slate-700" />
        </div>
        <div className="font-mono text-[7px] text-amber-400">
          #{count + 1} · {youAreHereLabel}
        </div>
      </motion.div>
    </div>
  );
}

export default function BreakingPointSlide({ data }: BreakingPointSlideProps): JSX.Element {
  return (
    <div className="w-full max-w-5xl mx-auto">
      {data.kicker && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="text-[10px] font-mono tracking-[0.3em] text-red-400 uppercase text-center mb-3"
        >
          {data.kicker}
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl sm:text-5xl font-black text-center mb-10 tracking-tight bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent leading-tight pb-1"
      >
        {data.headline}
      </motion.h2>

      {/* Build vs debt counters */}
      <div className="grid grid-cols-3 gap-3 max-w-3xl mx-auto w-full mb-3">
        {data.build.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className="text-center bg-cyan-500/5 border border-cyan-500/25 rounded-xl px-3 py-3"
          >
            <div className="text-2xl sm:text-3xl font-black text-cyan-400">{item.value}</div>
            <div className="text-[11px] text-white/45 mt-1">{item.label}</div>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 max-w-3xl mx-auto w-full mb-10">
        {data.debt.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + idx * 0.1 }}
            className="text-center bg-red-500/5 border border-red-500/25 rounded-xl px-3 py-3"
          >
            <div className="text-2xl sm:text-3xl font-black text-red-400">{item.value}</div>
            <div className="text-[11px] text-white/45 mt-1">{item.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Session graveyard */}
      <div className="mb-10">
        <SessionGraveyard
          count={data.graveyard.count}
          youAreHereLabel={data.graveyard.youAreHereLabel}
          stamp={data.graveyard.stamp}
        />
      </div>

      {/* Flatline + verdict */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.4, duration: 1.0, ease: 'easeInOut' }}
        className="h-px bg-red-500/60 w-full max-w-3xl mx-auto mb-6"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="text-xl sm:text-2xl text-white/80 italic font-light leading-relaxed text-center max-w-3xl mx-auto"
      >
        "{data.bottomLine}"
      </motion.p>
    </div>
  );
}
