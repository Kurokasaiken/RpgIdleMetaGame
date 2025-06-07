import React, { useEffect, useState } from 'react';
import { StatManager } from '../../core/stats/StatManager';
import { StatInstance } from '../../core/stats/StatInstance';
import { loadStats, saveStats } from '../../utils/statPersistence';
import defaultStats from '../../data/defaultStats';
import StatPanel from './StatPanel';

export const StatPanelTab: React.FC = () => {
  const [stats, setStats] = useState<Record<string, StatInstance>>({});

  useEffect(() => {
    console.log('Loading stats...');
    const storedStats = loadStats();
    console.log('storedStats:', storedStats);
    const baseValues = storedStats ?? defaultStats;
    console.log('baseValues:', baseValues);

    try {
      const statManager = new StatManager();
      const instances = statManager.createAll(baseValues);
      console.log('instances:', instances);
      const instanceMap = Object.fromEntries(
        instances.map((s) => [s.definition.id, s])
      );
      console.log('instanceMap:', instanceMap);
      setStats(instanceMap);
    } catch (e) {
      console.error('Error initializing stats:', e);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(stats).length > 0) {
      console.log('Saving stats:', stats);
      const numericSnapshot = Object.fromEntries(
        Object.entries(stats).map(([id, s]) => [id, s.baseValue])
      );
      saveStats(numericSnapshot);
    }
  }, [stats]);

  return (
    <div>
      {Object.keys(stats).length === 0 ? (
        <p>No stats available</p>
      ) : (
        <StatPanel stats={stats} />
      )}
    </div>
  );
};