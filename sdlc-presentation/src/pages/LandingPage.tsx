import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background gradient blobs */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(ellipse at 20% 30%, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.10) 40%, transparent 70%)',
            'radial-gradient(ellipse at 70% 60%, rgba(139,92,246,0.15) 0%, rgba(6,182,212,0.10) 40%, transparent 70%)',
            'radial-gradient(ellipse at 40% 20%, rgba(6,182,212,0.15) 0%, rgba(59,130,246,0.10) 40%, transparent 70%)',
            'radial-gradient(ellipse at 20% 30%, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.10) 40%, transparent 70%)',
          ],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-blue-400/10 pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${3 + Math.random() * 5}px`,
            height: `${3 + Math.random() * 5}px`,
          }}
          animate={{
            x: [0, (Math.random() - 0.5) * 60, 0],
            y: [0, (Math.random() - 0.5) * 60, 0],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: 8 + Math.random() * 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * -10,
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-8"
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-cyan-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <span className="text-xs text-white/60 tracking-widest uppercase font-medium">
            Enterprise Agentic Development
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="text-6xl sm:text-8xl font-black mb-4 tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 40%, #22d3ee 80%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 30px rgba(96,165,250,0.3))',
          }}
        >
          The Agentic SDLC
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl sm:text-2xl text-white/60 mb-6 font-light"
        >
          Spec-Driven Development at Enterprise Scale
        </motion.p>

        {/* Tagline */}
        <motion.blockquote
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-base sm:text-lg text-cyan-300/80 italic mb-12 px-4 border-l-4 border-cyan-500/40 text-left max-w-xl mx-auto"
        >
          "The Spec is the Truth. The Harness is the Guardrail. The Human is the Judge."
        </motion.blockquote>

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            to="/presentation"
            className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white font-semibold text-lg shadow-2xl shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-blue-500/50"
          >
            Start Presentation
            <ArrowRight size={22} />
          </Link>
        </motion.div>

        {/* Back to main site */}
        <motion.a
          href="https://hundia.github.io/autospec/"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.4 }}
          className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-sm transition-colors"
        >
          <ExternalLink size={14} />
          AutoSpec — hundia.github.io/autospec
        </motion.a>
      </div>

      {/* Bottom trademark */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/20">
        The Agentic SDLC · AutoSpec™ by Eli Hundia
      </div>
    </div>
  );
}
