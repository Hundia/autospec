import React from 'react';
import { motion } from 'framer-motion';

export default function WorktreeDiagram({ lang }: { lang: 'en' | 'he' }) {
  const labels = lang === 'he' ? {
    orchestrator: 'Opus מתזמר',
    agentA: 'Sonnet A',
    agentB: 'Sonnet B',
    agentC: 'Sonnet C',
    taskA: 'Backend',
    taskB: 'Frontend',
    taskC: 'Docs',
    worktreeA: 'worktree-a',
    worktreeB: 'worktree-b',
    worktreeC: 'worktree-c',
    merge: 'מיזוג → main',
  } : {
    orchestrator: 'Opus Orchestrator',
    agentA: 'Sonnet A',
    agentB: 'Sonnet B',
    agentC: 'Sonnet C',
    taskA: 'Backend',
    taskB: 'Frontend',
    taskC: 'Docs',
    worktreeA: 'worktree-a',
    worktreeB: 'worktree-b',
    worktreeC: 'worktree-c',
    merge: 'Merge → main',
  };

  const agents = [
    { name: labels.agentA, task: labels.taskA, worktree: labels.worktreeA, color: '#6366f1', x: 80 },
    { name: labels.agentB, task: labels.taskB, worktree: labels.worktreeB, color: '#8b5cf6', x: 250 },
    { name: labels.agentC, task: labels.taskC, worktree: labels.worktreeC, color: '#a78bfa', x: 420 },
  ];

  return (
    <div className="flex justify-center">
      <svg viewBox="0 0 560 320" className="max-w-2xl w-full" fill="none">
        {/* Orchestrator */}
        <motion.g
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <rect x="190" y="10" width="180" height="50" rx="12" fill="#4f46e5" fillOpacity="0.3" stroke="#6366f1" strokeWidth="2" />
          <text x="280" y="40" textAnchor="middle" fill="#a5b4fc" fontSize="14" fontWeight="bold">{labels.orchestrator}</text>
        </motion.g>

        {/* Connecting lines */}
        {agents.map((agent, idx) => (
          <motion.line
            key={`line-${idx}`}
            x1="280" y1="60"
            x2={agent.x + 60} y2="110"
            stroke={agent.color}
            strokeWidth="2"
            strokeDasharray="6 3"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + idx * 0.15, duration: 0.5 }}
          />
        ))}

        {/* Agent boxes */}
        {agents.map((agent, idx) => (
          <motion.g
            key={`agent-${idx}`}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + idx * 0.15, type: 'spring' }}
          >
            <rect x={agent.x} y="110" width="120" height="70" rx="10" fill={agent.color} fillOpacity="0.15" stroke={agent.color} strokeWidth="1.5" />
            <text x={agent.x + 60} y="135" textAnchor="middle" fill="#e0e7ff" fontSize="13" fontWeight="bold">{agent.name}</text>
            <text x={agent.x + 60} y="155" textAnchor="middle" fill="#a5b4fc" fontSize="11">{agent.task}</text>
            <text x={agent.x + 60} y="172" textAnchor="middle" fill="#6366f1" fontSize="9" fontFamily="monospace">{agent.worktree}</text>
          </motion.g>
        ))}

        {/* Down arrows to merge */}
        {agents.map((agent, idx) => (
          <motion.line
            key={`merge-${idx}`}
            x1={agent.x + 60} y1="180"
            x2="280" y2="250"
            stroke={agent.color}
            strokeWidth="2"
            strokeDasharray="6 3"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 + idx * 0.15, duration: 0.5 }}
          />
        ))}

        {/* Merge box */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <rect x="200" y="250" width="160" height="45" rx="10" fill="#22c55e" fillOpacity="0.2" stroke="#22c55e" strokeWidth="2" />
          <text x="280" y="278" textAnchor="middle" fill="#86efac" fontSize="14" fontWeight="bold">{labels.merge}</text>
        </motion.g>
      </svg>
    </div>
  );
}
