import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Database, ExternalLink, Clock, FileText, GitBranch, CheckCircle2 } from 'lucide-react';

const caseStudies = [
  {
    name: 'ShopFlow',
    type: 'E-Commerce Platform',
    icon: ShoppingCart,
    color: 'orange',
    description: 'Full-stack e-commerce with payments, inventory, and order management',
    stats: {
      tickets: 174,
      sprints: 7,
      specs: 10,
      lines: '12,000+',
    },
    timeline: [
      { phase: 'Requirements', time: '3 hours' },
      { phase: 'Spec Generation', time: '15 min' },
      { phase: 'Sprint 0-1', time: '6 hours' },
      { phase: 'Sprint 2-3', time: '8 hours' },
      { phase: 'Total', time: '~20 hours' },
    ],
    features: [
      'User auth & profiles',
      'Product catalog with search',
      'Shopping cart & wishlist',
      'Stripe payment integration',
      'Order management & tracking',
      'Admin dashboard',
    ],
    link: '#',
  },
  {
    name: 'DataHub',
    type: 'API Service',
    icon: Database,
    color: 'cyan',
    description: 'Enterprise API gateway with rate limiting, webhooks, and analytics',
    stats: {
      tickets: 89,
      sprints: 4,
      specs: 10,
      lines: '6,500+',
    },
    timeline: [
      { phase: 'Requirements', time: '2 hours' },
      { phase: 'Spec Generation', time: '10 min' },
      { phase: 'Sprint 0-1', time: '4 hours' },
      { phase: 'Sprint 2-3', time: '5 hours' },
      { phase: 'Total', time: '~12 hours' },
    ],
    features: [
      'API key management',
      'Rate limiting & quotas',
      'Webhook system',
      'Usage analytics',
      'Multi-tenant architecture',
      'Runnable example code',
    ],
    link: '#',
    runnable: true,
  },
];

const colorClasses: Record<string, { bg: string; border: string; icon: string; accent: string }> = {
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: 'text-orange-500', accent: 'from-orange-500 to-amber-500' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', icon: 'text-cyan-500', accent: 'from-cyan-500 to-blue-500' },
};

export default function CaseStudiesSection() {
  return (
    <section id="examples" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-sm text-orange-400 mb-4">
            Case Studies
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Learn by Example
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Explore real projects built with AutoSpec from start to finish
          </p>
        </motion.div>

        {/* Case Studies Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {caseStudies.map((study, index) => {
            const colors = colorClasses[study.color];
            return (
              <motion.div
                key={study.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`${colors.bg} ${colors.border} border rounded-2xl overflow-hidden`}
              >
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.accent}`}>
                        <study.icon className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{study.name}</h3>
                        <p className="text-sm text-white/60">{study.type}</p>
                      </div>
                    </div>
                    {study.runnable && (
                      <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-400">
                        Runnable
                      </span>
                    )}
                  </div>
                  <p className="text-white/70">{study.description}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 p-6 bg-black/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{study.stats.tickets}</div>
                    <div className="text-xs text-white/50">Tickets</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{study.stats.sprints}</div>
                    <div className="text-xs text-white/50">Sprints</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{study.stats.specs}</div>
                    <div className="text-xs text-white/50">Specs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{study.stats.lines}</div>
                    <div className="text-xs text-white/50">Lines</div>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                  {/* Timeline */}
                  <div className="p-6">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-white/80 mb-4">
                      <Clock size={16} />
                      Timeline
                    </h4>
                    <div className="space-y-2">
                      {study.timeline.map((item) => (
                        <div key={item.phase} className="flex justify-between text-sm">
                          <span className="text-white/60">{item.phase}</span>
                          <span className="text-white font-mono">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="p-6">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-white/80 mb-4">
                      <CheckCircle2 size={16} />
                      Features
                    </h4>
                    <ul className="space-y-2">
                      {study.features.slice(0, 5).map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-white/60">
                          <div className={`w-1.5 h-1.5 rounded-full ${colors.icon.replace('text', 'bg')}`} />
                          {feature}
                        </li>
                      ))}
                      {study.features.length > 5 && (
                        <li className="text-sm text-white/40">
                          +{study.features.length - 5} more...
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 flex gap-3">
                  <a
                    href={study.link}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white/80 transition-colors"
                  >
                    <FileText size={16} />
                    View Specs
                  </a>
                  <a
                    href={study.link}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white/80 transition-colors"
                  >
                    <GitBranch size={16} />
                    View Code
                  </a>
                  {study.runnable && (
                    <a
                      href={study.link}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r ${colors.accent} rounded-lg text-sm text-white font-medium transition-opacity hover:opacity-90`}
                    >
                      <ExternalLink size={16} />
                      Run
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* More Examples Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-12"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            View all examples
            <ExternalLink size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
