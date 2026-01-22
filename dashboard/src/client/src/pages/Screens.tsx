import React, { useState, useMemo } from 'react';
import { Monitor, Layout, Link2, Search, Eye } from 'lucide-react';
import type { ProjectState, ScreenSpec } from '../../../types/index';

interface ScreensProps {
  state: ProjectState | null;
}

export default function Screens({ state }: ScreensProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScreen, setSelectedScreen] = useState<ScreenSpec | null>(null);

  // Get screens from UI designer spec
  const screens = useMemo(() => {
    if (!state) return [];
    const uiSpec = state.specs.get('ui_designer');
    return uiSpec?.screens || [];
  }, [state]);

  const filteredScreens = useMemo(() => {
    return screens.filter(
      (screen) =>
        searchQuery === '' ||
        screen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        screen.route?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [screens, searchQuery]);

  if (!state) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading screen data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Screens</h1>
          <p className="text-slate-400 mt-1">
            {screens.length} screens defined in UI designer spec
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search screens..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Screen Grid */}
      {filteredScreens.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredScreens.map((screen) => (
            <div
              key={screen.id}
              className="card cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => setSelectedScreen(screen)}
            >
              <div className="card-body">
                {/* Wireframe Preview */}
                {screen.wireframe ? (
                  <div className="wireframe mb-4 text-[8px] leading-tight h-32 overflow-hidden">
                    {screen.wireframe}
                  </div>
                ) : (
                  <div className="h-32 bg-slate-700/50 rounded flex items-center justify-center mb-4">
                    <Monitor size={32} className="text-slate-500" />
                  </div>
                )}

                {/* Screen Info */}
                <h3 className="text-white font-medium">{screen.name}</h3>
                {screen.route && (
                  <p className="text-slate-400 text-sm font-mono">{screen.route}</p>
                )}

                {/* Components */}
                {screen.components.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {screen.components.slice(0, 4).map((comp) => (
                      <span
                        key={comp}
                        className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded"
                      >
                        {comp}
                      </span>
                    ))}
                    {screen.components.length > 4 && (
                      <span className="px-2 py-0.5 text-slate-400 text-xs">
                        +{screen.components.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Related tickets */}
                {screen.relatedTickets && screen.relatedTickets.length > 0 && (
                  <div className="flex items-center gap-1 mt-3 text-sm text-slate-400">
                    <Link2 size={12} />
                    <span>{screen.relatedTickets.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <Monitor size={48} className="mx-auto mb-4 text-slate-500" />
          <p className="text-slate-400">
            {screens.length === 0
              ? 'No screens found in UI designer spec'
              : 'No screens match your search'}
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Screens are parsed from the 10_ui_designer.md spec file
          </p>
        </div>
      )}

      {/* Screen Detail Modal */}
      {selectedScreen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedScreen(null)}
        >
          <div
            className="card max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-header flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor size={20} />
                <span>{selectedScreen.name}</span>
              </div>
              <button
                onClick={() => setSelectedScreen(null)}
                className="text-slate-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            <div className="card-body space-y-4">
              {/* Route */}
              {selectedScreen.route && (
                <div>
                  <label className="text-sm text-slate-400">Route</label>
                  <p className="text-white font-mono">{selectedScreen.route}</p>
                </div>
              )}

              {/* Description */}
              {selectedScreen.description && (
                <div>
                  <label className="text-sm text-slate-400">Description</label>
                  <p className="text-slate-200">{selectedScreen.description}</p>
                </div>
              )}

              {/* Wireframe */}
              {selectedScreen.wireframe && (
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Wireframe</label>
                  <div className="wireframe text-xs">
                    {selectedScreen.wireframe}
                  </div>
                </div>
              )}

              {/* Components */}
              {selectedScreen.components.length > 0 && (
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Components</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedScreen.components.map((comp) => (
                      <span
                        key={comp}
                        className="px-3 py-1 bg-slate-700 text-slate-200 rounded"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* States */}
              {selectedScreen.states.length > 0 && (
                <div>
                  <label className="text-sm text-slate-400 block mb-2">States</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedScreen.states.map((state) => (
                      <span
                        key={state}
                        className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded"
                      >
                        {state}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Tickets */}
              {selectedScreen.relatedTickets && selectedScreen.relatedTickets.length > 0 && (
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Related Tickets</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedScreen.relatedTickets.map((ticket) => (
                      <span
                        key={ticket}
                        className="px-3 py-1 bg-green-900/50 text-green-300 rounded font-mono text-sm"
                      >
                        #{ticket}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
