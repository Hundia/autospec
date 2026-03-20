import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Github, BookOpen } from 'lucide-react';

interface ClosingSlideProps {
  data: {
    title: string;
    install: string;
    commands: Array<{
      cmd: string;
      desc: string;
    }>;
    links: {
      github: string;
      docs: string;
    };
    tagline: string;
  };
  lang: 'en' | 'he';
}

export default function ClosingSlide({ data, lang }: ClosingSlideProps) {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold text-white mb-8"
      >
        {data.title}
      </motion.h2>

      {/* Install Command */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-black/50 border border-green-500/30 rounded-xl p-6 mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Terminal className="text-green-400" size={20} />
          <span className="text-white/50 text-sm">Install</span>
        </div>
        <code className="text-xl sm:text-2xl text-green-400 font-mono">
          {data.install}
        </code>
      </motion.div>

      {/* Commands */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 rounded-xl p-6 mb-8"
      >
        <div className="space-y-3">
          {data.commands.map((cmd, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4 text-left">
              <code className="text-blue-400 font-mono bg-black/30 px-3 py-2 rounded">
                {cmd.cmd}
              </code>
              <span className="text-white/60 text-sm">{cmd.desc}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center gap-6 mb-12"
      >
        <a
          href={`https://${data.links.github}`}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <Github size={20} />
          <span>{data.links.github}</span>
        </a>
        <a
          href={`https://${data.links.docs}`}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <BookOpen size={20} />
          <span>{data.links.docs}</span>
        </a>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-2xl sm:text-3xl text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text font-bold"
      >
        {data.tagline}
      </motion.p>
    </div>
  );
}
