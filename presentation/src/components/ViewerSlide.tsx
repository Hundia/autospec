import React from 'react';
import { motion } from 'framer-motion';

interface ViewerSlideProps {
  data: {
    title: string;
    url: string;
    features: string[];
    linkText: string;
  };
  lang: 'en' | 'he';
}

export default function ViewerSlide({ data, lang }: ViewerSlideProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-10 text-green-400"
      >
        {data.title}
      </motion.h2>

      {/* Browser mockup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 border border-green-500/20 rounded-xl overflow-hidden mb-8"
      >
        {/* Browser chrome */}
        <div className="bg-black/30 border-b border-green-500/20 px-4 py-3 flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-black/30 rounded-md px-3 py-1 text-sm font-mono text-white/50 text-center">
            {data.url}
          </div>
        </div>

        {/* Dashboard mockup content */}
        <div className="p-6">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {['Specs: 10', 'Tickets: 263', 'Sprints: 25+'].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + idx * 0.1 }}
                className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-3 text-center"
              >
                <span className="text-sm font-mono text-green-300">{stat}</span>
              </motion.div>
            ))}
          </div>

          {/* Chart bars */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-end gap-2 h-20 mb-6"
          >
            {[40, 65, 80, 55, 90, 70, 85, 60].map((h, idx) => (
              <motion.div
                key={idx}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.7 + idx * 0.05, duration: 0.4 }}
                className="flex-1 bg-green-500/30 rounded-t"
              />
            ))}
          </motion.div>

          {/* Spec list */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="space-y-2"
          >
            {['01_product_manager.md', '02_backend_lead.md', '03_frontend_lead.md'].map((file, idx) => (
              <div key={idx} className="bg-black/20 rounded px-3 py-2 text-sm font-mono text-white/50">
                {file}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Feature pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="flex flex-wrap justify-center gap-4 mb-6"
      >
        {data.features.map((feature, idx) => (
          <span
            key={idx}
            className="bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-2 rounded-full text-sm"
          >
            {feature}
          </span>
        ))}
      </motion.div>

      {/* Link text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="text-center text-green-400 text-lg font-semibold"
      >
        {data.linkText}
      </motion.p>
    </div>
  );
}
