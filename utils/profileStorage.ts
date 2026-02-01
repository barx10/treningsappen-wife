import { UserProfile } from '../types';
import { STORAGE_KEYS } from './storageKeys';

const hasStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const loadProfile = (): UserProfile => {
    if (!hasStorage()) return { name: 'Rakel' };
    try {
        const stored = window.localStorage.getItem(STORAGE_KEYS.PROFILE);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Failed to load profile:', error);
    }
    return { name: 'Rakel' }; // Default
};

export const saveProfile = (profile: UserProfile): void => {
    if (!hasStorage()) return;
    try {
        window.localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (error) {
        console.error('Failed to save profile:', error);
    }
};
