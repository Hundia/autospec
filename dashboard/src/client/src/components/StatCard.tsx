import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  subvalue?: string;
  color?: 'green' | 'blue' | 'red' | 'purple' | 'amber' | 'slate';
}

const colorClasses = {
  green: 'text-green-500 bg-green-500/10',
  blue: 'text-blue-500 bg-blue-500/10',
  red: 'text-red-500 bg-red-500/10',
  purple: 'text-purple-500 bg-purple-500/10',
  amber: 'text-amber-500 bg-amber-500/10',
  slate: 'text-slate-400 bg-slate-500/10',
};

export function StatCard({
  icon: Icon,
  label,
  value,
  subvalue,
  color = 'blue',
}: StatCardProps) {
  const iconColor = colorClasses[color].split(' ')[0];
  const bgColor = colorClasses[color].split(' ')[1];

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subvalue && (
            <p className="text-xs text-slate-500 mt-1">{subvalue}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon size={24} className={iconColor} />
        </div>
      </div>
    </div>
  );
}
