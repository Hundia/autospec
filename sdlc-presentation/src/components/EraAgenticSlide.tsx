import { Fragment } from 'react';
import { motion } from 'framer-motion';

interface EraAgenticSlideProps {
  data: {
    title: string;
    subtitle: string;
    tools: string[];
    power: Array<{ title: string; description: string }>;
    danger: Array<{ title: string; description: string }>;
  };
  lang: 'en' | 'he';
}

export default function EraAgenticSlide({ data }: EraAgenticSlideProps): JSX.Element {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-3 text-cyan-400"
      >
        {data.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-center text-slate-400 text-lg mb-6"
      >
        {data.subtitle}
      </motion.p>

      {/* Tool cards */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center gap-4 mb-8 flex-wrap"
      >
        {data.tools.map((tool, idx) => (
          <motion.span
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 + idx * 0.1 }}
            className="px-5 py-2 bg-cyan-500/20 border border-cyan-400/40 rounded-lg text-cyan-300 text-sm font-semibold"
          >
            {tool}
          </motion.span>
        ))}
      </motion.div>

      {/* Column headers — outside the card grid so they don't stretch */}
      <div className="grid grid-cols-2 gap-x-6 mb-3">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-cyan-400 font-bold text-xl text-center"
        >
          The Power
        </motion.h3>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-amber-400 font-bold text-xl text-center"
        >
          The Danger
        </motion.h3>
      </div>

      {/* Card rows: equal-height pairs */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 auto-rows-fr items-stretch">
        {data.power.map((powerItem, idx) => {
          const dangerItem = data.danger[idx];
          return (
            <Fragment key={idx}>
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.12 }}
                className="h-full bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4"
              >
                <p className="text-white font-semibold text-sm mb-0.5">{powerItem.title}</p>
                <p className="text-slate-400 text-xs">{powerItem.description}</p>
              </motion.div>

              {dangerItem && (
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.12 }}
                  animate-custom={idx === data.danger.length - 1 ? 'glitch' : undefined}
                  className="h-full bg-amber-500/10 border border-amber-500/40 border-dashed rounded-lg p-4"
                >
                  <p className="text-amber-300 font-semibold text-sm mb-0.5">
                    <span className="mr-1">⚠️</span>
                    {dangerItem.title}
                  </p>
                  <p className="text-slate-400 text-xs">{dangerItem.description}</p>
                </motion.div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
