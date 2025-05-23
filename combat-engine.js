import { randomFromRange } from './gameData';

export const combatEngine = {
  // Calculate damage with scaling
  calculateDamage(attacker, weapon, skillMultiplier = 1) {
    const baseDamage = randomFromRange(weapon.damage);
    const strBonus = attacker.strength * weapon.strScaling;
    const agiBonus = attacker.agility * weapon.agiScaling;
    const intBonus = attacker.intelligence * weapon.intScaling;
    
    return Math.floor((baseDamage + strBonus + agiBonus + intBonus) * weapon.damageMultiplier * skillMultiplier);
  },

  // Combat calculations
  calculateHitChance(attacker, defender, combatOptions) {
    if (!combatOptions.hitChance) return true;
    const baseHitChance = 70;
    const agilityDiff = attacker.agility - defender.agility;
    const finalChance = Math.max(10, Math.min(95, baseHitChance + agilityDiff * 2));
    return Math.random() * 100 < finalChance;
  },

  calculateCritical(attacker, combatOptions) {
    if (!combatOptions.critical) return false;
    const baseCritChance = 5;
    const luckBonus = attacker.luck;
    return Math.random() * 100 < (baseCritChance + luckBonus);
  },

  calculateDodge(defender, combatOptions) {
    if (!combatOptions.dodge) return false;
    const baseDodgeChance = 3;
    const agilityBonus = defender.agility * 0.5;
    return Math.random() * 100 < (baseDodgeChance + agilityBonus);
  },

  // Generate character stats for simulation
  generateCharacterStats(character) {
    return {
      ...character,
      health: randomFromRange(character.health),
      strength: randomFromRange(character.strength),
      agility: randomFromRange(character.agility),
      intelligence: randomFromRange(character.intelligence),
      luck: randomFromRange(character.luck),
      armor: {
        defense: randomFromRange(character.armor.defense)
      }
    };
  },

  // Perform single attack
  performAttack(attacker, defender, weapon, skill, combatOptions, detailed = false) {
    let totalDamage = 0;
    let hits = 0;
    let crits = 0;

    for (let i = 0; i < weapon.attacks; i++) {
      if (!this.calculateHitChance(attacker, defender, combatOptions)) continue;
      if (this.calculateDodge(defender, combatOptions)) continue;

      hits++;
      let damage = this.calculateDamage(attacker, weapon, skill?.damage || 1);
      
      if (this.calculateCritical(attacker, combatOptions)) {
        damage *= 2;
        crits++;
      }

      if (combatOptions.armor) {
        damage = Math.max(1, damage - randomFromRange(defender.armor.defense));
      }

      totalDamage += damage;
    }

    return { totalDamage, hits, crits, totalAttacks: weapon.attacks };
  },

  // Single combat simulation
  runSingleCombat(char1, char2, weapons, skills, combatOptions, detailed = false) {
    const char1Stats = this.generateCharacterStats(char1);
    const char2Stats = this.generateCharacterStats(char2);
    
    const weapon1 = weapons.find(w => w.id === char1Stats.weaponId);
    const weapon2 = weapons.find(w => w.id === char2Stats.weaponId);
    
    let fighter1 = { ...char1Stats, currentHealth: char1Stats.health, skillCooldowns: {} };
    let fighter2 = { ...char2Stats, currentHealth: char2Stats.health, skillCooldowns: {} };
    
    const log = detailed ? [] : null;
    let turn = 1;
    const maxTurns = 50;

    while (fighter1.currentHealth > 0 && fighter2.currentHealth > 0 && turn <= maxTurns) {
      if (detailed) log.push(`--- Turn ${turn} ---`);

      // Determine turn order
      const speed1 = fighter1.agility + Math.random() * 10;
      const speed2 = fighter2.agility + Math.random() * 10;
      
      const first = speed1 >= speed2 ? fighter1 : fighter2;
      const second = speed1 >= speed2 ? fighter2 : fighter1;
      const firstWeapon = speed1 >= speed2 ? weapon1 : weapon2;
      const secondWeapon = speed1 >= speed2 ? weapon2 : weapon1;

      // First attacker's turn
      const availableSkills1 = first.equippedSkills.filter(skillId => {
        const skill = skills.find(s => s.id === skillId);
        return !first.skillCooldowns[skillId] || first.skillCooldowns[skillId] <= 0;
      });
      
      let chosenSkill1 = null;
      if (availableSkills1.length > 0) {
        const skillId = availableSkills1[Math.floor(Math.random() * availableSkills1.length)];
        chosenSkill1 = skills.find(s => s.id === skillId);
      }

      const attack1 = this.performAttack(first, second, firstWeapon, chosenSkill1, combatOptions, detailed);
      second.currentHealth -= attack1.totalDamage;
      
      if (chosenSkill1) {
        first.skillCooldowns[chosenSkill1.id] = chosenSkill1.cooldown;
      }

      if (detailed) {
        log.push(`${first.name} uses ${chosenSkill1?.name || 'Basic Attack'} for ${attack1.totalDamage} damage`);
        log.push(`${second.name} health: ${Math.max(0, second.currentHealth)}/${second.health}`);
      }

      if (second.currentHealth <= 0) {
        return { 
          winner: first.name, 
          turns: turn, 
          log: log, 
          finalDamage: attack1.totalDamage 
        };
      }

      // Second attacker's turn
      const availableSkills2 = second.equippedSkills.filter(skillId => {
        const skill = skills.find(s => s.id === skillId);
        return !second.skillCooldowns[skillId] || second.skillCooldowns[skillId] <= 0;
      });
      
      let chosenSkill2 = null;
      if (availableSkills2.length > 0) {
        const skillId = availableSkills2[Math.floor(Math.random() * availableSkills2.length)];
        chosenSkill2 = skills.find(s => s.id === skillId);
      }

      const attack2 = this.performAttack(second, first, secondWeapon, chosenSkill2, combatOptions, detailed);
      first.currentHealth -= attack2.totalDamage;
      
      if (chosenSkill2) {
        second.skillCooldowns[chosenSkill2.id] = chosenSkill2.cooldown;
      }

      if (detailed) {
        log.push(`${second.name} uses ${chosenSkill2?.name || 'Basic Attack'} for ${attack2.totalDamage} damage`);
        log.push(`${first.name} health: ${Math.max(0, first.currentHealth)}/${first.health}`);
      }

      if (first.currentHealth <= 0) {
        return { 
          winner: second.name, 
          turns: turn, 
          log: log, 
          finalDamage: attack2.totalDamage 
        };
      }

      // Reduce cooldowns
      Object.keys(fighter1.skillCooldowns).forEach(skillId => {
        if (fighter1.skillCooldowns[skillId] > 0) fighter1.skillCooldowns[skillId]--;
      });
      Object.keys(fighter2.skillCooldowns).forEach(skillId => {
        if (fighter2.skillCooldowns[skillId] > 0) fighter2.skillCooldowns[skillId]--;
      });

      turn++;
    }

    return { winner: 'Draw', turns: turn, log: log };
  },

  // Run mass simulation
  async runMassSimulation(char1, char2, weapons, skills, combatOptions, iterations = 1000) {
    let char1Wins = 0;
    let char2Wins = 0;
    let draws = 0;
    let totalTurns = 0;
    const turnCounts = [];

    for (let i = 0; i < iterations; i++) {
      const result = this.runSingleCombat(char1, char2, weapons, skills, combatOptions, false);
      
      if (result.winner === char1.name) char1Wins++;
      else if (result.winner === char2.name) char2Wins++;
      else draws++;
      
      totalTurns += result.turns;
      turnCounts.push(result.turns);
      
      // Update progress periodically
      if (i % 100 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }

    const avgTurns = totalTurns / iterations;
    const char1WinRate = (char1Wins / iterations) * 100;
    const char2WinRate = (char2Wins / iterations) * 100;
    const drawRate = (draws / iterations) * 100;

    // Balance analysis
    const balanceIssues = [];
    if (char1WinRate > 65) balanceIssues.push(`${char1.name} too strong (${char1WinRate.toFixed(1)}% win rate)`);
    if (char2WinRate > 65) balanceIssues.push(`${char2.name} too strong (${char2WinRate.toFixed(1)}% win rate)`);
    if (avgTurns > 15) balanceIssues.push(`Combat too slow (${avgTurns.toFixed(1)} turns average)`);
    if (avgTurns < 3) balanceIssues.push(`Combat too fast (${avgTurns.toFixed(1)} turns average)`);
    if (drawRate > 10) balanceIssues.push(`Too many draws (${drawRate.toFixed(1)}%)`);

    return {
      iterations,
      char1Wins,
      char2Wins,
      draws,
      char1WinRate,
      char2WinRate,
      drawRate,
      avgTurns,
      balanceIssues,
      turnDistribution: turnCounts
    };
  }
};