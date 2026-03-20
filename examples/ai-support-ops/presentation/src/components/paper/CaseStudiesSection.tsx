import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Star } from 'lucide-react';
import { caseStudies } from '../../data/paper-content';

export default function CaseStudiesSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-sm text-orange-400 mb-4">
            <FlaskConical size={14} />
            Section 6: Case Studies
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Three{' '}
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Validated Projects
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            AutoSpec was validated across three real-world projects of varying scale and complexity, accumulating 837+ tickets and 29+ sprints of evidence.
          </p>
        </motion.div>

        {/* Case study cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {caseStudies.map((cs, index) => (
            <motion.div
              key={cs.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`relative bg-slate-800/50 border rounded-xl p-6 overflow-hidden ${
                cs.featured
                  ? 'border-emerald-500/40 ring-2 ring-emerald-500/20'
                  : 'border-white/10'
              }`}
            >
              {/* Featured badge */}
              {cs.featured && (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs text-emerald-400">
                  <Star size={10} />
                  Self-Validation
                </div>
              )}

              {/* Header */}
              <div className="mb-4">
                <h3 className={`text-xl font-bold mb-1 ${cs.featured ? 'text-emerald-400' : 'text-white'}`}>
                  {cs.name}
                </h3>
                <p className="text-white/50 text-sm">{cs.type}</p>
              </div>

              {/* Metrics 2x2 grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-white">{cs.sprints}</div>
                  <div className="text-white/40 text-xs">Sprints</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-white">{cs.tickets}</div>
                  <div className="text-white/40 text-xs">Tickets</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-white">{cs.points}</div>
                  <div className="text-white/40 text-xs">Story Points</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className={`text-xl font-bold ${cs.coverage === 'N/A' ? 'text-white/40' : 'text-white'}`}>
                    {cs.coverage}
                  </div>
                  <div className="text-white/40 text-xs">Coverage</div>
                </div>
              </div>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-1.5">
                {cs.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs text-white/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 grid grid-cols-3 gap-4 bg-white/5 border border-white/10 rounded-xl p-6"
        >
          {[
            { label: 'Total Tickets', value: '837+' },
            { label: 'Total Sprints', value: '29+' },
            { label: 'Completion Rate', value: '100%' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">{item.value}</div>
              <div className="text-white/40 text-xs mt-1">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
