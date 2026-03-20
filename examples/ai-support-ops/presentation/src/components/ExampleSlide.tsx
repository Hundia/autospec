import React from 'react';
import { motion } from 'framer-motion';

interface ExampleSlideProps {
  data: {
    title: string;
    project: {
      name: string;
      description: string;
      stats: {
        specs: number;
        tickets: number;
        sprints: number;
      };
    };
    timeline: Array<{
      phase: string;
      duration: string;
      output: string;
    }>;
    features: string[];
  };
  lang: 'en' | 'he';
}

export default function ExampleSlide({ data, lang }: ExampleSlideProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl font-bold text-center mb-8 text-orange-400"
      >
        {data.title}
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white/5 border border-orange-500/30 rounded-xl p-6 mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">{data.project.name}</h3>
            <p className="text-white/60 mb-4">{data.project.description}</p>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">{data.project.stats.specs}</div>
                <div className="text-xs text-white/50">Specs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">{data.project.stats.tickets}</div>
                <div className="text-xs text-white/50">Tickets</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">{data.project.stats.sprints}</div>
                <div className="text-xs text-white/50">Sprints</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-orange-500/20 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-white/50 mb-3">Features Built</h4>
            <div className="flex flex-wrap gap-2">
              {data.features.map((feature, idx) => (
                <span key={idx} className="bg-orange-500/10 text-orange-300 px-3 py-1 rounded text-sm">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {data.timeline.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-4 p-4 rounded-lg ${
                idx === data.timeline.length - 1
                  ? 'bg-orange-500/20 border border-orange-500/30'
                  : 'bg-white/5'
              }`}
            >
              <div className="w-24 text-white/50 text-sm">{item.phase}</div>
              <div className="w-20 text-orange-400 font-mono text-sm">{item.duration}</div>
              <div className="flex-1 text-white/80 text-sm">{item.output}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
