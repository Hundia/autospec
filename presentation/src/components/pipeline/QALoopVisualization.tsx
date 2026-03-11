import React from 'react';
import { motion } from 'framer-motion';

export default function QALoopVisualization({ lang }: { lang: 'en' | 'he' }) {
  const labels = lang === 'he' ? {
    build: 'בנייה',
    test: 'בדיקה',
    fix: 'תיקון',
    verify: 'אימות',
    updateDocs: 'עדכון Docs',
    center: 'לולאת QA',
  } : {
    build: 'Build',
    test: 'Test',
    fix: 'Fix',
    verify: 'Verify',
    updateDocs: 'Update Docs',
    center: 'QA Loop',
  };

  const steps = [
    { label: labels.build, angle: -90, color: '#3b82f6', icon: '🔨' },
    { label: labels.test, angle: -18, color: '#f59e0b', icon: '🧪' },
    { label: labels.fix, angle: 54, color: '#ef4444', icon: '🔧' },
    { label: labels.verify, angle: 126, color: '#22c55e', icon: '✅' },
    { label: labels.updateDocs, angle: 198, color: '#8b5cf6', icon: '📝' },
  ];

  const cx = 200;
  const cy = 170;
  const r = 110;

  return (
    <div className="flex justify-center">
      <svg viewBox="0 0 400 340" className="max-w-md w-full" fill="none">
        {/* Circular path */}
        <motion.circle
          cx={cx} cy={cy} r={r}
          stroke="url(#qaGradient)"
          strokeWidth="2"
          strokeDasharray="8 4"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />

        <defs>
          <linearGradient id="qaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        {/* Center label */}
        <motion.text
          x={cx} y={cy + 5}
          textAnchor="middle"
          fill="#94a3b8"
          fontSize="14"
          fontWeight="bold"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          {labels.center}
        </motion.text>

        {/* Step nodes */}
        {steps.map((step, idx) => {
          const rad = (step.angle * Math.PI) / 180;
          const x = cx + r * Math.cos(rad);
          const y = cy + r * Math.sin(rad);
          return (
            <motion.g
              key={idx}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + idx * 0.2, type: 'spring', stiffness: 200 }}
            >
              <circle cx={x} cy={y} r="30" fill={step.color} fillOpacity="0.15" stroke={step.color} strokeWidth="2" />
              <text x={x} y={y - 5} textAnchor="middle" fontSize="18">{step.icon}</text>
              <text x={x} y={y + 16} textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="600">{step.label}</text>
            </motion.g>
          );
        })}

        {/* Arrows between nodes */}
        {steps.map((step, idx) => {
          const nextIdx = (idx + 1) % steps.length;
          const rad1 = (step.angle * Math.PI) / 180;
          const rad2 = (steps[nextIdx].angle * Math.PI) / 180;
          const x1 = cx + (r - 2) * Math.cos(rad1 + 0.25);
          const y1 = cy + (r - 2) * Math.sin(rad1 + 0.25);
          const x2 = cx + (r - 2) * Math.cos(rad2 - 0.25);
          const y2 = cy + (r - 2) * Math.sin(rad2 - 0.25);
          return (
            <motion.line
              key={`arrow-${idx}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#475569"
              strokeWidth="1.5"
              markerEnd="url(#arrowhead)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.5 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2 + idx * 0.1 }}
            />
          );
        })}

        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#475569" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
