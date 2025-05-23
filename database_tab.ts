import React, { useState } from 'react';
import { Sword, Zap, Plus, Wind, Mountain } from 'lucide-react';
import { Weapon, Skill } from './gameData';

interface DatabaseTabProps {
  weapons: Weapon[];
  skills: Skill[];
  setWeapons: React.Dispatch<React.SetStateAction<Weapon[]>>;
}

export const DatabaseTab: React.FC<DatabaseTabProps> = ({ weapons, skills, setWeapons }) => {
  const [showWeaponCreator, setShowWeaponCreator] = useState(false);
  const [newWeapon, setNewWeapon] = useState({
    name: '',
    type: 'light' as 'light' | 'medium' | 'heavy',
    damage: [10, 15] as [number, number],
    attacks: 1,
    damageMultiplier: 1.0,
    strScaling: 1.0,
    agiScaling: 0.0,
    intScaling: 0.0
  });

  const iconMap = { 
    light: Wind, 
    medium: Sword, 
    heavy: Mountain 
  };

  const createWeapon = () => {
    const weapon: