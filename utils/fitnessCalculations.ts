import { UserProfile, WorkoutSession, ExerciseDefinition, ExerciseType, MuscleGroup } from '../types';

/**
 * Calculate estimated calories burned during a workout session
 * Based on MET (Metabolic Equivalent of Task) values
 */
export const calculateCaloriesBurned = (
    session: WorkoutSession,
    exercises: ExerciseDefinition[],
    userWeight?: number
): number => {
    if (!userWeight) return 0;

    const durationMinutes = session.endTime
        ? (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000
        : 0;

    // Average MET values for different exercise types
    const MET_VALUES = {
        [ExerciseType.WEIGHTED]: 6.0, // Weight training, vigorous
        [ExerciseType.BODYWEIGHT]: 5.0, // Calisthenics, vigorous
        [ExerciseType.CARDIO]: 7.0, // Cardio, moderate-vigorous
        [ExerciseType.DURATION]: 4.0, // Static exercises like planks
    };

    // Calculate average MET based on exercises in session
    let totalMET = 0;
    let exerciseCount = 0;

    session.exercises.forEach((workoutEx) => {
        const def = exercises.find((e) => e.id === workoutEx.exerciseDefinitionId);
        if (def) {
            totalMET += MET_VALUES[def.type] || 5.0;
            exerciseCount++;
        }
    });

    const avgMET = exerciseCount > 0 ? totalMET / exerciseCount : 5.0;

    // Calories = MET × weight(kg) × duration(hours)
    const calories = avgMET * userWeight * (durationMinutes / 60);

    return Math.round(calories);
};

/**
 * Get personalized recommendations based on user profile and history
 */
export const getRecommendations = (
    profile: UserProfile,
    history: WorkoutSession[],
    exercises: ExerciseDefinition[]
): string[] => {
    const recommendations: string[] = [];

    // 1. Get this week's sessions
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    const weekSessions = history.filter((s) => new Date(s.date) >= monday);

    // Get yesterday's workout
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const yesterdayEnd = new Date(yesterday);
    yesterdayEnd.setHours(23, 59, 59, 999);

    const yesterdayWorkout = history.find(s => {
        const sessionDate = new Date(s.date);
        return sessionDate >= yesterday && sessionDate <= yesterdayEnd;
    });

    // 2. Analyze what has been trained
    const muscleCounts: Record<string, number> = {};
    const musclesYesterday: string[] = [];
    let cardioSessions = 0;
    let strengthSessions = 0;

    weekSessions.forEach((session) => {
        let hasCardio = false;
        let hasStrength = false;
        const isYesterday = session.id === yesterdayWorkout?.id;

        session.exercises.forEach((ex) => {
            const def = exercises.find((e) => e.id === ex.exerciseDefinitionId);
            if (def) {
                muscleCounts[def.muscleGroup] = (muscleCounts[def.muscleGroup] || 0) + 1;

                if (isYesterday && !musclesYesterday.includes(def.muscleGroup)) {
                    musclesYesterday.push(def.muscleGroup);
                }

                if (def.type === ExerciseType.CARDIO) hasCardio = true;
                if (def.type === ExerciseType.WEIGHTED || def.type === ExerciseType.BODYWEIGHT) hasStrength = true;
            }
        });

        if (hasCardio) cardioSessions++;
        if (hasStrength) strengthSessions++;
    });

    const totalSessions = weekSessions.length;

    // 3. Give specific recommendations based on yesterday and goal
    if (yesterdayWorkout && musclesYesterday.length > 0) {
        const muscleStr = musclesYesterday.join(', ').toLowerCase();

        // Suggest complementary muscles for today
        const trainedLegs = musclesYesterday.includes(MuscleGroup.LEGS);
        const trainedChest = musclesYesterday.includes(MuscleGroup.CHEST);
        const trainedBack = musclesYesterday.includes(MuscleGroup.BACK);
        const trainedShoulders = musclesYesterday.includes(MuscleGroup.SHOULDERS);

        if (profile.goal === 'strength' || profile.goal === 'muscle') {
            if (trainedLegs) {
                recommendations.push(`💪 Bra jobbet med bein i går! I dag kan du fokusere på overkropp - rygg og bryst.`);
            } else if (trainedChest || trainedShoulders) {
                recommendations.push(`✅ Flott press-økt i går (${muscleStr})! I dag: tren rygg for balanse.`);
            } else if (trainedBack) {
                recommendations.push(`🎯 Sterk ryggøkt i går! I dag kan du trene bryst og skuldre.`);
            } else {
                recommendations.push(`🔥 Bra økt i går med ${muscleStr}! Fortsett med komplementære muskelgrupper.`);
            }
        } else if (profile.goal === 'weight_loss') {
            if (strengthSessions > cardioSessions) {
                recommendations.push(`🏃 Du har trent mye styrke denne uken. Legg inn en kondisjonsøkt i dag!`);
            } else {
                recommendations.push(`💪 Bra med kondisjon! Kombiner med styrke for optimal fettforbrenning.`);
            }
        } else if (profile.goal === 'endurance') {
            if (cardioSessions < 2) {
                recommendations.push(`❤️ Få opp pulsen i dag! En intervall- eller distanseøkt vil bygge kondisjonen.`);
            } else {
                recommendations.push(`🦵 Legg inn styrke for beina - det gir bedre løpsøkonomi.`);
            }
        }
    } else {
        // No workout yesterday - give general guidance
        if (totalSessions === 0) {
            recommendations.push('🚀 Ny uke, nye muligheter! Start med en god fullkroppsøkt i dag.');
            if (profile.goal === 'strength') recommendations.push('💪 Tips: Begynn med de tyngste løftene (knebøy, markløft).');
        } else {
            recommendations.push('🌟 Fortsett den gode trenden! Hva med en økt i dag?');
        }
    }

    // 4. Check for missing muscle groups
    if (profile.goal === 'strength' || profile.goal === 'muscle') {
        if (!muscleCounts[MuscleGroup.LEGS] && totalSessions > 1) {
            recommendations.push('🦵 Du har ikke trent bein denne uken. Legg inn en leg day snart!');
        }

        const pushCount = (muscleCounts[MuscleGroup.CHEST] || 0) + (muscleCounts[MuscleGroup.SHOULDERS] || 0);
        const pullCount = muscleCounts[MuscleGroup.BACK] || 0;

        if (pushCount > pullCount + 2) {
            recommendations.push('⚖️ Mye press denne uken. Tren rygg for å unngå ubalanse.');
        }
    }

    // 5. Recovery advice
    if (totalSessions >= 5) {
        recommendations.push('💤 Du har trent mye! Vurder en hviledag eller lett aktivitet.');
    } else if (totalSessions >= 3 && !muscleCounts[MuscleGroup.CORE]) {
        recommendations.push('🧱 Husk kjernemuskulaturen - legg inn planke eller mageøvelser.');
    }

    return recommendations.slice(0, 3);
};

/**
 * Calculate strength standards based on bodyweight
 * Returns percentile (0-100) for common lifts
 */
export const getStrengthStandard = (
    exerciseName: string,
    weight: number,
    userWeight?: number,
    age?: number,
    gender: 'male' | 'female' = 'male'
): { level: string; percentile: number } | null => {
    if (!userWeight || !weight) return null;

    const ratio = weight / userWeight;

    // Simplified strength standards (male, approximate)
    // Based on ExRx.net standards
    const standards: Record<string, { beginner: number; intermediate: number; advanced: number }> = {
        'Knebøy / Goblet Squat': { beginner: 0.75, intermediate: 1.25, advanced: 1.75 },
        'Markløft (KB/Stang)': { beginner: 1.0, intermediate: 1.5, advanced: 2.0 },
        Benkpress: { beginner: 0.5, intermediate: 1.0, advanced: 1.5 },
        Skulderpress: { beginner: 0.35, intermediate: 0.6, advanced: 0.9 },
    };

    const standard = standards[exerciseName];
    if (!standard) return null;

    let level = 'Nybegynner';
    let percentile = 20;

    if (ratio >= standard.advanced) {
        level = 'Avansert';
        percentile = 85;
    } else if (ratio >= standard.intermediate) {
        level = 'Middels';
        percentile = 60;
    } else if (ratio >= standard.beginner) {
        level = 'Nybegynner+';
        percentile = 40;
    }

    return { level, percentile };
};

/**
 * Calculate weekly statistics
 */
export const getWeeklyStats = (
    history: WorkoutSession[],
    exercises: ExerciseDefinition[],
    userWeight?: number
) => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    const weekSessions = history.filter((s) => new Date(s.date) >= monday);

    let totalMinutes = 0;
    let totalCalories = 0;

    weekSessions.forEach((session) => {
        if (session.endTime) {
            const duration =
                (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000;
            totalMinutes += duration;

            if (userWeight) {
                totalCalories += calculateCaloriesBurned(session, exercises, userWeight);
            }
        }
    });

    return {
        workouts: weekSessions.length,
        totalMinutes: Math.round(totalMinutes),
        totalCalories: Math.round(totalCalories),
    };
};
