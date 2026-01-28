import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ListTodo,
  BarChart3,
  Users,
  Monitor,
  Settings,
  Activity,
} from 'lucide-react';
import { useProjectState } from './hooks/useProjectState';
import Dashboard from './pages/Dashboard';
import Backlog from './pages/Backlog';
import SprintView from './pages/SprintView';
import Agents from './pages/Agents';
import Screens from './pages/Screens';
import Metrics from './pages/Metrics';

function App() {
  const { state, isConnected, error } = useProjectState();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/backlog', icon: ListTodo, label: 'Backlog' },
    { to: '/sprints', icon: BarChart3, label: 'Sprints' },
    { to: '/agents', icon: Users, label: 'Agents' },
    { to: '/screens', icon: Monitor, label: 'Screens' },
    { to: '/metrics', icon: Activity, label: 'Metrics' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📋</span>
            AutoSpec
          </h1>
          <p className="text-xs text-slate-400 mt-1">Spec-Driven Development</p>
        </div>

        {/* Connection Status */}
        <div className="px-4 py-2 border-b border-slate-700">
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-slate-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 text-xs text-slate-500">
          Last updated: {state?.lastUpdated ? new Date(state.lastUpdated).toLocaleTimeString() : 'Never'}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {error && (
          <div className="bg-red-900/50 border-b border-red-700 px-4 py-2 text-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard state={state} />} />
            <Route path="/backlog" element={<Backlog state={state} />} />
            <Route path="/sprints" element={<SprintView state={state} />} />
            <Route path="/sprints/:id" element={<SprintView state={state} />} />
            <Route path="/agents" element={<Agents state={state} />} />
            <Route path="/screens" element={<Screens state={state} />} />
            <Route path="/metrics" element={<Metrics state={state} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
