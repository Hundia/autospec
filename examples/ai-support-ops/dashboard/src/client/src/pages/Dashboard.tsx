import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { ProjectState } from '../../../types/index';
import { StatusBadge, ModelBadge } from '../components/Badges';
import { StatCard } from '../components/StatCard';

interface DashboardProps {
  state: ProjectState | null;
}

export default function Dashboard({ state }: DashboardProps) {
  if (!state) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading project data...</div>
      </div>
    );
  }

  // Calculate stats
  const sprints = Array.from(state.sprints.values());
  const allTickets = sprints.flatMap((s) => s.tickets);

  const totalTickets = allTickets.length;
  const completedTickets = allTickets.filter((t) => t.status === 'done').length;
  const inProgressTickets = allTickets.filter((t) => t.status === 'in-progress').length;
  const blockedTickets = allTickets.filter((t) => t.status === 'blocked').length;

  const totalPoints = allTickets.reduce((sum, t) => sum + t.storyPoints, 0);
  const completedPoints = allTickets
    .filter((t) => t.status === 'done')
    .reduce((sum, t) => sum + t.storyPoints, 0);

  const completionRate = totalTickets > 0 ? Math.round((completedTickets / totalTickets) * 100) : 0;

  // Model distribution
  const modelCounts = { haiku: 0, sonnet: 0, opus: 0 };
  allTickets.forEach((t) => {
    if (t.model in modelCounts) {
      modelCounts[t.model as keyof typeof modelCounts]++;
    }
  });

  const modelData = [
    { name: 'Haiku', value: modelCounts.haiku, color: '#10b981' },
    { name: 'Sonnet', value: modelCounts.sonnet, color: '#3b82f6' },
    { name: 'Opus', value: modelCounts.opus, color: '#8b5cf6' },
  ].filter((d) => d.value > 0);

  // Recent activity
  const recentTickets = [...allTickets]
    .filter((t) => t.completedAt)
    .sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || ''))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">
          Overview of your spec-driven development progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={completedTickets}
          subvalue={`of ${totalTickets} tickets`}
          color="green"
        />
        <StatCard
          icon={Clock}
          label="In Progress"
          value={inProgressTickets}
          subvalue="active tickets"
          color="blue"
        />
        <StatCard
          icon={AlertCircle}
          label="Blocked"
          value={blockedTickets}
          subvalue="need attention"
          color="red"
        />
        <StatCard
          icon={TrendingUp}
          label="Velocity"
          value={completedPoints}
          subvalue={`of ${totalPoints} points`}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Burndown Chart */}
        <div className="lg:col-span-2 card">
          <div className="card-header flex items-center justify-between">
            <span>Sprint Burndown</span>
            <span className="text-sm text-slate-400">
              {completionRate}% complete
            </span>
          </div>
          <div className="card-body">
            {state.burndown.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={state.burndown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="remaining"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                    name="Remaining"
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.3}
                    name="Completed"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-slate-400">
                No burndown data available
              </div>
            )}
          </div>
        </div>

        {/* Model Distribution */}
        <div className="card">
          <div className="card-header">Model Distribution</div>
          <div className="card-body">
            {modelData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={modelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {modelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  {modelData.map((model) => (
                    <div key={model.name} className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: model.color }}
                      />
                      <span className="text-sm text-slate-300">
                        {model.name}: {model.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[150px] flex items-center justify-center text-slate-400">
                No model data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sprint Overview */}
        <div className="card">
          <div className="card-header">Sprint Overview</div>
          <div className="card-body">
            {sprints.length > 0 ? (
              <div className="space-y-3">
                {sprints.slice(0, 5).map((sprint) => {
                  const done = sprint.tickets.filter((t) => t.status === 'done').length;
                  const total = sprint.tickets.length;
                  const progress = total > 0 ? (done / total) * 100 : 0;

                  return (
                    <div key={sprint.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-200">
                          Sprint {sprint.id}: {sprint.name}
                        </span>
                        <span className="text-slate-400">
                          {done}/{total}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-slate-400 text-center py-4">
                No sprints found
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">Recent Completions</div>
          <div className="card-body">
            {recentTickets.length > 0 ? (
              <div className="space-y-3">
                {recentTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-green-500" />
                      <span className="text-slate-200">{ticket.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ModelBadge model={ticket.model} />
                      <span className="text-slate-500 text-xs">
                        {ticket.completedAt
                          ? new Date(ticket.completedAt).toLocaleDateString()
                          : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-400 text-center py-4">
                No completed tickets yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
