import { motion } from 'framer-motion';

interface MemoryCard {
  text: string;
  dropped: boolean;
}

interface ContextPoisoningSlideProps {
  data: {
    kicker: string;
    title: string;
    subtitle: string;
    fullContext: {
      label: string;
      cards: MemoryCard[];
    };
    compaction: {
      operation: string;
      caption: string;
      droppedTag: string;
    };
    lossySummary: {
      label: string;
      retained: string;
      text: string;
    };
    verdict: {
      agentLine: string;
      dagger: string;
    };
  };
  lang: 'en' | 'he';
}

export default function ContextPoisoningSlide({ data }: ContextPoisoningSlideProps): JSX.Element {
  const droppedCards = data.fullContext.cards.filter((c) => c.dropped);

  return (
    <div className="max-w-5xl mx-auto w-full flex flex-col gap-4">
      {/* Kicker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="text-[10px] font-mono tracking-[0.4em] text-slate-500 uppercase text-center"
      >
        {data.kicker}
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-4xl sm:text-5xl font-black text-center bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent leading-tight pb-1"
      >
        {data.title}
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.35 }}
        className="text-center text-slate-400 text-sm max-w-3xl mx-auto leading-relaxed"
      >
        {data.subtitle}
      </motion.p>

      {/* Mechanism diagram — forced LTR (causal left→right flow) */}
      <div dir="ltr" className="mt-2">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 sm:gap-6 items-center">
          {/* LEFT: Full Context */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/80">
              {data.fullContext.label}
            </span>
            {data.fullContext.cards.map((card, idx) => {
              const baseDelay = 0.4 + idx * 0.1;
              if (card.dropped) {
                // Appears intact, then dims as the compaction passes
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: [0, 1, 1, 0.18], y: [12, 0, 0, 0] }}
                    transition={{ delay: baseDelay, duration: 1.3, times: [0, 0.12, 0.55, 0.72] }}
                    className="rounded-lg border border-emerald-500/30 bg-emerald-500/[0.06] px-3 py-1.5 text-[11px] font-mono text-emerald-200/90"
                  >
                    {card.text}
                  </motion.div>
                );
              }
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: baseDelay, duration: 0.35 }}
                  className="rounded-lg border border-emerald-500/30 bg-emerald-500/[0.06] px-3 py-1.5 text-[11px] font-mono text-emerald-200/90"
                >
                  {card.text}
                </motion.div>
              );
            })}
          </div>

          {/* CENTER: Compaction seam */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: [0, -3, 3, -2, 2, 0] }}
            transition={{ delay: 0.9, duration: 0.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
            className="flex flex-col items-center gap-2 px-1"
          >
            <div className="h-10 w-[3px] bg-gradient-to-b from-cyan-400/0 via-cyan-300/70 to-cyan-400/0" />
            <span className="whitespace-nowrap bg-slate-800 border border-cyan-400/40 text-cyan-300 font-mono text-[10px] tracking-[0.2em] rounded-full px-2.5 py-1">
              {data.compaction.operation}
            </span>
            <span className="text-[9px] font-mono text-slate-500 whitespace-nowrap">
              {data.compaction.caption}
            </span>
            <div className="h-10 w-[3px] bg-gradient-to-b from-cyan-400/0 via-cyan-300/70 to-cyan-400/0" />
          </motion.div>

          {/* RIGHT: Lossy Summary */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/80">
              {data.lossySummary.label}
            </span>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6, duration: 0.4 }}
              className="relative rounded-lg border border-amber-500/40 bg-amber-500/[0.06] px-3 py-3 text-[11px] font-mono text-amber-100/90 leading-relaxed"
            >
              <span className="absolute top-2 right-2 text-[9px] bg-amber-500/20 text-amber-300 rounded-full px-2 py-0.5">
                {data.lossySummary.retained}
              </span>
              <span className="block mt-4">{data.lossySummary.text}</span>
            </motion.div>
          </div>
        </div>

        {/* Casualties — what fell out during compaction */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 mt-5"
        >
          <span className="text-[9px] font-mono uppercase tracking-widest text-red-400/70">
            {data.compaction.droppedTag}
          </span>
          {droppedCards.map((card, idx) => (
            <span
              key={idx}
              className="rounded-md border border-slate-700 bg-slate-900/40 px-2.5 py-1 text-[10px] font-mono text-slate-500 line-through"
            >
              {card.text}
            </span>
          ))}
        </motion.div>

        {/* Verdict strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.45 }}
          className="mt-5 border-l-2 border-red-500/60 bg-red-500/[0.08] rounded px-4 py-3 flex flex-col gap-1.5"
        >
          <span className="font-mono text-xs text-red-200">
            <span className="text-violet-300/70">agent ▸ </span>
            "{data.verdict.agentLine}"
          </span>
          <motion.span
            animate={{ opacity: [1, 0.55, 1] }}
            transition={{ delay: 2.5, duration: 1.4, repeat: 1 }}
            className="font-bold text-white text-sm"
          >
            {data.verdict.dagger}
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
}
