import React, { useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  BarChart3,
  PieChart as PieChartIcon,
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
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import type { ProjectState } from '../../../types/index';
import { StatCard } from '../components/StatCard';

interface MetricsProps {
  state: ProjectState | null;
}

// Estimated costs per model (per task, simplified)
const MODEL_COSTS = {
  haiku: 0.10,
  sonnet: 0.50,
  opus: 2.00,
};

export default function Metrics({ state }: MetricsProps) {
  const metrics = useMemo(() => {
    if (!state) return null;

    const sprints = Array.from(state.sprints.values());
    const allTickets = sprints.flatMap((s) => s.tickets);

    // Basic counts
    const totalTickets = allTickets.length;
    const completedTickets = allTickets.filter((t) => t.status === 'done').length;
    const totalPoints = allTickets.reduce((sum, t) => sum + t.storyPoints, 0);
    const completedPoints = allTickets
      .filter((t) => t.status === 'done')
      .reduce((sum, t) => sum + t.storyPoints, 0);

    // Model distribution
    const modelCounts = { haiku: 0, sonnet: 0, opus: 0 };
    allTickets.forEach((t) => {
      if (t.model in modelCounts) {
        modelCounts[t.model as keyof typeof modelCounts]++;
      }
    });

    // Estimated cost
    const estimatedCost =
      modelCounts.haiku * MODEL_COSTS.haiku +
      modelCounts.sonnet * MODEL_COSTS.sonnet +
      modelCounts.opus * MODEL_COSTS.opus;

    // All-opus cost for comparison
    const allOpusCost = totalTickets * MODEL_COSTS.opus;
    const costSavings = allOpusCost > 0 ? ((allOpusCost - estimatedCost) / allOpusCost) * 100 : 0;

    // Sprint velocity data
    const velocityData = sprints.map((sprint) => ({
      sprint: `Sprint ${sprint.id}`,
      planned: sprint.tickets.reduce((sum, t) => sum + t.storyPoints, 0),
      completed: sprint.tickets
        .filter((t) => t.status === 'done')
        .reduce((sum, t) => sum + t.storyPoints, 0),
    }));

    // Status distribution
    const statusCounts = {
      todo: 0,
      'in-progress': 0,
      'qa-review': 0,
      done: 0,
      blocked: 0,
    };
    allTickets.forEach((t) => {
      statusCounts[t.status]++;
    });

    const statusData = [
      { name: 'Todo', value: statusCounts.todo, color: '#64748b' },
      { name: 'In Progress', value: statusCounts['in-progress'], color: '#3b82f6' },
      { name: 'QA Review', value: statusCounts['qa-review'], color: '#f59e0b' },
      { name: 'Done', value: statusCounts.done, color: '#22c55e' },
      { name: 'Blocked', value: statusCounts.blocked, color: '#ef4444' },
    ].filter((d) => d.value > 0);

    // Model data for pie chart
    const modelData = [
      { name: 'Haiku', value: modelCounts.haiku, color: '#10b981', cost: modelCounts.haiku * MODEL_COSTS.haiku },
      { name: 'Sonnet', value: modelCounts.sonnet, color: '#3b82f6', cost: modelCounts.sonnet * MODEL_COSTS.sonnet },
      { name: 'Opus', value: modelCounts.opus, color: '#8b5cf6', cost: modelCounts.opus * MODEL_COSTS.opus },
    ].filter((d) => d.value > 0);

    return {
      totalTickets,
      completedTickets,
      totalPoints,
      completedPoints,
      modelCounts,
      estimatedCost,
      costSavings,
      velocityData,
      statusData,
      modelData,
      sprintCount: sprints.length,
      completionRate: totalTickets > 0 ? (completedTickets / totalTickets) * 100 : 0,
    };
  }, [state]);

  if (!state || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading metrics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Metrics</h1>
        <p className="text-slate-400 mt-1">
          Project performance and cost analysis
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={CheckCircle2}
          label="Completion Rate"
          value={`${Math.round(metrics.completionRate)}%`}
          subvalue={`${metrics.completedTickets} of ${metrics.totalTickets} tickets`}
          color="green"
        />
        <StatCard
          icon={TrendingUp}
          label="Velocity"
          value={metrics.completedPoints}
          subvalue={`of ${metrics.totalPoints} total points`}
          color="blue"
        />
        <StatCard
          icon={DollarSign}
          label="Est. Cost"
          value={`$${metrics.estimatedCost.toFixed(2)}`}
          subvalue={`${Math.round(metrics.costSavings)}% savings vs all-Opus`}
          color="purple"
        />
        <StatCard
          icon={BarChart3}
          label="Sprints"
          value={metrics.sprintCount}
          subvalue="total sprints"
          color="amber"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sprint Velocity */}
        <div className="card">
          <div className="card-header">Sprint Velocity</div>
          <div className="card-body">
            {metrics.velocityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={metrics.velocityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="sprint" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="planned" name="Planned" fill="#64748b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" name="Completed" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-slate-400">
                No velocity data available
              </div>
            )}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="card">
          <div className="card-header">Status Distribution</div>
          <div className="card-body">
            {metrics.statusData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={metrics.statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {metrics.statusData.map((entry, index) => (
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
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  {metrics.statusData.map((status) => (
                    <div key={status.name} className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <span className="text-sm text-slate-300">
                        {status.name}: {status.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-slate-400">
                No status data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Model Usage & Cost */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Distribution */}
        <div className="card">
          <div className="card-header">Model Usage (FinOps)</div>
          <div className="card-body">
            {metrics.modelData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={metrics.modelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {metrics.modelData.map((entry, index) => (
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
                <div className="space-y-2 mt-4">
                  {metrics.modelData.map((model) => (
                    <div key={model.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: model.color }}
                        />
                        <span className="text-slate-300">{model.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-medium">{model.value} tasks</span>
                        <span className="text-slate-400 text-sm ml-2">
                          (${model.cost.toFixed(2)})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-slate-400">
                No model data available
              </div>
            )}
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="card">
          <div className="card-header">Cost Analysis</div>
          <div className="card-body space-y-4">
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Actual Cost (Mixed Models)</span>
                <span className="text-2xl font-bold text-white">
                  ${metrics.estimatedCost.toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Based on estimated per-task costs
              </div>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">All-Opus Cost</span>
                <span className="text-xl text-slate-300">
                  ${(metrics.totalTickets * MODEL_COSTS.opus).toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                If all tasks used Opus model
              </div>
            </div>

            <div className="p-4 bg-green-900/30 border border-green-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-300">Cost Savings</span>
                <span className="text-2xl font-bold text-green-400">
                  {Math.round(metrics.costSavings)}%
                </span>
              </div>
              <div className="text-xs text-green-400/70">
                Saved by using the right model for each task
              </div>
            </div>

            <div className="text-sm text-slate-400 mt-4">
              <p className="font-medium text-slate-300 mb-2">Model Selection Guide:</p>
              <ul className="space-y-1">
                <li>• <span className="text-emerald-400">Haiku</span>: Migrations, configs, seeds (40%)</li>
                <li>• <span className="text-blue-400">Sonnet</span>: Services, components, tests (45%)</li>
                <li>• <span className="text-purple-400">Opus</span>: Architecture, security, debugging (15%)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Burndown */}
      <div className="card">
        <div className="card-header">Project Burndown</div>
        <div className="card-body">
          {state.burndown.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
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
                <Legend />
                <Area
                  type="monotone"
                  dataKey="remaining"
                  name="Remaining"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  name="Completed"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400">
              No burndown data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
