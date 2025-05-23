import React from 'react';
import { Wrench, BookOpen, Zap } from 'lucide-react';

export const DatabaseTab = ({ weapons, skills }) => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Wrench className="w-5 h-5" />
        Weapon Database
      </h3>
      <div className="space-y-4">
        {weapons.map(weapon => {
          const IconComponent = weapon.icon;
          return (
            <div key={weapon.id} className="flex items-center gap-4 p-3 border rounded">
              <IconComponent className="w-8 h-8 text-blue-600" />
              <div className="flex-1">
                <h4 className="font-medium">{weapon.name}</h4>
                <p className="text-sm text-gray-600">
                  {weapon.type} - {weapon.attacks}x attacks - {weapon.damage[0]}-{weapon.damage[1]} damage
                </p>
                <p className="text-xs text-gray-500">
                  STR×{weapon.strScaling} AGI×{weapon.agiScaling} INT×{weapon.intScaling}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        Skills Database
      </h3>
      <div className="space-y-4">
        {skills.map(skill => (
          <div key={skill.id} className="flex items-center gap-4 p-3 border rounded">
            <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
              <Zap className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{skill.name}</h4>
              <p className="text-sm text-gray-600">{skill.description}</p>
              <p className="text-xs text-gray-500">
                {Math.floor(skill.damage * 100)}% damage - Cooldown: {skill.cooldown} turns
              </p>
            </div>
            <div className="text-xs bg-gray-100 px-2 py-1 rounded">
              {skill.type}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);