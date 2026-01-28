import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import type { ProjectState, Sprint, Ticket } from '../../../types/index';
import { TicketList } from '../components/TicketCard';
import { StatusBadge, ModelBadge } from '../components/Badges';
import { StatCard } from '../components/StatCard';

interface SprintViewProps {
  state: ProjectState | null;
}

export default function SprintView({ state }: SprintViewProps) {
  const { id } = useParams();
  const sprintId = id ? parseInt(id, 10) : undefined;

  const sprints = state ? Array.from(state.sprints.values()) : [];
  const sortedSprints = [...sprints].sort((a, b) => a.id - b.id);

  // If no sprint selected, show sprint selector
  if (sprintId === undefined) {
    return <SprintSelector sprints={sortedSprints} state={state} />;
  }

  const sprint = state?.sprints.get(sprintId);
  const summary = state?.sprintSummaries.get(sprintId);

  if (!sprint) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Sprint not found</div>
      </div>
    );
  }

  // Calculate sprint stats
  const totalTickets = sprint.tickets.length;
  const completedTickets = sprint.tickets.filter((t) => t.status === 'done').length;
  const totalPoints = sprint.tickets.reduce((sum, t) => sum + t.storyPoints, 0);
  const completedPoints = sprint.tickets
    .filter((t) => t.status === 'done')
    .reduce((sum, t) => sum + t.storyPoints, 0);

  // Model distribution
  const modelCounts = { haiku: 0, sonnet: 0, opus: 0 };
  sprint.tickets.forEach((t) => {
    if (t.model in modelCounts) {
      modelCounts[t.model as keyof typeof modelCounts]++;
    }
  });

  const modelData = [
    { name: 'Haiku', count: modelCounts.haiku, fill: '#10b981' },
    { name: 'Sonnet', count: modelCounts.sonnet, fill: '#3b82f6' },
    { name: 'Opus', count: modelCounts.opus, fill: '#8b5cf6' },
  ];

  // Navigation
  const currentIndex = sortedSprints.findIndex((s) => s.id === sprintId);
  const prevSprint = currentIndex > 0 ? sortedSprints[currentIndex - 1] : null;
  const nextSprint =
    currentIndex < sortedSprints.length - 1 ? sortedSprints[currentIndex + 1] : null;

  return (
    <div className="space-y-6">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {prevSprint && (
            <Link
              to={`/sprints/${prevSprint.id}`}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
            >
              <ChevronLeft size={20} />
            </Link>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">
              Sprint {sprint.id}: {sprint.name}
            </h1>
            <p className="text-slate-400 mt-1">
              {completedTickets} of {totalTickets} tickets completed
            </p>
          </div>
          {nextSprint && (
            <Link
              to={`/sprints/${nextSprint.id}`}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
            >
              <ChevronRight size={20} />
            </Link>
          )}
        </div>
        <Link
          to="/sprints"
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          View all sprints
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={Calendar}
          label="Tickets"
          value={`${completedTickets}/${totalTickets}`}
          subvalue="completed"
          color="blue"
        />
        <StatCard
          icon={TrendingUp}
          label="Points"
          value={`${completedPoints}/${totalPoints}`}
          subvalue="story points"
          color="green"
        />
        <StatCard
          icon={Users}
          label="Agents"
          value={summary?.agents?.count || '-'}
          subvalue={
            summary?.agents?.parallelization
              ? `${summary.agents.parallelization}% parallelization`
              : 'sessions'
          }
          color="purple"
        />
        <StatCard
          icon={Clock}
          label="Duration"
          value={summary?.duration?.totalHours ? `${summary.duration.totalHours}h` : '-'}
          subvalue="total time"
          color="amber"
        />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-white">Tickets</h2>
          <TicketList tickets={sprint.tickets} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Model Distribution */}
          <div className="card">
            <div className="card-header">Model Distribution</div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={modelData} layout="vertical">
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    width={60}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Agent Sessions */}
          {summary?.agents?.sessions && summary.agents.sessions.length > 0 && (
            <div className="card">
              <div className="card-header">Agent Sessions</div>
              <div className="card-body space-y-3">
                {summary.agents.sessions.map((session: any) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                  >
                    <div>
                      <p className="text-white font-medium">{session.name}</p>
                      <p className="text-slate-400 text-sm capitalize">{session.role}</p>
                    </div>
                    <ModelBadge model={session.model || 'sonnet'} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prompts Used */}
          {summary?.prompts && summary.prompts.length > 0 && (
            <div className="card">
              <div className="card-header">Prompts Used</div>
              <div className="card-body space-y-2">
                {summary.prompts.slice(0, 5).map((prompt: any, i: number) => (
                  <div
                    key={i}
                    className="text-sm p-2 bg-slate-700/50 rounded font-mono text-slate-300"
                  >
                    {prompt.hash || `prompt-${i + 1}`}
                  </div>
                ))}
                {summary.prompts.length > 5 && (
                  <p className="text-slate-400 text-sm">
                    +{summary.prompts.length - 5} more prompts
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sprint selector component
function SprintSelector({
  sprints,
  state,
}: {
  sprints: Sprint[];
  state: ProjectState | null;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Sprints</h1>
        <p className="text-slate-400 mt-1">
          {sprints.length} sprints in this project
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sprints.map((sprint) => {
          const completed = sprint.tickets.filter((t) => t.status === 'done').length;
          const total = sprint.tickets.length;
          const progress = total > 0 ? (completed / total) * 100 : 0;
          const summary = state?.sprintSummaries.get(sprint.id);

          return (
            <Link
              key={sprint.id}
              to={`/sprints/${sprint.id}`}
              className="card p-4 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold">
                    Sprint {sprint.id}
                  </h3>
                  <p className="text-slate-400 text-sm">{sprint.name}</p>
                </div>
                <span className="text-slate-400 text-sm">
                  {completed}/{total}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  {sprint.tickets.reduce((sum, t) => sum + t.storyPoints, 0)} points
                </span>
                {summary?.duration?.totalHours && (
                  <span>{summary.duration.totalHours}h</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {sprints.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-slate-400">No sprints found in backlog.md</p>
        </div>
      )}
    </div>
  );
}
