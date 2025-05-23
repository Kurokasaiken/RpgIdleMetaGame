import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { SimulationResults, Character } from '../types';

interface SimulationTabProps {
  simulationResults: SimulationResults | null;
  isSimulating: boolean;
  runMassSimulation: (iterations: number) => Promise<void>;
  character1: Character;
  character2: Character;
}

const TurnDistributionChart: React.FC<{ turnCounts: number[] }> = ({ turnCounts }) => {
  const buckets: Record<number, number> = {};
  turnCounts.forEach(turns => {
    const bucket = Math.floor(turns / 5) * 5;
    buckets[bucket] = (buckets[bucket] || 0) + 1;
  });

  const maxCount = Math.max(...Object.values(buckets));
  const sortedBuckets = Object.entries(buckets)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([bucket, count]) => ({ bucket: parseInt(bucket), count }));

  if (sortedBuckets.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        Nessun dato disponibile per la distribuzione dei turni
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {sortedBuckets.map(({ bucket, count }) => {
        const percentage = (count / turnCounts.length) * 100;
        const barWidth = (count / maxCount) * 100;
        
        return (
          <div key={bucket} className="flex items-center gap-2 text-xs">
            <div className="w-12 text-right font-mono">
              {bucket}-{bucket + 4}:
            </div>
            <div className="flex-1 bg-gray-200 rounded h-4 relative min-w-0">
              <div 
                className="bg-blue-500 h-full rounded transition-all duration-300" 
                style={{ width: `${Math.max(barWidth, 2)}%` }}
              />
            </div>
            <div className="w-12 text-left font-mono">
              {percentage.toFixed(1)}%
            </div>
            <div className="w-8 text-right text-gray-500">
              ({count})
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const SimulationTab: React.FC<SimulationTabProps> = ({ 
  simulationResults, 
  isSimulating, 
  runMassSimulation, 
  character1, 
  character2 
}) => {
  const handleRunSimulation = async (iterations: number) => {
    try {
      await runMassSimulation(iterations);
    } catch (error) {
      console.error('Simulazione fallita:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Simulazione di Massa
        </h3>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <button
            onClick={() => handleRunSimulation(100)}
            disabled={isSimulating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Esegui 100 Combattimenti
          </button>
          <button
            onClick={() => handleRunSimulation(1000)}
            disabled={isSimulating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Esegui 1000 Combattimenti
          </button>
          <button
            onClick={() => handleRunSimulation(10000)}
            disabled={isSimulating}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Esegui 10,000 Combattimenti
          </button>
        </div>

        {isSimulating && (
          <div className="bg-blue-100 border border-blue-300 rounded p-4 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-blue-700 font-medium">
                Simulazione in corso... Attendere prego.
              </span>
            </div>
          </div>
        )}

        {simulationResults && !isSimulating && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-bold text-green-800 truncate" title={character1.name}>
                  {character1.name}
                </h4>
                <div className="text-2xl font-bold text-green-600">
                  {simulationResults.char1WinRate.toFixed(1)}%
                </div>
                <div className="text-sm text-green-700">
                  {simulationResults.char1Wins.toLocaleString()} vittorie
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-bold text-red-800 truncate" title={character2.name}>
                  {character2.name}
                </h4>
                <div className="text-2xl font-bold text-red-600">
                  {simulationResults.char2WinRate.toFixed(1)}%
                </div>
                <div className="text-sm text-red-700">
                  {simulationResults.char2Wins.toLocaleString()} vittorie
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-800">Pareggi</h4>
                <div className="text-2xl font-bold text-gray-600">
                  {simulationResults.drawRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-700">
                  {simulationResults.draws.toLocaleString()} pareggi
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Statistiche Combattimento
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Durata Media Combattimento:</span>
                  <span className="font-mono">{simulationResults.avgTurns.toFixed(1)} turni</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Totale Simulazioni:</span>
                  <span className="font-mono">{simulationResults.iterations.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {simulationResults.balanceIssues.length > 0 ? (
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                <h4 className="font-bold mb-2 flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="w-4 h-4" />
                  Problemi di Bilanciamento Rilevati
                </h4>
                <ul className="space-y-1">
                  {simulationResults.balanceIssues.map((issue, index) => (
                    <li key={index} className="text-sm text-yellow-700">
                      • {issue}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                <h4 className="font-bold mb-2 flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-4 h-4" />
                  Bilanciamento Combattimento Ok!
                </h4>
                <p className="text-sm text-green-700">
                  Nessun problema di bilanciamento rilevato. Entrambi i personaggi hanno una probabilità ragionevole di vincere.
                </p>
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold mb-3">Analisi Distribuzione Turni</h4>
              <div className="text-sm text-gray-600 mb-3">
                Distribuzione della durata dei combattimenti su {simulationResults.iterations.toLocaleString()} simulazioni:
              </div>
              <TurnDistributionChart turnCounts={simulationResults.turnDistribution} />
            </div>
          </div>
        )}

        {!simulationResults && !isSimulating && (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Esegui una simulazione per vedere l'analisi dettagliata del combattimento</p>
          </div>
        )}
      </div>
    </div>
  );
};