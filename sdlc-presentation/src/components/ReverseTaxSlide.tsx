import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

interface ReverseTaxSlideProps {
  data: {
    title: string;
    subtitle: string;
    dayOne: { title: string; items: string[] };
    daySixty: { title: string; items: string[] };
    cost: { hours: number; label: string };
    callout?: string;
  };
  lang: 'en' | 'he';
}

export default function ReverseTaxSlide({ data }: ReverseTaxSlideProps): JSX.Element {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, data.cost.hours, { duration: 2, delay: 1.2, ease: 'easeOut' });
    return controls.stop;
  }, [count, data.cost.hours]);

  return (
    <div className="max-w-5xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-3 text-red-500"
      >
        {data.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-center text-slate-400 text-lg mb-10"
      >
        {data.subtitle}
      </motion.p>

      {/* Two column split */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Day 1 */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-green-500/10 border border-green-500/30 rounded-xl p-6"
        >
          <h3 className="text-green-400 font-bold text-2xl mb-5 text-center">{data.dayOne.title}</h3>
          <ul className="space-y-3">
            {data.dayOne.items.map((item, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + idx * 0.15 }}
                className="flex items-start gap-2 text-green-300 text-sm"
              >
                <span className="text-green-400 mt-0.5">✓</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Day 60 */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-6"
        >
          <h3 className="text-red-400 font-bold text-2xl mb-5 text-center">{data.daySixty.title}</h3>
          <ul className="space-y-3">
            {data.daySixty.items.map((item, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 + idx * 0.15 }}
                className="flex items-start gap-2 text-red-300 text-sm"
              >
                <span className="text-red-400 mt-0.5">✗</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Animated cost counter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="text-center bg-red-900/30 border border-red-500/30 rounded-xl px-6 py-5"
      >
        <div className="flex items-baseline justify-center gap-2 mb-1">
          <motion.span className="text-5xl font-black text-red-400">{rounded}</motion.span>
          <span className="text-2xl font-bold text-red-400">hrs</span>
        </div>
        <p className="text-slate-400 text-sm">{data.cost.label}</p>
      </motion.div>

      {/* Callout */}
      {data.callout && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0 }}
          className="mt-5 text-center bg-amber-500/10 border border-amber-500/30 rounded-xl px-6 py-4"
        >
          <p className="text-amber-300 text-sm font-semibold italic">{data.callout}</p>
        </motion.div>
      )}
    </div>
  );
}
