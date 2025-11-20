import { UserProfile } from '../types';

const PROFILE_KEY = 'treningsappen_user_profile';

export const loadProfile = (): UserProfile => {
    try {
        const stored = localStorage.getItem(PROFILE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Failed to load profile:', error);
    }
    return { name: 'Kenneth' }; // Default
};

export const saveProfile = (profile: UserProfile): void => {
    try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
        console.error('Failed to save profile:', error);
    }
};
