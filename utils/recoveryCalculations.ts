import { WorkoutSession, MuscleGroup, ExerciseDefinition } from '../types';
import { parseDateString, getDaysDifference, isYesterday } from './dateUtils';

export interface MuscleGroupRecovery {
  muscleGroup: MuscleGroup;
  daysSinceLastTrained: number;
  lastTrainedDate: string | null;
  status: 'fresh' | 'ready' | 'warning' | 'overdue';
  message: string;
}

export interface RecoveryWarning {
  type: 'overtraining' | 'neglected';
  muscleGroup: MuscleGroup;
  message: string;
  severity: 'high' | 'medium' | 'low';
}

/**
 * Calculate days since each muscle group was last trained
 */
export function calculateMuscleGroupRecovery(
  history: WorkoutSession[],
  exercises: ExerciseDefinition[]
): MuscleGroupRecovery[] {
  const now = new Date();
  const muscleGroupLastTrained = new Map<MuscleGroup, Date>();

  // Find last training date for each muscle group
  const completedSessions = history
    .filter(s => s.status === 'Fullført')
    .sort((a, b) => {
      const dateA = parseDateString(a.date);
      const dateB = parseDateString(b.date);
      return dateB.getTime() - dateA.getTime();
    });

  completedSessions.forEach(session => {
    session.exercises.forEach(exercise => {
      const def = exercises.find(e => e.id === exercise.exerciseDefinitionId);
      if (def && !muscleGroupLastTrained.has(def.muscleGroup)) {
        muscleGroupLastTrained.set(def.muscleGroup, parseDateString(session.date));
      }
    });
  });

  // Calculate recovery status for each muscle group
  const allMuscleGroups = Object.values(MuscleGroup);
  return allMuscleGroups.map(muscleGroup => {
    const lastDate = muscleGroupLastTrained.get(muscleGroup);
    const daysSince = lastDate
      ? Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    let status: MuscleGroupRecovery['status'];
    let message: string;

    if (daysSince === 0) {
      status = 'fresh';
      message = 'Trent i dag! 💪';
    } else if (daysSince === 1) {
      status = 'warning';
      message = 'Trent i går - kanskje hvile?';
    } else if (daysSince <= 3) {
      status = 'ready';
      message = `${daysSince} dager siden - klar for trening`;
    } else if (daysSince <= 7) {
      status = 'ready';
      message = `${daysSince} dager siden - god tid siden sist`;
    } else if (daysSince <= 14) {
      status = 'overdue';
      message = `${daysSince} dager siden - på tide å trene!`;
    } else if (daysSince === 999) {
      status = 'overdue';
      message = 'Aldri trent';
    } else {
      status = 'overdue';
      message = `${daysSince} dager siden - lenge siden!`;
    }

    return {
      muscleGroup,
      daysSinceLastTrained: daysSince,
      lastTrainedDate: lastDate ? lastDate.toISOString() : null,
      status,
      message
    };
  });
}

/**
 * Check for overtraining (same muscle group trained 2 days in a row)
 */
export function checkOvertrainingRisk(
  history: WorkoutSession[],
  exercises: ExerciseDefinition[],
  todaysMuscleGroups: MuscleGroup[]
): RecoveryWarning[] {
  const warnings: RecoveryWarning[] = [];

  // Find yesterday's muscle groups
  const yesterdaysMuscleGroups = new Set<MuscleGroup>();
  history
    .filter(s => s.status === 'Fullført' && isYesterday(s.date))
    .forEach(session => {
      session.exercises.forEach(exercise => {
        const def = exercises.find(e => e.id === exercise.exerciseDefinitionId);
        if (def) yesterdaysMuscleGroups.add(def.muscleGroup);
      });
    });

  // Check for overlap
  todaysMuscleGroups.forEach(muscleGroup => {
    if (yesterdaysMuscleGroups.has(muscleGroup)) {
      warnings.push({
        type: 'overtraining',
        muscleGroup,
        message: `Du trente ${muscleGroup.toLowerCase()} i går. Vurder hviledag eller annen muskelgruppe.`,
        severity: 'high'
      });
    }
  });

  return warnings;
}

/**
 * Find neglected muscle groups (not trained in 10+ days)
 */
export function findNeglectedMuscleGroups(
  recovery: MuscleGroupRecovery[]
): RecoveryWarning[] {
  return recovery
    .filter(r => r.daysSinceLastTrained >= 10 && r.daysSinceLastTrained < 999)
    .map(r => ({
      type: 'neglected' as const,
      muscleGroup: r.muscleGroup,
      message: `${r.muscleGroup} ikke trent på ${r.daysSinceLastTrained} dager. Legg inn en økt snart!`,
      severity: r.daysSinceLastTrained >= 14 ? 'high' as const : 'medium' as const
    }));
}

/**
 * Get emoji for muscle group
 */
export function getMuscleGroupEmoji(muscleGroup: MuscleGroup): string {
  const emojiMap: Record<MuscleGroup, string> = {
    [MuscleGroup.CHEST]: '💪',
    [MuscleGroup.BACK]: '🔙',
    [MuscleGroup.LEGS]: '🦵',
    [MuscleGroup.SHOULDERS]: '🤷',
    [MuscleGroup.ARMS]: '💪',
    [MuscleGroup.CORE]: '🧘',
    [MuscleGroup.CARDIO]: '🏃',

  };
  return emojiMap[muscleGroup] || '💪';
}
