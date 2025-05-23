import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Maximize2, Minimize2, Settings } from 'lucide-react';
import { useBalance,BalanceParams } from '../context/BalanceContext';

export const BalanceTab: React.FC = () => {
  const [active, setActive] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const { balanceParams, setBalanceParams } = useBalance();
  const [changedValues, setChangedValues] = useState<Set<string>>(new Set());

  // Calcolo automatico del danno base
  useEffect(() => {
    const calculatedDamage = Math.ceil(balanceParams.baseHP / balanceParams.hitsToKill);
    setBalanceParams((prev) => ({ ...prev, baseDamage: calculatedDamage }));
    setChangedValues(new Set(['baseDamage']));
    const timer = setTimeout(() => setChangedValues(new Set()), 1000);
    return () => clearTimeout(timer);
  }, [balanceParams.baseHP, balanceParams.hitsToKill, setBalanceParams]);

  const toggleModule = (moduleName: keyof typeof balanceParams.modules) => {
    setBalanceParams((prev) => ({
      ...prev,
      modules: { ...prev.modules, [moduleName]: !prev.modules[moduleName] },
    }));
  };

  const updateParam = <K extends keyof Omit<BalanceParams, 'modules'>>(
    key: K,
    value: BalanceParams[K],
  ) => {
    setBalanceParams((prev) => ({ ...prev, [key]: value }));
    setChangedValues(new Set([key]));
    setTimeout(() => setChangedValues(new Set()), 1000);
  };

  return (
    <div className={`transition-all duration-300 ${expanded ? 'scale-105' : ''}`}>
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-700">
            <Settings className="w-6 h-6 text-blue-600" />
            Parametri di Bilanciamento
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setActive(!active)}
              className="px-4 py-2 text-sm rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 flex items-center gap-2 transition-colors duration-200"
            >
              {active ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              {active ? 'Disattiva' : 'Attiva'}
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="px-4 py-2 text-sm rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 flex items-center gap-2 transition-colors duration-200"
            >
              {expanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              {expanded ? 'Riduci' : 'Espandi'}
            </button>
          </div>
        </div>

        {active && (
          <div className="space-y-6">
            {/* Core Parameters */}
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Core Parameters</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hits to Kill: {balanceParams.hitsToKill}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="15"
                    value={balanceParams.hitsToKill}
                    onChange={(e) => updateParam('hitsToKill', parseInt(e.target.value))}
                    className="w-full h-2 bg-blue-100 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base HP: {balanceParams.baseHP}
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="10"
                    value={balanceParams.baseHP}
                    onChange={(e) => updateParam('baseHP', parseInt(e.target.value))}
                    className="w-full h-2 bg-blue-100 rounded-lg cursor-pointer"
                  />
                </div>
                <div
                  className={`p-2 border rounded-lg transition-colors duration-300 ${
                    changedValues.has('baseDamage')
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-300'
                  }`}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calculated Base Damage: {balanceParams.baseDamage}
                  </label>
                  <div className="text-sm text-gray-500">
                    Auto-calculated as HP ÷ Hits to Kill
                  </div>
                </div>
              </div>
            </div>

            {/* Combat Modules */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Hit Chance System */}
              <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-800">Hit Chance System</h4>
                  <button
                    onClick={() => toggleModule('hitChance')}
                    className={`p-2 rounded-lg ${
                      balanceParams.modules.hitChance
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    } hover:bg-gray-100 transition-colors duration-200`}
                  >
                    {balanceParams.modules.hitChance ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {balanceParams.modules.hitChance && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Base Hit Chance: {balanceParams.hitChance}%
                      </label>
                      <input
                        type="range"
                        min="25"
                        max="95"
                        value={balanceParams.hitChance}
                        onChange={(e) => updateParam('hitChance', parseInt(e.target.value))}
                        className="w-full h-2 bg-blue-100 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Colpi da Mandare a Segno: {balanceParams.hitsToKill}</p>
                      <p>
                        Attacchi Necessari: ~
                        {(balanceParams.hitsToKill / (balanceParams.hitChance / 100)).toFixed(
                          1,
                        )}
                      </p>
                      <p>Modificato dalla statistica Agilità</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Critical Hit System */}
              <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-800">Critical Hit System</h4>
                  <button
                    onClick={() => toggleModule('critical')}
                    className={`p-2 rounded-lg ${
                      balanceParams.modules.critical
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    } hover:bg-gray-100 transition-colors duration-200`}
                  >
                    {balanceParams.modules.critical ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {balanceParams.modules.critical && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Base Crit Chance: {balanceParams.critChance}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={balanceParams.critChance}
                        onChange={(e) => updateParam('critChance', parseInt(e.target.value))}
                        className="w-full h-2 bg-blue-100 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Crit Multiplier: {balanceParams.critMultiplier}%
                      </label>
                      <input
                        type="range"
                        min="150"
                        max="400"
                        step="25"
                        value={balanceParams.critMultiplier}
                        onChange={(e) =>
                          updateParam('critMultiplier', parseInt(e.target.value))
                        }
                        className="w-full h-2 bg-blue-100 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Modificato dalla statistica Fortuna</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Armor System */}
              <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-800">Armor System</h4>
                  <button
                    onClick={() => toggleModule('armor')}
                    className={`p-2 rounded-lg ${
                      balanceParams.modules.armor ? 'text-blue-600' : 'text-gray-400'
                    } hover:bg-gray-100 transition-colors duration-200`}
                  >
                    {balanceParams.modules.armor ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {balanceParams.modules.armor && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Base Armor: {balanceParams.armorValue}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={balanceParams.armorValue}
                        onChange={(e) => updateParam('armorValue', parseInt(e.target.value))}
                        className="w-full h-2 bg-blue-100 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Base Armor Pen: {balanceParams.armorPen}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={balanceParams.armorPen}
                        onChange={(e) => updateParam('armorPen', parseInt(e.target.value))}
                        className="w-full h-2 bg-blue-100 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Magic System (Segnaposto) */}
              <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-800">Magic System</h4>
                  <button
                    onClick={() => toggleModule('magic')}
                    className={`p-2 rounded-lg ${
                      balanceParams.modules.magic ? 'text-blue-600' : 'text-gray-400'
                    } hover:bg-gray-100 transition-colors duration-200`}
                  >
                    {balanceParams.modules.magic ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {balanceParams.modules.magic && (
                  <div className="text-sm text-gray-500">
                    <p>Coming Soon...</p>
                  </div>
                )}
              </div>

              {/* Initiative & Speed (Segnaposto) */}
              <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-800">Initiative & Speed</h4>
                  <button
                    onClick={() => toggleModule('initiative')}
                    className={`p-2 rounded-lg ${
                      balanceParams.modules.initiative
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    } hover:bg-gray-100 transition-colors duration-200`}
                  >
                    {balanceParams.modules.initiative ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {balanceParams.modules.initiative && (
                  <div className="text-sm text-gray-500">
                    <p>Coming Soon...</p>
                  </div>
                )}
              </div>

              {/* Cooldowns & Resources (Segnaposto) */}
              <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-800">Cooldowns & Resources</h4>
                  <button
                    onClick={() => toggleModule('cooldowns')}
                    className={`p-2 rounded-lg ${
                      balanceParams.modules.cooldowns
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    } hover:bg-gray-100 transition-colors duration-200`}
                  >
                    {balanceParams.modules.cooldowns ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {balanceParams.modules.cooldowns && (
                  <div className="text-sm text-gray-500">
                    <p>Coming Soon...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};