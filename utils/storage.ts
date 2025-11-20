import { ExerciseDefinition, WorkoutSession } from '../types';
import { createInitialExercises, createInitialHistory } from './initialData';

const KEYS = {
    EXERCISES: 'treningsappen_exercises',
    HISTORY: 'treningsappen_history',
    ACTIVE_SESSION: 'treningsappen_active_session',
};

export const loadExercises = (): ExerciseDefinition[] => {
    try {
        const stored = localStorage.getItem(KEYS.EXERCISES);
        return stored ? JSON.parse(stored) : createInitialExercises();
    } catch (error) {
        console.error('Failed to load exercises', error);
        return createInitialExercises();
    }
};

export const saveExercises = (exercises: ExerciseDefinition[]) => {
    try {
        localStorage.setItem(KEYS.EXERCISES, JSON.stringify(exercises));
    } catch (error) {
        console.error('Failed to save exercises', error);
    }
};

export const loadHistory = (): WorkoutSession[] => {
    try {
        const stored = localStorage.getItem(KEYS.HISTORY);
        return stored ? JSON.parse(stored) : createInitialHistory();
    } catch (error) {
        console.error('Failed to load history', error);
        return createInitialHistory();
    }
};

export const saveHistory = (history: WorkoutSession[]) => {
    try {
        localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
    } catch (error) {
        console.error('Failed to save history', error);
    }
};

export const loadActiveSession = (): WorkoutSession | null => {
    try {
        const stored = localStorage.getItem(KEYS.ACTIVE_SESSION);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error('Failed to load active session', error);
        return null;
    }
};

export const saveActiveSession = (session: WorkoutSession | null) => {
    try {
        if (session) {
            localStorage.setItem(KEYS.ACTIVE_SESSION, JSON.stringify(session));
        } else {
            localStorage.removeItem(KEYS.ACTIVE_SESSION);
        }
    } catch (error) {
        console.error('Failed to save active session', error);
    }
};
