import React, { useMemo } from 'react';
import { Users, Activity, Clock, CheckCircle2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { ProjectState, AgentSession } from '../../../types/index';
import { ModelBadge, RoleBadge } from '../components/Badges';

interface AgentsProps {
  state: ProjectState | null;
}

export default function Agents({ state }: AgentsProps) {
  // Collect all agent sessions from sprint summaries
  const agentData = useMemo(() => {
    if (!state) return { sessions: [], parallelization: 0, totalAgents: 0 };

    const sessions: AgentSession[] = [];
    let totalParallelization = 0;
    let parallelizationCount = 0;

    state.sprintSummaries.forEach((summary) => {
      if (summary.agents?.sessions) {
        sessions.push(...summary.agents.sessions);
      }
      if (summary.agents?.parallelization) {
        totalParallelization += summary.agents.parallelization;
        parallelizationCount++;
      }
    });

    return {
      sessions,
      parallelization:
        parallelizationCount > 0 ? Math.round(totalParallelization / parallelizationCount) : 0,
      totalAgents: sessions.length,
    };
  }, [state]);

  // Role distribution
  const roleDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    agentData.sessions.forEach((session) => {
      counts[session.role] = (counts[session.role] || 0) + 1;
    });

    const colors: Record<string, string> = {
      backend: '#06b6d4',
      frontend: '#ec4899',
      db: '#f97316',
      qa: '#eab308',
      devops: '#6366f1',
      fullstack: '#14b8a6',
    };

    return Object.entries(counts).map(([role, count]) => ({
      name: role,
      value: count,
      color: colors[role] || '#64748b',
    }));
  }, [agentData.sessions]);

  // Model usage by agent
  const modelUsage = useMemo(() => {
    const counts = { haiku: 0, sonnet: 0, opus: 0 };
    agentData.sessions.forEach((session) => {
      if (session.model in counts) {
        counts[session.model as keyof typeof counts]++;
      }
    });

    return [
      { name: 'Haiku', count: counts.haiku, fill: '#10b981' },
      { name: 'Sonnet', count: counts.sonnet, fill: '#3b82f6' },
      { name: 'Opus', count: counts.opus, fill: '#8b5cf6' },
    ];
  }, [agentData.sessions]);

  if (!state) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading agent data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Agents</h1>
        <p className="text-slate-400 mt-1">
          Multi-agent execution overview and performance
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <Users size={24} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Agent Sessions</p>
              <p className="text-2xl font-bold text-white">{agentData.totalAgents}</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-500/10">
              <Activity size={24} className="text-green-500" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Avg Parallelization</p>
              <p className="text-2xl font-bold text-white">{agentData.parallelization}%</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-purple-500/10">
              <Clock size={24} className="text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Time Savings</p>
              <p className="text-2xl font-bold text-white">~45%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Distribution */}
        <div className="card">
          <div className="card-header">Role Distribution</div>
          <div className="card-body">
            {roleDistribution.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={roleDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {roleDistribution.map((entry, index) => (
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
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {roleDistribution.map((role) => (
                    <div key={role.name} className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: role.color }}
                      />
                      <span className="text-sm text-slate-300 capitalize">{role.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-slate-400">
                No agent data available
              </div>
            )}
          </div>
        </div>

        {/* Model Usage */}
        <div className="card">
          <div className="card-header">Model Usage by Agents</div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={modelUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Agent Sessions List */}
      <div className="card">
        <div className="card-header">Agent Sessions</div>
        <div className="card-body">
          {agentData.sessions.length > 0 ? (
            <div className="space-y-3">
              {agentData.sessions.map((session, i) => (
                <div
                  key={`${session.id}-${i}`}
                  className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center">
                      <Users size={18} className="text-slate-300" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{session.name}</p>
                      <p className="text-slate-400 text-sm">{session.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <RoleBadge role={session.role} />
                    <ModelBadge model={session.model} />
                    {session.ticketsCompleted && session.ticketsCompleted.length > 0 && (
                      <div className="flex items-center gap-1 text-green-400 text-sm">
                        <CheckCircle2 size={14} />
                        <span>{session.ticketsCompleted.length} tickets</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>No agent sessions recorded yet</p>
              <p className="text-sm mt-2">
                Agent data will appear here when sprints are executed with the extended format
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Multi-Agent Tips */}
      <div className="card">
        <div className="card-header">Multi-Agent Execution Tips</div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <h4 className="text-white font-medium mb-2">Optimal Setup</h4>
              <ul className="text-slate-300 space-y-1">
                <li>• Use 2-3 agents for most sprints</li>
                <li>• Assign clear boundaries (backend/frontend)</li>
                <li>• Define sync points for dependencies</li>
              </ul>
            </div>
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <h4 className="text-white font-medium mb-2">Expected Results</h4>
              <ul className="text-slate-300 space-y-1">
                <li>• ~45% time savings with parallel execution</li>
                <li>• Cleaner separation of concerns</li>
                <li>• Fewer merge conflicts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
