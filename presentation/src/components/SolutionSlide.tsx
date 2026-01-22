import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface SolutionSlideProps {
  data: {
    title: string;
    flow: Array<{
      step: string;
      icon: string;
      description: string;
    }>;
    keyInsight: string;
  };
  lang: 'en' | 'he';
}

export default function SolutionSlide({ data, lang }: SolutionSlideProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-12 text-green-400"
      >
        {data.title}
      </motion.h2>

      {/* Flow Diagram */}
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-12">
        {data.flow.map((item, idx) => (
          <React.Fragment key={idx}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + idx * 0.15 }}
              className="bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl p-4 sm:p-6 text-center min-w-[120px]"
            >
              <div className="text-3xl sm:text-4xl mb-2">{item.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-1">{item.step}</h3>
              <p className="text-xs sm:text-sm text-white/60">{item.description}</p>
            </motion.div>
            {idx < data.flow.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + idx * 0.15 }}
              >
                <ArrowRight className="text-green-400/50 w-6 h-6" />
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Key Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-center"
      >
        <p className="text-xl text-green-300 bg-green-500/10 border border-green-500/30 rounded-lg px-6 py-4 inline-block">
          💡 {data.keyInsight}
        </p>
      </motion.div>
    </div>
  );
}
