import React from 'react';
import { motion } from 'framer-motion';

export default function WorktreeDiagram({ lang }: { lang: 'en' | 'he' }) {
  const isHe = lang === 'he';

  const orchestrator = isHe ? 'Opus מתזמר' : 'Opus Orchestrator';
  const merge = isHe ? 'מיזוג → main' : 'Merge → main';

  const agents = [
    { name: 'Sonnet A', task: 'Backend', items: ['API endpoints', 'DB migration', 'Validation'], color: '#6366f1', x: 40 },
    { name: 'Sonnet B', task: 'Frontend', items: ['Components', 'State mgmt', 'Routing'], color: '#8b5cf6', x: 210 },
    { name: 'Sonnet C', task: isHe ? 'בדיקות' : 'QA + Docs', items: ['API tests', 'E2E tests', 'Update docs/'], color: '#a78bfa', x: 380 },
  ];

  return (
    <div className="flex justify-center">
      <svg viewBox="0 0 560 340" className="max-w-2xl w-full" fill="none">
        <defs>
          <filter id="wt-shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Orchestrator box */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <rect x="165" y="10" width="230" height="55" rx="12" fill="#4f46e5" fillOpacity="0.25" stroke="#6366f1" strokeWidth="2" filter="url(#wt-shadow)" />
          <text x="280" y="32" textAnchor="middle" fill="#c7d2fe" fontSize="11" fontWeight="400">PM Agent</text>
          <text x="280" y="50" textAnchor="middle" fill="#a5b4fc" fontSize="15" fontWeight="bold">{orchestrator}</text>
        </motion.g>

        {/* Fan-out lines */}
        {agents.map((agent, idx) => (
          <motion.g key={`conn-${idx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}>
            <line x1="280" y1="65" x2={agent.x + 75} y2="115" stroke={agent.color} strokeWidth="2" strokeDasharray="6 4" opacity="0.5" />
            <circle cx={agent.x + 75} cy="115" r="3" fill={agent.color} />
          </motion.g>
        ))}

        {/* Agent boxes */}
        {agents.map((agent, idx) => (
          <motion.g key={`agent-${idx}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + idx * 0.12, duration: 0.4 }}>
            <rect x={agent.x} y="120" width="150" height="110" rx="10" fill={agent.color} fillOpacity="0.12" stroke={agent.color} strokeWidth="1.5" filter="url(#wt-shadow)" />
            {/* Header bar */}
            <rect x={agent.x} y="120" width="150" height="28" rx="10" fill={agent.color} fillOpacity="0.2" />
            <rect x={agent.x} y="138" width="150" height="10" fill={agent.color} fillOpacity="0.2" />
            <circle cx={agent.x + 14} cy="134" r="4" fill={agent.color} opacity="0.7" />
            <text x={agent.x + 24} y="138" fill="#e0e7ff" fontSize="12" fontWeight="bold">{agent.name}</text>
            <text x={agent.x + 130} y="138" textAnchor="end" fill={agent.color} fontSize="9" fontFamily="monospace" fontWeight="600">{agent.task}</text>
            {agent.items.map((item, i) => (
              <text key={i} x={agent.x + 16} y={162 + i * 18} fill="#94a3b8" fontSize="10" fontFamily="monospace">{item}</text>
            ))}
          </motion.g>
        ))}

        {/* Fan-in lines to merge */}
        {agents.map((agent, idx) => (
          <motion.g key={`merge-${idx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 + idx * 0.1, duration: 0.4 }}>
            <line x1={agent.x + 75} y1="230" x2="280" y2="275" stroke={agent.color} strokeWidth="2" strokeDasharray="6 4" opacity="0.5" />
            <circle cx="280" cy="275" r="3" fill="#22c55e" />
          </motion.g>
        ))}

        {/* Merge box */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.5 }}>
          <rect x="190" y="280" width="180" height="45" rx="10" fill="#22c55e" fillOpacity="0.15" stroke="#22c55e" strokeWidth="2" filter="url(#wt-shadow)" />
          <text x="280" y="307" textAnchor="middle" fill="#86efac" fontSize="14" fontWeight="bold">{merge}</text>
        </motion.g>
      </svg>
    </div>
  );
}
