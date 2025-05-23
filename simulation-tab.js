import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export const SimulationTab = ({ 
  simulationResults, 
  isSimulating, 
  runMassSimulation, 
  character1, 
  character2 
}) => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Mass Simulation
      </h3>
      
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => runMassSimulation(100)}
          disabled={isSimulating}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Run 100 Fights
        </button>
        <button
          onClick={() => runMassSimulation(1000)}
          disabled={isSimulating}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Run 1000 Fights
        </button>
        <button
          onClick={() => runMassSimulation(10000)}
          disabled={isSimulating}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Run 10000 Fights
        </button>
      </div>

      {isSimulating && (
        <div className="bg-blue-100 border border-blue-300 rounded p-4 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-blue-700">Running simulation...</span>
          </div>
        </div>
      )}

      {simulationResults && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded border">
              <h4 className="font-bold text-green-800">{character1.name}</h4>
              <div className="text-2xl font-bold text-green-600">
                {simulationResults.char1WinRate.toFixed(1)}%
              </div>
              <div className="text-sm text-green-700">
                {simulationResults.char1Wins} wins
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded border">
              <h4 className="font-bold text-red-800">{character2.name}</h4>
              <div className="text-2xl font-bold text-red-600">
                {simulationResults.char2WinRate.toFixed(1)}%
              </div>
              <div className="text-sm text-red-700">
                {simulationResults.char2Wins} wins
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded border">
              <h4 className="font-bold text-gray-800">Draws</h4>
              <div className="text-2xl font-bold text-gray-600">
                {simulationResults.drawRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-700">
                {simulationResults.draws} draws
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Combat Statistics
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Average Combat Length:</span> {simulationResults.avgTurns.toFixed(1)} turns
              </div>
              <div>
                <span className="font-medium">Total Simulations:</span> {simulationResults.iterations.toLocaleString()}
              </div>
            </div>
          </div>

          {simulationResults.balanceIssues.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-300 rounded p-4">
              <h4 className="font-bold mb-2 flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="w-4 h-4" />
                Balance Issues Detected
              </h4>
              <ul className="space-y-1">
                {simulationResults.balanceIssues.map((issue, index) => (
                  <li key={index} className="text-sm text-yellow-700">• {issue}</li>
                ))}
              </ul>
            </div>
          )}

          {simulationResults.balanceIssues.length === 0 && (
            <div className="bg-green-50 border border-green-300 rounded p-4">
              <h4 className="font-bold mb-2 flex items-center gap-2 text-green-800">
                <CheckCircle className="w-4 h-4" />
                Combat Balance Looks Good!
              </h4>
              <p className="text-sm text-green-700">
                No major balance issues detected. Both characters have a reasonable chance of winning.
              </p>
            </div>
          )}

          <div className="bg-white border rounded p-4">
            <h4 className="font-bold mb-2">Turn Distribution Analysis</h4>
            <div className="text-sm text-gray-600 mb-2">
              Combat length distribution (turns):
            </div>
            <TurnDistributionChart turnCounts={simulationResults.turnDistribution} />
          </div>
        </div>
      )}
    </div>
  </div>
);

// Simple turn distribution visualization
const TurnDistributionChart = ({ turnCounts }) => {
  // Group turns into buckets
  const buckets = {};
  turnCounts.forEach(turns => {
    const bucket = Math.floor(turns / 5) * 5; // Group by 5s
    buckets[bucket] = (buckets[bucket] || 0) + 1;
  });

  const maxCount = Math.max(...Object.values(buckets));
  const sortedBuckets = Object.entries(buckets).sort(([a], [b]) => parseInt(a) - parseInt(b));

  return (
    <div className="space-y-1">
      {sortedBuckets.map(([bucket, count]) => {
        const percentage = (count / turnCounts.length) * 100;
        const barWidth = (count / maxCount) * 100;
        
        return (
          <div key={bucket} className="flex items-center gap-2 text-xs">
            <div className="w-12 text-right">{bucket}-{parseInt(bucket) + 4}:</div>
            <div className="flex-1 bg-gray-200 rounded h-4 relative">
              <div 
                className="bg-blue-500 h-full rounded" 
                style={{ width: `${barWidth}%` }}
              />
            </div>
            <div className="w-12 text-left">{percentage.toFixed(1)}%</div>
          </div>
        );
      })}
    </div>
  );
};