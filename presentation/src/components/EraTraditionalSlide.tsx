import { motion } from 'framer-motion';

interface EraTraditionalSlideProps {
  data: {
    title: string;
    subtitle: string;
    characteristics: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    metrics: {
      speed: string;
      predictability: string;
      docs: string;
      knowledge: string;
    };
  };
  lang: 'en' | 'he';
}

export default function EraTraditionalSlide({ data }: EraTraditionalSlideProps): JSX.Element {
  const metricItems = [
    { label: 'Speed', value: data.metrics.speed },
    { label: 'Predictability', value: data.metrics.predictability },
    { label: 'Docs', value: data.metrics.docs },
    { label: 'Knowledge', value: data.metrics.knowledge },
  ];

  return (
    <div className="max-w-5xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-3 text-slate-400"
      >
        {data.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center text-slate-400 text-lg mb-10"
      >
        {data.subtitle}
      </motion.p>

      {/* 2x2 characteristic cards */}
      <div className="grid grid-cols-2 gap-5 mb-10">
        {data.characteristics.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.3, duration: 0.5 }}
            className="bg-white/5 border border-slate-600/40 rounded-xl p-6 flex items-start gap-4"
          >
            <span className="text-3xl flex-shrink-0">{item.icon}</span>
            <div>
              <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom metrics bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="grid grid-cols-4 gap-3 bg-slate-800/60 border border-slate-600/30 rounded-xl p-4"
      >
        {metricItems.map((m, idx) => (
          <div key={idx} className="text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{m.label}</p>
            <p className="text-slate-300 font-semibold text-sm">{m.value}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
