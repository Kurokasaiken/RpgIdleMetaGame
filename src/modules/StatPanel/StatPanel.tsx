import { useState } from 'react';
import { StatInstance } from '../../core/stats/StatInstance';

interface StatPanelProps {
  /** Record of stat instances keyed by their definition ID */
  stats: Record<string, StatInstance>;
}

interface TooltipData {
  statId: string;
  stat: StatInstance;
}

/**
 * Pure UI component for displaying statistics with detailed tooltips
 * Shows current values and provides detailed breakdown on hover/click
 */
export default function StatPanel({ stats }: StatPanelProps) {
  const [activeTooltip, setActiveTooltip] = useState<TooltipData | null>(null);

  const handleStatClick = (statId: string, stat: StatInstance) => {
    setActiveTooltip({ statId, stat });
  };

  const closeTooltip = () => {
    setActiveTooltip(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Character Statistics</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {Object.entries(stats).map(([statId, stat]) => (
          <div
            key={statId}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
            onClick={() => handleStatClick(statId, stat)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">
                {stat.definition.name}
              </h3>
              <span className="text-2xl font-bold text-blue-600">
                {Math.round(stat.current * 100) / 100}
              </span>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-2">
              {stat.definition.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Modifier Count */}
            {stat.modifiers.length > 0 && (
              <div className="mt-2 text-sm text-gray-500">
                {stat.modifiers.length} modifier{stat.modifiers.length !== 1 ? 's' : ''} active
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detailed Tooltip Modal */}
      {activeTooltip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {activeTooltip.stat.definition.name}
              </h3>
              <button
                onClick={closeTooltip}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Base Value */}
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Base Value:</span>
                <span className="font-mono text-gray-900">{activeTooltip.stat.baseValue}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-medium text-gray-700">Current Value:</span>
                <span className="font-mono text-blue-600 font-bold">
                  {Math.round(activeTooltip.stat.current * 100) / 100}
                </span>
              </div>
            </div>

            {/* Stat Type and Tags */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-600">Type:</span>
                <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {activeTooltip.stat.definition.type}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Tags:</span>
                <div className="flex flex-wrap gap-1">
                  {activeTooltip.stat.definition.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modifiers */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">
                Active Modifiers ({activeTooltip.stat.modifiers.length})
              </h4>
              
              {activeTooltip.stat.modifiers.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No active modifiers</p>
              ) : (
                <div className="space-y-2">
                  {activeTooltip.stat.modifiers.map((modifier, index) => (
                    <div key={modifier.id || index} className="p-2 bg-gray-50 rounded text-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              modifier.type === 'flat' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {modifier.type}
                            </span>
                            <span className="text-gray-600 text-xs">
                              from {modifier.source}
                            </span>
                          </div>
                          {modifier.description && (
                            <p className="text-gray-700 text-xs">{modifier.description}</p>
                          )}
                          {modifier.duration !== undefined && (
                            <p className="text-orange-600 text-xs mt-1">
                              Duration: {modifier.duration} turns
                            </p>
                          )}
                        </div>
                        <span className={`font-mono font-bold ${
                          modifier.value >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {modifier.type === 'percent' 
                            ? `${modifier.value >= 0 ? '+' : ''}${(modifier.value * 100).toFixed(1)}%`
                            : `${modifier.value >= 0 ? '+' : ''}${modifier.value}`
                          }
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}