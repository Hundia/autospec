import React from 'react';
import type { TicketStatus, ModelTier } from '../../../types/index';

interface StatusBadgeProps {
  status: TicketStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const baseClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  const statusConfig: Record<TicketStatus, { label: string; classes: string }> = {
    todo: { label: 'Todo', classes: 'bg-slate-600 text-slate-200' },
    'in-progress': { label: 'In Progress', classes: 'bg-blue-600 text-blue-100' },
    'qa-review': { label: 'QA Review', classes: 'bg-amber-600 text-amber-100' },
    done: { label: 'Done', classes: 'bg-green-600 text-green-100' },
    blocked: { label: 'Blocked', classes: 'bg-red-600 text-red-100' },
  };

  const config = statusConfig[status] || statusConfig.todo;

  return (
    <span className={`${baseClasses} ${config.classes} rounded-full font-medium`}>
      {config.label}
    </span>
  );
}

interface ModelBadgeProps {
  model: ModelTier;
  size?: 'sm' | 'md';
}

export function ModelBadge({ model, size = 'sm' }: ModelBadgeProps) {
  const baseClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  const modelConfig: Record<ModelTier, { label: string; classes: string }> = {
    haiku: { label: 'Haiku', classes: 'bg-emerald-900 text-emerald-300 border border-emerald-700' },
    sonnet: { label: 'Sonnet', classes: 'bg-blue-900 text-blue-300 border border-blue-700' },
    opus: { label: 'Opus', classes: 'bg-purple-900 text-purple-300 border border-purple-700' },
  };

  const config = modelConfig[model] || modelConfig.sonnet;

  return (
    <span className={`${baseClasses} ${config.classes} rounded font-medium`}>
      {config.label}
    </span>
  );
}

interface RoleBadgeProps {
  role: string;
  size?: 'sm' | 'md';
}

export function RoleBadge({ role, size = 'sm' }: RoleBadgeProps) {
  const baseClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  const roleConfig: Record<string, { label: string; classes: string }> = {
    backend: { label: 'Backend', classes: 'bg-cyan-900 text-cyan-300' },
    frontend: { label: 'Frontend', classes: 'bg-pink-900 text-pink-300' },
    db: { label: 'Database', classes: 'bg-orange-900 text-orange-300' },
    qa: { label: 'QA', classes: 'bg-yellow-900 text-yellow-300' },
    devops: { label: 'DevOps', classes: 'bg-indigo-900 text-indigo-300' },
    fullstack: { label: 'Full Stack', classes: 'bg-teal-900 text-teal-300' },
  };

  const config = roleConfig[role.toLowerCase()] || { label: role, classes: 'bg-slate-700 text-slate-300' };

  return (
    <span className={`${baseClasses} ${config.classes} rounded font-medium`}>
      {config.label}
    </span>
  );
}
