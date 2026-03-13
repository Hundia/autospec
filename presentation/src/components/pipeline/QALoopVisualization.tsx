import React from 'react';
import { motion } from 'framer-motion';

export default function QALoopVisualization({ lang }: { lang: 'en' | 'he' }) {
  const isHe = lang === 'he';

  const steps = [
    { icon: '🔨', label: isHe ? 'בנייה' : 'Build', color: '#3b82f6', desc: 'npm run build' },
    { icon: '🧪', label: isHe ? 'בדיקה' : 'Test', color: '#f59e0b', desc: isHe ? 'הרצת בדיקות' : 'Run test suite' },
    { icon: '🔧', label: isHe ? 'תיקון' : 'Fix', color: '#ef4444', desc: isHe ? 'תקן שגיאות' : 'Fix failures' },
    { icon: '✅', label: isHe ? 'אימות' : 'Verify', color: '#22c55e', desc: isHe ? 'אמת תיקון' : 'Confirm fix works' },
    { icon: '📝', label: isHe ? 'עדכן Docs' : 'Update Docs', color: '#8b5cf6', desc: isHe ? 'עדכן דוקומנטציה' : 'Update docs/' },
  ];

  const nodeW = 80;
  const gap = 20;
  const totalW = steps.length * nodeW + (steps.length - 1) * gap;
  const startX = (560 - totalW) / 2;

  return (
    <div className="flex justify-center">
      <svg viewBox="0 0 560 200" className="max-w-2xl w-full" fill="none">
        <defs>
          <filter id="qa-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
          </filter>
          <marker id="qa-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#475569" />
          </marker>
        </defs>

        {/* Step nodes */}
        {steps.map((step, idx) => {
          const x = startX + idx * (nodeW + gap);
          const cx = x + nodeW / 2;
          return (
            <motion.g
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.12, duration: 0.4 }}
            >
              <rect x={x} y="30" width={nodeW} height={nodeW} rx="14" fill={step.color} fillOpacity="0.12" stroke={step.color} strokeWidth="2" filter="url(#qa-glow)" />
              <text x={cx} y="65" textAnchor="middle" fontSize="24">{step.icon}</text>
              <text x={cx} y="95" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">{step.label}</text>
              <text x={cx} y="135" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">{step.desc}</text>

              {idx < steps.length - 1 && (
                <line
                  x1={x + nodeW + 2} y1="70"
                  x2={x + nodeW + gap - 2} y2="70"
                  stroke="#475569"
                  strokeWidth="2"
                  markerEnd="url(#qa-arrow)"
                  opacity="0.7"
                />
              )}
            </motion.g>
          );
        })}

        {/* Feedback loop arrow (from Verify back to Build) */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
          <path
            d={`M ${startX + 3 * (nodeW + gap) + nodeW / 2} 115
                C ${startX + 3 * (nodeW + gap) + nodeW / 2} 175,
                  ${startX + nodeW / 2} 175,
                  ${startX + nodeW / 2} 115`}
            stroke="#ef4444"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            fill="none"
            opacity="0.4"
            markerEnd="url(#qa-arrow)"
          />
          <text x="280" y="185" textAnchor="middle" fill="#ef4444" fontSize="9" opacity="0.6">
            {isHe ? 'חזור אם נכשל' : 'Loop if tests fail'}
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
