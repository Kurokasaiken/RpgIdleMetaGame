import { Wind, Sword, Mountain } from 'lucide-react';

// Weapon database
export const initialWeapons = [
  { 
    id: 1, 
    name: 'Quick Blade', 
    type: 'light', 
    damage: [12, 18], 
    attacks: 3, 
    damageMultiplier: 0.5,
    strScaling: 1.0,
    agiScaling: 0.3,
    intScaling: 0.0,
    icon: Wind
  },
  { 
    id: 2, 
    name: 'Standard Sword', 
    type: 'medium', 
    damage: [15, 25], 
    attacks: 1, 
    damageMultiplier: 1.0,
    strScaling: 1.0,
    agiScaling: 0.0,
    intScaling: 0.0,
    icon: Sword
  },
  { 
    id: 3, 
    name: 'War Hammer', 
    type: 'heavy', 
    damage: [20, 35], 
    attacks: 1, 
    damageMultiplier: 1.5,
    strScaling: 1.2,
    agiScaling: 0.0,
    intScaling: 0.0,
    icon: Mountain
  }
];

// Skills database
export const initialSkills = [
  { 
    id: 1, 
    name: 'Light Attack', 
    type: 'weapon', 
    weaponType: 'light', 
    damage: 1.0, 
    cooldown: 1, 
    description: 'Quick strikes' 
  },
  { 
    id: 2, 
    name: 'Attack', 
    type: 'weapon', 
    weaponType: 'medium', 
    damage: 1.0, 
    cooldown: 1, 
    description: 'Standard attack' 
  },
  { 
    id: 3, 
    name: 'Heavy Attack', 
    type: 'weapon', 
    weaponType: 'heavy', 
    damage: 1.0, 
    cooldown: 1, 
    description: 'Powerful strike' 
  },
  { 
    id: 4, 
    name: 'Power Strike', 
    type: 'ability', 
    damage: 1.8, 
    cooldown: 3, 
    description: 'Devastating blow' 
  },
  { 
    id: 5, 
    name: 'Quick Combo', 
    type: 'ability', 
    damage: 0.6, 
    cooldown: 2, 
    description: 'Fast multi-hit' 
  },
  { 
    id: 6, 
    name: 'Defensive Stance', 
    type: 'ability', 
    damage: 0.3, 
    cooldown: 4, 
    description: 'Reduces incoming damage' 
  },
  { 
    id: 7, 
    name: 'Berserker Rage', 
    type: 'ability', 
    damage: 2.2, 
    cooldown: 5, 
    description: 'High risk, high reward' 
  },
  { 
    id: 8, 
    name: 'Precise Strike', 
    type: 'ability', 
    damage: 1.4, 
    cooldown: 2, 
    description: 'Ignores some armor' 
  }
];

// Utility functions
export const getAvailableSkills = (character, weapons, skills) => {
  const weapon = weapons.find(w => w.id === character.weaponId);
  const weaponSkills = skills.filter(s => s.type === 'weapon' && s.weaponType === weapon?.type);
  const abilitySkills = skills.filter(s => s.type === 'ability');
  return [...weaponSkills, ...abilitySkills];
};

export const getSkillSlots = (intelligence) => {
  const avgInt = Array.isArray(intelligence) ? (intelligence[0] + intelligence[1]) / 2 : intelligence;
  return Math.max(1, 4 + Math.floor((avgInt - 10) / 2));
};

export const randomFromRange = (range) => {
  if (Array.isArray(range)) {
    return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
  }
  return range;
};