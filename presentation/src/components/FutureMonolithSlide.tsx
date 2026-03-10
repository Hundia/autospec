import { motion } from 'framer-motion';

interface FutureMonolithSlideProps {
  data: {
    title: string;
    subtitle: string;
    comparison: {
      microservices: {
        label: string;
        icon: string;
        problems: string[];
      };
      monolith: {
        label: string;
        icon: string;
        benefits: string[];
      };
    };
    callout: string;
  };
  lang: 'en' | 'he';
}

export default function FutureMonolithSlide({ data }: FutureMonolithSlideProps) {
  const { microservices, monolith } = data.comparison;

  return (
    <div className="max-w-5xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-3 bg-gradient-to-r from-slate-300 to-purple-400 bg-clip-text text-transparent"
      >
        {data.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-center text-slate-400 text-base mb-8 max-w-2xl mx-auto"
      >
        {data.subtitle}
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Microservices — problems */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{microservices.icon}</span>
            <h3 className="text-lg font-semibold text-red-400">{microservices.label}</h3>
          </div>
          <div className="space-y-3">
            {microservices.problems.map((problem, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="flex items-start gap-3"
              >
                <span className="text-red-400/70 mt-0.5 flex-shrink-0">✗</span>
                <span className="text-white/70 text-sm">{problem}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Monolith — benefits */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="bg-green-500/10 border border-green-500/30 rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{monolith.icon}</span>
            <h3 className="text-lg font-semibold text-green-400">{monolith.label}</h3>
          </div>
          <div className="space-y-3">
            {monolith.benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 + idx * 0.1 }}
                className="flex items-start gap-3"
              >
                <span className="text-green-400/70 mt-0.5 flex-shrink-0">✓</span>
                <span className="text-white/80 text-sm">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="text-center"
      >
        <p className="text-base text-purple-300 bg-purple-500/10 border border-purple-500/30 rounded-lg px-6 py-3 inline-block">
          {data.callout}
        </p>
      </motion.div>
    </div>
  );
}
