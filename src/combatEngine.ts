import { randomFromRange } from './gameData';
import { Character, Weapon, Skill, CombatOptions, CombatResult } from './types';
import { StatRange } from './types';

export class CombatEngine {
  private calculateBaseStat(statRange: StatRange): number {
    return randomFromRange(statRange);
  }

  private calculateHitChance(attacker: Character, defender: Character, combatOptions: CombatOptions): boolean {
    if (!combatOptions.hitChance) return true;
    
    const attackerAgi = this.calculateBaseStat(attacker.agility);
    const defenderAgi = this.calculateBaseStat(defender.agility);
    
    const hitChance = Math.min(95, Math.max(5, 75 + (attackerAgi - defenderAgi) * 2));
    return Math.random() * 100 < hitChance;
  }

  private calculateCriticalHit(attacker: Character, combatOptions: CombatOptions): boolean {
    if (!combatOptions.critical) return false;
    
    const luck = this.calculateBaseStat(attacker.luck);
    const critChance = Math.min(50, Math.max(1, luck * 0.5));
    return Math.random() * 100 < critChance;
  }

  private calculateDamage(
    attacker: Character, 
    weapon: Weapon, 
    skillMultiplier: number = 1,
    isCritical: boolean = false
  ): number {
    const baseDamage = randomFromRange(weapon.damage);
    
    const strBonus = this.calculateBaseStat(attacker.strength) * (weapon.strScaling || 0);
    const agiBonus = this.calculateBaseStat(attacker.agility) * (weapon.agiScaling || 0);
    const intBonus = this.calculateBaseStat(attacker.intelligence) * (weapon.intScaling || 0);
    
    let totalDamage = (baseDamage + strBonus + agiBonus + intBonus) * weapon.damageMultiplier * skillMultiplier;
    
    if (isCritical) {
      totalDamage *= 1.5;
    }
    
    return Math.floor(Math.max(1, totalDamage));
  }

  private applyArmor(damage: number, armor: StatRange): number {
    const defense = randomFromRange(armor);
    return Math.max(1, damage - defense);
  }

  public runSingleCombat(
    char1: Character,
    char2: Character,
    weapons: Weapon[],
    skills: Skill[],
    combatOptions: CombatOptions
  ): CombatResult {
    const weapon1 = weapons.find(w => w.id === char1.weaponId);
    const weapon2 = weapons.find(w => w.id === char2.weaponId);
    
    if (!weapon1 || !weapon2) {
      throw new Error('Arma non trovata per uno dei personaggi');
    }
    
    let fighter1 = {
      ...char1,
      currentHealth: this.calculateBaseStat(char1.health),
      skillCooldowns: new Map<number, number>()
    };
    
    let fighter2 = {
      ...char2,
      currentHealth: this.calculateBaseStat(char2.health),
      skillCooldowns: new Map<number, number>()
    };

    const log: string[] = [];
    let turns = 0;
    const maxTurns = combatOptions.maxTurns || 50;

    log.push(`=== INIZIO COMBATTIMENTO ===`);
    log.push(`${fighter1.name} (${fighter1.currentHealth} HP) vs ${fighter2.name} (${fighter2.currentHealth} HP)`);

    while (fighter1.currentHealth > 0 && fighter2.currentHealth > 0 && turns < maxTurns) {
      turns++;
      log.push(`\n--- Turno ${turns} ---`);

      this.updateCooldowns(fighter1);
      this.updateCooldowns(fighter2);

      this.performAttack(fighter1, fighter2, weapon1, skills, combatOptions, log);
      
      if (fighter2.currentHealth <= 0) break;

      this.performAttack(fighter2, fighter1, weapon2, skills, combatOptions, log);
    }

    let winner: string | null = null;
    if (fighter1.currentHealth > 0 && fighter2.currentHealth <= 0) {
      winner = fighter1.name;
      log.push(`\n${fighter1.name} VINCE!`);
    } else if (fighter2.currentHealth > 0 && fighter1.currentHealth <= 0) {
      winner = fighter2.name;
      log.push(`\n${fighter2.name} VINCE!`);
    } else {
      log.push(`\nPAREGGIO! (Combattimento durato ${maxTurns} turni)`);
    }

    return {
      winner,
      turns,
      log,
      finalStats: {
        char1Health: Math.max(0, fighter1.currentHealth),
        char2Health: Math.max(0, fighter2.currentHealth)
      }
    };
  }

  private updateCooldowns(fighter: any): void {
    for (const [skillId, cooldown] of fighter.skillCooldowns.entries()) {
      if (cooldown > 0) {
        fighter.skillCooldowns.set(skillId, cooldown - 1);
      }
    }
  }

  private performAttack(
    attacker: any,
    defender: any,
    weapon: Weapon,
    skills: Skill[],
    combatOptions: CombatOptions,
    log: string[]
  ): void {
    let selectedSkill: Skill | null = null;
    if (combatOptions.skills && attacker.equippedSkills.length > 0) {
      const availableSkills = attacker.equippedSkills
        .map((id: number) => skills.find(s => s.id === id))
        .filter((skill: Skill | undefined): skill is Skill => skill !== undefined && (!attacker.skillCooldowns.get(skill.id) || attacker.skillCooldowns.get(skill.id) === 0));
      
      if (availableSkills.length > 0) {
        selectedSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
      }
    }

    const attacks = weapon.attacks;
    let totalDamage = 0;

    for (let i = 0; i < attacks; i++) {
      if (combatOptions.hitChance && !this.calculateHitChance(attacker, defender, combatOptions)) {
        log.push(`${attacker.name} manca il colpo!`);
        continue;
      }

      const isCritical = combatOptions.critical && this.calculateCriticalHit(attacker, combatOptions);
      const skillMultiplier = selectedSkill ? selectedSkill.damage : 1;
      let damage = this.calculateDamage(attacker, weapon, skillMultiplier, isCritical);

      if (combatOptions.armor) {
        damage = this.applyArmor(damage, defender.armor.defense);
      }

      totalDamage += damage;
      
      const attackText = selectedSkill ? `${selectedSkill.name}` : `${weapon.name}`;
      const critText = isCritical ? " (CRITICO!)" : "";
      log.push(`${attacker.name} attacca con ${attackText} per ${damage} danno${critText}`);
    }

    if (selectedSkill) {
      attacker.skillCooldowns.set(selectedSkill.id, selectedSkill.cooldown);
    }

    defender.currentHealth -= totalDamage;
    log.push(`${defender.name} ha ${Math.max(0, defender.currentHealth)} HP rimanenti`);
  }

  public async runMassSimulation(
    char1: Character,
    char2: Character,
    weapons: Weapon[],
    skills: Skill[],
    combatOptions: CombatOptions,
    iterations: number = 1000
  ): Promise<any> {
    let char1Wins = 0;
    let char2Wins = 0;
    let draws = 0;
    let totalTurns = 0;
    const turnCounts: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const result = this.runSingleCombat(char1, char2, weapons, skills, combatOptions);
      
      if (result.winner === char1.name) {
        char1Wins++;
      } else if (result.winner === char2.name) {
        char2Wins++;
      } else {
        draws++;
      }
      
      totalTurns += result.turns;
      turnCounts.push(result.turns);
      
      if (i % 100 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }

    const avgTurns = totalTurns / iterations;
    const char1WinRate = (char1Wins / iterations) * 100;
    const char2WinRate = (char2Wins / iterations) * 100;
    const drawRate = (draws / iterations) * 100;

    const balanceIssues: string[] = [];
    if (char1WinRate > 65) {
      balanceIssues.push(`${char1.name} troppo forte (${char1WinRate.toFixed(1)}% vittorie)`);
    }
    if (char2WinRate > 65) {
      balanceIssues.push(`${char2.name} troppo forte (${char2WinRate.toFixed(1)}% vittorie)`);
    }
    if (avgTurns > 15) {
      balanceIssues.push(`Combattimento troppo lento (${avgTurns.toFixed(1)} turni in media)`);
    }
    if (avgTurns < 3) {
      balanceIssues.push(`Combattimento troppo veloce (${avgTurns.toFixed(1)} turni in media)`);
    }
    if (drawRate > 15) {
      balanceIssues.push(`Troppi pareggi (${drawRate.toFixed(1)}%)`);
    }

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
}

export const combatEngine = new CombatEngine();