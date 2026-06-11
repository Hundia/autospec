import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

// ─── SVG Drop-shadow filter (shared) ──────────────────────────────────────────
function SvgDefs() {
  return (
    <defs>
      <filter id="card-shadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.35" />
      </filter>
      <filter id="node-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#60a5fa" floodOpacity="0.4" />
      </filter>
      <filter id="green-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#34d399" floodOpacity="0.4" />
      </filter>
      <filter id="purple-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#a78bfa" floodOpacity="0.4" />
      </filter>
      <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.15" />
      </linearGradient>
      <linearGradient id="green-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#059669" stopOpacity="0.15" />
      </linearGradient>
      <linearGradient id="purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.15" />
      </linearGradient>
      <linearGradient id="card-grad-blue" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#172a47" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="card-grad-green" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1a3a2f" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#122b22" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="product-img" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
      <linearGradient id="flow-node-1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id="flow-node-2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id="flow-node-3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#db2777" stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id="flow-node-4" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id="flow-node-5" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
      </linearGradient>
    </defs>
  );
}

// ─── Tab 1: Architecture ──────────────────────────────────────────────────────
function ArchitectureTab() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start('visible');
  }, [controls]);

  const nodeVariants = {
    hidden: { opacity: 0, scale: 0.7 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.18, duration: 0.4, ease: 'backOut' },
    }),
  };

  const arrowVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: { delay: 0.55 + i * 0.2, duration: 0.5, ease: 'easeInOut' },
    }),
  };

  const labelVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.9 + i * 0.1, duration: 0.3 },
    }),
  };

  return (
    <svg viewBox="0 0 500 200" className="w-full" aria-label="System Architecture Diagram">
      <SvgDefs />

      {/* Background grid */}
      <pattern id="arch-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
      </pattern>
      <rect width="500" height="200" fill="url(#arch-grid)" />

      {/* ── Node 1: React Frontend ── */}
      <motion.g
        custom={0}
        initial="hidden"
        animate={controls}
        variants={nodeVariants}
        filter="url(#node-glow)"
      >
        <rect x="20" y="55" width="130" height="90" rx="12" fill="url(#blue-grad)" stroke="#3b82f6" strokeWidth="1.5" />
        {/* Monitor icon */}
        <rect x="55" y="68" width="60" height="38" rx="4" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
        <rect x="71" y="106" width="28" height="4" rx="2" fill="#3b82f6" fillOpacity="0.5" />
        <line x1="60" y1="82" x2="110" y2="82" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="60" y1="90" x2="95" y2="90" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.4" />
        <text x="85" y="127" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="700" fontFamily="monospace">React</text>
        <text x="85" y="138" textAnchor="middle" fill="#60a5fa" fontSize="7.5" fontFamily="monospace">Frontend</text>
      </motion.g>

      {/* ── Node 2: NestJS API ── */}
      <motion.g
        custom={1}
        initial="hidden"
        animate={controls}
        variants={nodeVariants}
        filter="url(#green-glow)"
      >
        <rect x="185" y="55" width="130" height="90" rx="12" fill="url(#green-grad)" stroke="#10b981" strokeWidth="1.5" />
        {/* Server/API icon */}
        <rect x="220" y="68" width="60" height="12" rx="3" fill="none" stroke="#34d399" strokeWidth="1.3" />
        <circle cx="225" cy="74" r="2.5" fill="#34d399" fillOpacity="0.7" />
        <rect x="220" y="84" width="60" height="12" rx="3" fill="none" stroke="#34d399" strokeWidth="1.3" />
        <circle cx="225" cy="90" r="2.5" fill="#34d399" fillOpacity="0.5" />
        <rect x="220" y="100" width="60" height="12" rx="3" fill="none" stroke="#34d399" strokeWidth="1.3" />
        <circle cx="225" cy="106" r="2.5" fill="#34d399" fillOpacity="0.3" />
        <text x="250" y="127" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontWeight="700" fontFamily="monospace">NestJS</text>
        <text x="250" y="138" textAnchor="middle" fill="#34d399" fontSize="7.5" fontFamily="monospace">API Layer</text>
      </motion.g>

      {/* ── Node 3: PostgreSQL ── */}
      <motion.g
        custom={2}
        initial="hidden"
        animate={controls}
        variants={nodeVariants}
        filter="url(#purple-glow)"
      >
        <rect x="350" y="55" width="130" height="90" rx="12" fill="url(#purple-grad)" stroke="#8b5cf6" strokeWidth="1.5" />
        {/* Database cylinder icon */}
        <ellipse cx="415" cy="76" rx="30" ry="8" fill="none" stroke="#a78bfa" strokeWidth="1.3" />
        <line x1="385" y1="76" x2="385" y2="106" stroke="#a78bfa" strokeWidth="1.3" />
        <line x1="445" y1="76" x2="445" y2="106" stroke="#a78bfa" strokeWidth="1.3" />
        <ellipse cx="415" cy="106" rx="30" ry="8" fill="none" stroke="#a78bfa" strokeWidth="1.3" />
        <ellipse cx="415" cy="91" rx="30" ry="4" fill="none" stroke="#a78bfa" strokeWidth="0.8" strokeDasharray="3 2" />
        <text x="415" y="127" textAnchor="middle" fill="#c4b5fd" fontSize="9" fontWeight="700" fontFamily="monospace">PostgreSQL</text>
        <text x="415" y="138" textAnchor="middle" fill="#a78bfa" fontSize="7.5" fontFamily="monospace">Database</text>
      </motion.g>

      {/* ── Arrow 1: Frontend → API ── */}
      <motion.path
        d="M 152 100 L 183 100"
        fill="none"
        stroke="#60a5fa"
        strokeWidth="2"
        strokeLinecap="round"
        markerEnd="url(#arrow-blue)"
        custom={0}
        initial="hidden"
        animate={controls}
        variants={arrowVariants}
      />
      <defs>
        <marker id="arrow-blue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#60a5fa" />
        </marker>
        <marker id="arrow-green" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#34d399" />
        </marker>
      </defs>
      <motion.path
        d="M 167 92 L 181 100"
        fill="none"
        stroke="#60a5fa"
        strokeWidth="1"
        strokeOpacity="0.4"
        custom={0}
        initial="hidden"
        animate={controls}
        variants={arrowVariants}
      />

      {/* ── Arrow 2: API → Database ── */}
      <motion.path
        d="M 317 100 L 348 100"
        fill="none"
        stroke="#34d399"
        strokeWidth="2"
        strokeLinecap="round"
        markerEnd="url(#arrow-green)"
        custom={1}
        initial="hidden"
        animate={controls}
        variants={arrowVariants}
      />

      {/* ── Monorepo label ── */}
      <motion.g
        custom={0}
        initial="hidden"
        animate={controls}
        variants={labelVariants}
      >
        <rect x="100" y="162" width="300" height="22" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <text x="250" y="177" textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="monospace">
          Monorepo — shared types &amp; validation
        </text>
      </motion.g>

      {/* ── Protocol badges ── */}
      <motion.text
        x="167" y="94"
        textAnchor="middle"
        fill="#fbbf24"
        fontSize="7"
        fontFamily="monospace"
        custom={1}
        initial="hidden"
        animate={controls}
        variants={labelVariants}
      >
        REST
      </motion.text>
      <motion.text
        x="333" y="94"
        textAnchor="middle"
        fill="#fbbf24"
        fontSize="7"
        fontFamily="monospace"
        custom={2}
        initial="hidden"
        animate={controls}
        variants={labelVariants}
      >
        SQL
      </motion.text>
    </svg>
  );
}

// ─── Tab 2: Kanban Board ──────────────────────────────────────────────────────
const kanbanCards = [
  { col: 0, id: 'SF-042', title: 'Product search', sub: 'filter & sort' },
  { col: 0, id: 'SF-045', title: 'Reviews module', sub: 'ratings & comments' },
  { col: 1, id: 'SF-043', title: 'Cart persistence', sub: 'localStorage sync' },
  { col: 1, id: 'SF-044', title: 'Stripe checkout', sub: 'payment flow' },
  { col: 2, id: 'SF-040', title: 'User auth', sub: 'JWT + OTP' },
  { col: 2, id: 'SF-041', title: 'Product catalog', sub: 'listing + detail' },
];

const colConfig = [
  { label: 'To Do', headerFill: '#334155', headerStroke: '#475569', cardStroke: '#475569', dotFill: '#94a3b8', textFill: '#cbd5e1' },
  { label: 'In Progress', headerFill: '#1e3a5f', headerStroke: '#3b82f6', cardStroke: '#3b82f6', dotFill: '#60a5fa', textFill: '#93c5fd' },
  { label: 'Done', headerFill: '#1a3a2f', headerStroke: '#10b981', cardStroke: '#10b981', dotFill: '#34d399', textFill: '#6ee7b7' },
];

function KanbanTab() {
  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.15 + i * 0.1, duration: 0.35, ease: 'easeOut' },
    }),
  };

  return (
    <svg viewBox="0 0 500 220" className="w-full" aria-label="Bolt Kanban Board">
      <SvgDefs />
      <pattern id="kanban-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
      </pattern>
      <rect width="500" height="220" fill="url(#kanban-grid)" />

      {/* Title */}
      <text x="250" y="22" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="700" fontFamily="monospace">Bolt Kanban Board</text>

      {/* Columns */}
      {colConfig.map((col, ci) => {
        const x = 15 + ci * 163;
        return (
          <g key={ci}>
            {/* Column bg */}
            <rect x={x} y="30" width="155" height="182" rx="8" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
            {/* Column header */}
            <rect x={x} y="30" width="155" height="26" rx="8" fill={col.headerFill} stroke={col.headerStroke} strokeWidth="1" />
            <rect x={x} y="48" width="155" height="8" fill={col.headerFill} />
            <circle cx={x + 12} cy="43" r="4" fill={col.dotFill} />
            <text x={x + 22} y="47" fill={col.textFill} fontSize="9" fontWeight="700" fontFamily="monospace">{col.label}</text>
          </g>
        );
      })}

      {/* Cards */}
      {kanbanCards.map((card, i) => {
        const col = colConfig[card.col];
        const x = 15 + card.col * 163;
        const cardIndex = kanbanCards.filter(c => c.col === card.col && kanbanCards.indexOf(c) < i).length;
        const y = 64 + cardIndex * 68;

        return (
          <motion.g
            key={card.id}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <rect x={x + 6} y={y} width="143" height="56" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" filter="url(#card-shadow)" />
            {/* Left accent border */}
            <rect x={x + 6} y={y} width="4" height="56" rx="2" fill={col.cardStroke} />
            {/* Ticket ID badge */}
            <rect x={x + 16} y={y + 8} width="38" height="13" rx="3" fill={col.headerFill} stroke={col.cardStroke} strokeWidth="0.8" />
            <text x={x + 35} y={y + 18.5} textAnchor="middle" fill={col.textFill} fontSize="7" fontFamily="monospace" fontWeight="700">{card.id}</text>
            {/* Title */}
            <text x={x + 16} y={y + 34} fill="#e2e8f0" fontSize="8.5" fontFamily="monospace" fontWeight="600">{card.title}</text>
            {/* Subtitle */}
            <text x={x + 16} y={y + 46} fill="#64748b" fontSize="7.5" fontFamily="monospace">{card.sub}</text>
          </motion.g>
        );
      })}
    </svg>
  );
}

// ─── Tab 3: Checkout Flow ─────────────────────────────────────────────────────
const flowNodes = [
  { label: 'Cart', icon: '🛒', grad: 'flow-node-1', stroke: '#3b82f6' },
  { label: 'Address', icon: '📍', grad: 'flow-node-2', stroke: '#8b5cf6' },
  { label: 'Payment', icon: '💳', grad: 'flow-node-3', stroke: '#ec4899' },
  { label: 'Confirm', icon: '✓', grad: 'flow-node-4', stroke: '#f59e0b' },
  { label: 'Order', icon: '📦', grad: 'flow-node-5', stroke: '#10b981' },
];

const stateBadges = [
  { label: 'pending', color: '#64748b', bg: '#1e293b' },
  { label: 'processing', color: '#60a5fa', bg: '#1e3a5f' },
  { label: 'paid', color: '#34d399', bg: '#1a3a2f' },
  { label: 'shipped', color: '#a78bfa', bg: '#2d1f5e' },
];

function FlowsTab() {
  const nodeW = 72;
  const nodeH = 52;
  const nodeSpacing = 100;
  const startX = 14;
  const nodeY = 28;

  const nodeVariants = {
    hidden: { opacity: 0, scale: 0.6 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.14, duration: 0.35, ease: 'backOut' },
    }),
  };

  const arrowVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: { delay: 0.18 + i * 0.14, duration: 0.3 },
    }),
  };

  const badgeVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.8 + i * 0.1, duration: 0.25 },
    }),
  };

  return (
    <svg viewBox="0 0 500 180" className="w-full" aria-label="Checkout Flow Diagram">
      <SvgDefs />
      <pattern id="flow-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
      </pattern>
      <rect width="500" height="180" fill="url(#flow-grid)" />

      <defs>
        <marker id="flow-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill="#475569" />
        </marker>
      </defs>

      <text x="250" y="20" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="700" fontFamily="monospace">Checkout Flow</text>

      {/* Arrows between nodes */}
      {flowNodes.slice(0, -1).map((_, i) => {
        const x1 = startX + i * nodeSpacing + nodeW;
        const y1 = nodeY + nodeH / 2;
        const x2 = startX + (i + 1) * nodeSpacing;
        return (
          <motion.path
            key={i}
            d={`M ${x1} ${y1} L ${x2} ${y1}`}
            fill="none"
            stroke="#475569"
            strokeWidth="1.8"
            markerEnd="url(#flow-arrow)"
            custom={i}
            initial="hidden"
            animate="visible"
            variants={arrowVariants}
          />
        );
      })}

      {/* Nodes */}
      {flowNodes.map((node, i) => {
        const x = startX + i * nodeSpacing;
        const cx = x + nodeW / 2;
        const cy = nodeY + nodeH / 2;
        return (
          <motion.g
            key={node.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={nodeVariants}
          >
            <rect x={x} y={nodeY} width={nodeW} height={nodeH} rx="10" fill={`url(#${node.grad})`} stroke={node.stroke} strokeWidth="1.5" filter="url(#card-shadow)" />
            <text x={cx} y={nodeY + 22} textAnchor="middle" fontSize="16" fontFamily="sans-serif">{node.icon}</text>
            <text x={cx} y={nodeY + 40} textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="700" fontFamily="monospace">{node.label}</text>
          </motion.g>
        );
      })}

      {/* Divider */}
      <line x1="20" y1="102" x2="480" y2="102" stroke="#1e293b" strokeWidth="1" />

      {/* State badges */}
      <text x="20" y="120" fill="#64748b" fontSize="8.5" fontFamily="monospace">Order states:</text>
      {stateBadges.map((badge, i) => {
        const bx = 20 + i * 118;
        return (
          <motion.g
            key={badge.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={badgeVariants}
          >
            <rect x={bx} y="127" width="96" height="22" rx="6" fill={badge.bg} stroke={badge.color} strokeWidth="1" />
            <circle cx={bx + 12} cy="138" r="3.5" fill={badge.color} />
            <text x={bx + 22} y="142" fill={badge.color} fontSize="8.5" fontWeight="600" fontFamily="monospace">{badge.label}</text>
            {i < stateBadges.length - 1 && (
              <text x={bx + 104} y="142" fill="#475569" fontSize="10" fontFamily="monospace">→</text>
            )}
          </motion.g>
        );
      })}

      {/* Auth flow mini */}
      <text x="20" y="168" fill="#64748b" fontSize="8" fontFamily="monospace">Auth:</text>
      {['Login', 'OTP', 'JWT', 'Routes'].map((step, i) => (
        <g key={step}>
          <text x={55 + i * 108} y="168" fill="#94a3b8" fontSize="8" fontFamily="monospace">{step}</text>
          {i < 3 && <text x={95 + i * 108} y="168" fill="#334155" fontSize="9" fontFamily="monospace">→</text>}
        </g>
      ))}
    </svg>
  );
}

// ─── Tab 4: Mock Screens ──────────────────────────────────────────────────────
const products = [
  { name: 'Wireless Earbuds', price: '$29.99', shade: '#1e293b' },
  { name: 'USB-C Hub', price: '$49.99', shade: '#1a2535' },
  { name: 'LED Desk Lamp', price: '$19.99', shade: '#1c2b40' },
];

function MockScreenTab() {
  const cardVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 + i * 0.12, duration: 0.35, ease: 'easeOut' },
    }),
  };

  return (
    <svg viewBox="0 0 500 240" className="w-full" aria-label="Product Catalog Wireframe">
      <SvgDefs />
      <defs>
        <linearGradient id="screen-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#0c1524" />
        </linearGradient>
        <linearGradient id="btn-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* App frame */}
      <rect width="500" height="240" fill="url(#screen-bg)" />

      {/* Top bar */}
      <rect x="0" y="0" width="500" height="32" fill="#0f172a" />
      <text x="20" y="21" fill="#e2e8f0" fontSize="10" fontWeight="700" fontFamily="monospace">ShopAI</text>
      <rect x="380" y="9" width="48" height="14" rx="7" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <text x="404" y="20" textAnchor="middle" fill="#60a5fa" fontSize="8" fontFamily="monospace">Cart 3</text>
      <circle cx="460" cy="16" r="8" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <text x="460" y="20" textAnchor="middle" fill="#94a3b8" fontSize="9">👤</text>

      {/* Search bar */}
      <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
        <rect x="16" y="40" width="380" height="28" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        {/* Magnifier icon */}
        <circle cx="32" cy="54" r="6" fill="none" stroke="#64748b" strokeWidth="1.5" />
        <line x1="36.2" y1="58.2" x2="40" y2="62" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
        <text x="46" y="58" fill="#475569" fontSize="9" fontFamily="monospace">Search products...</text>
      </motion.g>

      {/* Filter button */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, delay: 0.1 }}>
        <rect x="404" y="40" width="80" height="28" rx="8" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1" />
        <text x="444" y="58" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="600" fontFamily="monospace">Filter ▾</text>
      </motion.g>

      {/* Category chips */}
      {['All', 'Electronics', 'Home', 'Audio'].map((cat, i) => (
        <motion.g key={cat} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 + i * 0.06 }}>
          <rect x={16 + i * 74} y="76" width="66" height="18" rx="9"
            fill={i === 0 ? '#1e3a5f' : '#0f172a'}
            stroke={i === 0 ? '#3b82f6' : '#1e293b'}
            strokeWidth="1" />
          <text x={49 + i * 74} y="89" textAnchor="middle" fill={i === 0 ? '#93c5fd' : '#475569'} fontSize="8" fontFamily="monospace">{cat}</text>
        </motion.g>
      ))}

      {/* Product cards */}
      {products.map((product, i) => {
        const px = 16 + i * 160;
        return (
          <motion.g
            key={product.name}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            filter="url(#card-shadow)"
          >
            {/* Card */}
            <rect x={px} y="102" width="148" height="112" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="1" />
            {/* Image placeholder */}
            <rect x={px + 8} y="110" width="132" height="56" rx="6" fill="url(#product-img)" />
            {/* Image shimmer lines */}
            <line x1={px + 32} y1="128" x2={px + 112} y2="128" stroke="#334155" strokeWidth="1" />
            <line x1={px + 40} y1="136" x2={px + 100} y2="136" stroke="#334155" strokeWidth="1" />
            <circle cx={px + 74} cy="140" r="10" fill="#0f172a" fillOpacity="0.4" stroke="#475569" strokeWidth="1" />
            <text x={px + 74} y="144" textAnchor="middle" fill="#475569" fontSize="12">📦</text>
            {/* Product name */}
            <text x={px + 8} y="181" fill="#e2e8f0" fontSize="8" fontFamily="monospace" fontWeight="600">{product.name}</text>
            {/* Price */}
            <text x={px + 8} y="194" fill="#34d399" fontSize="10" fontWeight="700" fontFamily="monospace">{product.price}</text>
            {/* Add to Cart button */}
            <rect x={px + 8} y="200" width="132" height="8" rx="4" fill="url(#btn-grad)" />
          </motion.g>
        );
      })}

      {/* Pagination dots */}
      {[0, 1, 2, 3, 4].map((dot, i) => (
        <circle key={i} cx={234 + i * 12} cy="228" r={i === 0 ? 4 : 2.5} fill={i === 0 ? '#3b82f6' : '#334155'} />
      ))}
    </svg>
  );
}

// ─── Tab configuration ────────────────────────────────────────────────────────
const tabLabels = {
  en: ['Architecture', 'Backlog', 'Flows', 'Mock Screens'],
  he: ['ארכיטקטורה', 'באקלוג', 'תהליכים', 'מסכי דמו'],
};

const tabComponents = [ArchitectureTab, KanbanTab, FlowsTab, MockScreenTab];

// ─── Main BrowserMockup component ────────────────────────────────────────────
export default function BrowserMockup({ lang }: { lang: 'en' | 'he' }) {
  const [activeTab, setActiveTab] = useState(0);
  const labels = tabLabels[lang];
  const ActiveTabComponent = tabComponents[activeTab];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-950 rounded-xl border-2 border-amber-500/30 overflow-hidden max-w-3xl mx-auto shadow-2xl shadow-amber-500/10"
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border-b border-slate-700">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <div className="flex-1 mx-4 bg-slate-700 rounded-md px-3 py-1 text-xs text-slate-400 font-mono">
          https://hundia.github.io/autospec/viewer
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-slate-700 bg-slate-900/50">
        {labels.map((label, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              idx === activeTab
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-4 min-h-[240px] bg-slate-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <ActiveTabComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
