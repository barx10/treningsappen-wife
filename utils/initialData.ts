import { 
  ExerciseDefinition, 
  WorkoutSession, 
  MuscleGroup, 
  ExerciseType, 
  WorkoutStatus,
  WorkoutExercise
} from '../types';

// Definerer øvelsene fra programmet ditt
export const createInitialExercises = (): ExerciseDefinition[] => [
  // Oppvarming
  { id: 'ex_warmup', name: 'Oppvarming (Gå + Dynamisk)', muscleGroup: MuscleGroup.FULL_BODY, type: ExerciseType.DURATION },
  
  // Baseøvelser Styrke
  { id: 'ex_squat', name: 'Knebøy / Goblet Squat', muscleGroup: MuscleGroup.LEGS, type: ExerciseType.WEIGHTED },
  { id: 'ex_pushup', name: 'Armhevinger', muscleGroup: MuscleGroup.CHEST, type: ExerciseType.BODYWEIGHT },
  { id: 'ex_bench', name: 'Benkpress', muscleGroup: MuscleGroup.CHEST, type: ExerciseType.WEIGHTED },
  { id: 'ex_row', name: 'Roing (Stang/Manual)', muscleGroup: MuscleGroup.BACK, type: ExerciseType.WEIGHTED },
  { id: 'ex_bridge', name: 'Hoftehev / Glute Bridge', muscleGroup: MuscleGroup.LEGS, type: ExerciseType.BODYWEIGHT },
  { id: 'ex_deadlift', name: 'Markløft (KB/Stang)', muscleGroup: MuscleGroup.BACK, type: ExerciseType.WEIGHTED },
  { id: 'ex_press', name: 'Skulderpress', muscleGroup: MuscleGroup.SHOULDERS, type: ExerciseType.WEIGHTED },
  { id: 'ex_lat_row', name: 'Nedtrekk / Sittende Roing', muscleGroup: MuscleGroup.BACK, type: ExerciseType.WEIGHTED },
  { id: 'ex_plank', name: 'Planke', muscleGroup: MuscleGroup.CORE, type: ExerciseType.DURATION },

  // Kondisjon
  { id: 'ex_walk_int', name: 'Gange m/ Intervaller', muscleGroup: MuscleGroup.CARDIO, type: ExerciseType.CARDIO },
  { id: 'ex_stairs', name: 'Trappeintervaller', muscleGroup: MuscleGroup.CARDIO, type: ExerciseType.CARDIO },
  { id: 'ex_walk_fast', name: 'Rask Gange (Sammenhengende)', muscleGroup: MuscleGroup.CARDIO, type: ExerciseType.CARDIO },
];

// Hjelpefunksjon for å lage sett
const createSets = (count: number, reps: number = 10) => {
  return Array(count).fill(null).map(() => ({
    id: crypto.randomUUID(),
    weight: 0,
    reps: reps,
    completed: false
  }));
};

// Maler for øktene dine
export const createSessionA = (): WorkoutSession => ({
  id: crypto.randomUUID(),
  name: 'Økt A: Styrke & Intervall',
  date: new Date().toISOString(),
  startTime: new Date().toISOString(),
  status: WorkoutStatus.ACTIVE,
  exercises: [
    { id: crypto.randomUUID(), exerciseDefinitionId: 'ex_warmup', notes: '5 min rolig + 2 min raskere. Dynamisk tøyning.', sets: [{ id: crypto.randomUUID(), durationMinutes: 10, completed: false }] },
    { id: crypto.randomUUID(), exerciseDefinitionId: 'ex_squat', notes: '3 sett x 8-10 reps', sets: createSets(3, 10) },
    { id: crypto.randomUUID(), exerciseDefinitionId: 'ex_pushup', notes: 'Eller benkpress. 3 sett x 8-10 reps', sets: createSets(3, 10) },
    { id: crypto.randomUUID(), exerciseDefinitionId: 'ex_row', notes: '3 sett x 8-10 reps', sets: createSets(3, 10) },
    { id: crypto.randomUUID(), exerciseDefinitionId: 'ex_bridge', notes: '3 sett x 10-12 reps', sets: createSets(3, 12) },
    { id: crypto.randomUUID(), exerciseDefinitionId: 'ex_walk_int', notes: '1 min rask / 1 min rolig x 6-8 ganger', sets: [{ id: crypto.randomUUID(), durationMinutes: 15, completed: false }] },
  ]
});

export const createSessionB = (): WorkoutSession => ({
  id: crypto.randomUUID(),
  name: 'Økt B: Base & Trapper',
  date: new Date().toISOString(),
  startTime: new Date().toISOString(),
  status: WorkoutStatus.ACTIVE,
  exercises: [
    { id: crypto.randomUUID(), exerciseDefinitionId: 'ex_warmup', notes: '5 min rolig + 2 min raskere. Dynamisk tøyning.', sets: [{ id: crypto.randomUUID(), durationMinutes: 10, completed: false }] },
    { id: crypto.randomUUID(), exerciseDefinitionId: 'ex_deadlift', notes: 'Kettlebell eller stang. 3 sett x 6-8 reps', sets: createSets(3, 8) },
    { id: crypto.randomUUID(), exerciseDefinitionId: 'ex_press', notes: 'Sittende eller stående. 3 sett x 8-10 reps', sets: createSets(3, 10) },
    { id: crypto.randomUUID(), exerciseDefinitionId: 'ex_lat_row', notes: '3 sett x 8-10 reps', sets: createSets(3, 10) },
    { id: crypto.randomUUID(), exerciseDefinitionId: 'ex_plank', notes: '3 runder x 15-30 sek', sets: [{ id: crypto.randomUUID(), durationMinutes: 0.5, completed: false }, { id: crypto.randomUUID(), durationMinutes: 0.5, completed: false }, { id: crypto.randomUUID(), durationMinutes: 0.5, completed: false }] },
    { id: crypto.randomUUID(), exerciseDefinitionId: 'ex_stairs', notes: 'Gå opp/ned 1 etg. Pause 1 min. 5-8 ganger.', sets: [{ id: crypto.randomUUID(), durationMinutes: 10, completed: false }] },
  ]
});

export const createInitialHistory = (): WorkoutSession[] => {
  // Lager en "fullført" Økt A for et par dager siden for å vise historikk
  const date = new Date();
  date.setDate(date.getDate() - 2);

  const session = createSessionA();
  session.id = 'past_session_1';
  session.status: WorkoutStatus.COMPLETED;
  session.date = date.toISOString();
  session.startTime = date.toISOString();
  session.endTime = new Date(date.getTime() + 45 * 60000).toISOString(); // 45 min later
  session.exercises.forEach(ex => ex.sets.forEach(s => {
    s.completed = true;
    s.weight = 10; // Mock data
  }));

  return [session];
};

export const createEmptySession = (): WorkoutSession => ({
  id: crypto.randomUUID(),
  name: 'Egentrening',
  date: new Date().toISOString(),
  startTime: new Date().toISOString(),
  exercises: [],
  status: WorkoutStatus.ACTIVE
});