import { ExerciseDefinition, WorkoutSession, FavoriteWorkout } from '../types';
import { createInitialExercises, createInitialHistory } from './initialData';
import { STORAGE_KEYS } from './storageKeys';

const hasStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

/**
 * Migrate stored exercises to always use latest data from initialData for built-in exercises
 * Also adds any new exercises and removes deleted built-in exercises
 */
const migrateExercises = (storedExercises: ExerciseDefinition[]): ExerciseDefinition[] => {
    const initialExercises = createInitialExercises();
    const initialIds = new Set(initialExercises.map(ex => ex.id));

    // Filter out deleted built-in exercises (keep custom exercises)
    const filteredExercises = storedExercises.filter(stored =>
        stored.isCustom || initialIds.has(stored.id)
    );

    // Update existing exercises with latest data from initialData
    const updatedExercises = filteredExercises.map(stored => {
        // Find matching exercise in initial data (for built-in exercises)
        const initial = initialExercises.find(ex => ex.id === stored.id);

        // If it's a built-in exercise, use all data from initial except user stats
        if (initial && !stored.isCustom) {
            return {
                ...initial,
                // Preserve user-specific data
                personalBest: stored.personalBest,
                lastPerformed: stored.lastPerformed,
                totalSessions: stored.totalSessions,
            };
        }

        return stored;
    });

    // Find new exercises that don't exist in stored data yet
    const storedIds = new Set(filteredExercises.map(ex => ex.id));
    const newExercises = initialExercises.filter(ex => !storedIds.has(ex.id));

    // Return updated exercises + new exercises
    return [...updatedExercises, ...newExercises];
};

export const loadExercises = (): ExerciseDefinition[] => {
    if (!hasStorage()) return createInitialExercises();
    try {
        const stored = window.localStorage.getItem(STORAGE_KEYS.EXERCISES);
        if (!stored) return createInitialExercises();
        
        const parsed = JSON.parse(stored);
        const migrated = migrateExercises(parsed);
        
        // Save migrated data back to localStorage
        if (JSON.stringify(migrated) !== stored) {
            window.localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(migrated));
        }
        
        return migrated;
    } catch (error) {
        console.error('Failed to load exercises', error);
        return createInitialExercises();
    }
};

export const saveExercises = (exercises: ExerciseDefinition[]) => {
    if (!hasStorage()) return;
    try {
        window.localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
    } catch (error) {
        console.error('Failed to save exercises', error);
    }
};

export const loadHistory = (): WorkoutSession[] => {
    if (!hasStorage()) return createInitialHistory();
    try {
        const stored = window.localStorage.getItem(STORAGE_KEYS.HISTORY);
        return stored ? JSON.parse(stored) : createInitialHistory();
    } catch (error) {
        console.error('Failed to load history', error);
        return createInitialHistory();
    }
};

export const saveHistory = (history: WorkoutSession[]) => {
    if (!hasStorage()) return;
    try {
        window.localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (error) {
        console.error('Failed to save history', error);
    }
};

export const loadActiveSession = (): WorkoutSession | null => {
    if (!hasStorage()) return null;
    try {
        const stored = window.localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error('Failed to load active session', error);
        return null;
    }
};

export const saveActiveSession = (session: WorkoutSession | null) => {
    if (!hasStorage()) return;
    try {
        if (session) {
            window.localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
        } else {
            window.localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
        }
    } catch (error) {
        console.error('Failed to save active session', error);
    }
};

// Favorite Workouts
export const loadFavoriteWorkouts = (): FavoriteWorkout[] => {
    if (!hasStorage()) return [];
    try {
        const stored = window.localStorage.getItem(STORAGE_KEYS.FAVORITE_WORKOUTS);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Failed to load favorite workouts', error);
        return [];
    }
};

export const saveFavoriteWorkouts = (favorites: FavoriteWorkout[]) => {
    if (!hasStorage()) return;
    try {
        window.localStorage.setItem(STORAGE_KEYS.FAVORITE_WORKOUTS, JSON.stringify(favorites));
    } catch (error) {
        console.error('Failed to save favorite workouts', error);
    }
};

/**
 * Clear all app data from localStorage
 * This will remove all history, sessions, favorites, but keep profile
 */
export const clearAllData = () => {
    if (!hasStorage()) return;
    try {
        window.localStorage.removeItem(STORAGE_KEYS.HISTORY);
        window.localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
        window.localStorage.removeItem(STORAGE_KEYS.FAVORITE_WORKOUTS);
        // Reset exercises to initial state by removing stored data
        window.localStorage.removeItem(STORAGE_KEYS.EXERCISES);
    } catch (error) {
        console.error('Failed to clear data', error);
    }
};

