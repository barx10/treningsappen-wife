import React, { useState } from 'react';
import { UserProfile, WorkoutSession, ExerciseDefinition } from '../types';
import { User, Target, TrendingUp, Save, Dumbbell, Trophy } from 'lucide-react';
import { getStrengthStandard } from '../utils/fitnessCalculations';

interface ProfileViewProps {
    profile: UserProfile;
    onUpdateProfile: (profile: UserProfile) => void;
    history?: WorkoutSession[];
    exercises?: ExerciseDefinition[];
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, onUpdateProfile, history, exercises }) => {
    const [name, setName] = useState(profile.name || '');
    const [age, setAge] = useState(profile.age?.toString() || '');
    const [weight, setWeight] = useState(profile.weight?.toString() || '');
    const [height, setHeight] = useState(profile.height?.toString() || '');
    const [goal, setGoal] = useState(profile.goal || 'general');

    const handleSave = () => {
        const updatedProfile: UserProfile = {
            name: name.trim() || 'Kenneth',
            age: age ? parseInt(age) : undefined,
            weight: weight ? parseFloat(weight) : undefined,
            height: height ? parseInt(height) : undefined,
            goal: goal as UserProfile['goal']
        };
        onUpdateProfile(updatedProfile);
    };

    const goalOptions = [
        { value: 'strength', label: 'Bli sterkere', emoji: '💪' },
        { value: 'muscle', label: 'Bygge muskler', emoji: '🏋️' },
        { value: 'weight_loss', label: 'Gå ned i vekt', emoji: '📉' },
        { value: 'endurance', label: 'Forbedre kondisjonen', emoji: '🏃' },
        { value: 'general', label: 'Generell helse', emoji: '❤️' }
    ];

    // Calculate BMI if height and weight are available
    const bmi = profile.height && profile.weight
        ? (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)
        : null;

    // Helper to find max weight for an exercise
    const getMaxWeight = (exerciseName: string): number => {
        if (!history || !exercises) return 0;

        // Find definition ID
        const def = exercises.find(e => e.name === exerciseName);
        if (!def) return 0;

        let max = 0;
        history.forEach(session => {
            const exData = session.exercises.find(e => e.exerciseDefinitionId === def.id);
            if (exData) {
                exData.sets.forEach(set => {
                    if (set.completed && set.weight && set.weight > max) {
                        max = set.weight;
                    }
                });
            }
        });
        return max;
    };

    const strengthExercises = [
        'Knebøy / Goblet Squat',
        'Markløft (KB/Stang)',
        'Benkpress',
        'Skulderpress'
    ];

    return (
        <div className="p-4 pb-24 space-y-6">
            <header className="flex items-center space-x-3 mb-6 mt-2">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <User size={24} className="text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Min Profil</h1>
                    <p className="text-muted text-sm">Personlig informasjon og mål</p>
                </div>
            </header>

            {/* Personal Info Section */}
            <div className="bg-surface rounded-xl border border-slate-700 p-5 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center">
                    <User size={18} className="mr-2 text-primary" />
                    Personlig Info
                </h2>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Navn</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-background border border-slate-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                        placeholder="Ditt navn"
                    />
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Alder</label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full bg-background border border-slate-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                            placeholder="25"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Vekt (kg)</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full bg-background border border-slate-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                            placeholder="75"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Høyde (cm)</label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="w-full bg-background border border-slate-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                            placeholder="180"
                        />
                    </div>
                </div>
            </div>

            {/* Goal Section */}
            <div className="bg-surface rounded-xl border border-slate-700 p-5 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center">
                    <Target size={18} className="mr-2 text-primary" />
                    Treningsmål
                </h2>

                <div className="space-y-2">
                    {goalOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setGoal(option.value)}
                            className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center justify-between ${goal === option.value
                                ? 'border-primary bg-primary/10 text-white'
                                : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                                }`}
                        >
                            <span className="font-medium">{option.label}</span>
                            <span className="text-2xl">{option.emoji}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Section */}
            {bmi && (
                <div className="bg-surface rounded-xl border border-slate-700 p-5 space-y-3">
                    <h2 className="text-lg font-bold text-white flex items-center">
                        <TrendingUp size={18} className="mr-2 text-primary" />
                        Statistikk
                    </h2>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="bg-slate-800/50 rounded-lg p-4">
                            <div className="text-xs text-muted uppercase tracking-wide mb-1">BMI</div>
                            <div className="text-2xl font-bold text-white">{bmi}</div>
                            <div className="text-xs text-slate-400 mt-1">
                                {parseFloat(bmi) < 18.5 && 'Undervekt'}
                                {parseFloat(bmi) >= 18.5 && parseFloat(bmi) < 25 && 'Normal vekt'}
                                {parseFloat(bmi) >= 25 && parseFloat(bmi) < 30 && 'Overvekt'}
                                {parseFloat(bmi) >= 30 && 'Fedme'}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Strength Standards Section */}
            {profile.weight && history && exercises && (
                <div className="bg-surface rounded-xl border border-slate-700 p-5 space-y-4">
                    <h2 className="text-lg font-bold text-white flex items-center">
                        <Trophy size={18} className="mr-2 text-yellow-500" />
                        Styrkestandarder
                    </h2>
                    <p className="text-xs text-muted">Basert på din kroppsvekt ({profile.weight}kg)</p>

                    <div className="space-y-4">
                        {strengthExercises.map(exName => {
                            const maxWeight = getMaxWeight(exName);
                            if (maxWeight === 0) return null;

                            const standard = getStrengthStandard(exName, maxWeight, profile.weight);
                            if (!standard) return null;

                            return (
                                <div key={exName} className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-slate-200">{exName}</span>
                                        <span className="text-sm font-bold text-white">{maxWeight} kg</span>
                                    </div>

                                    <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden mb-1">
                                        <div
                                            className={`absolute top-0 left-0 h-full rounded-full ${standard.level === 'Avansert' ? 'bg-purple-500' :
                                                    standard.level === 'Middels' ? 'bg-emerald-500' :
                                                        standard.level === 'Nybegynner+' ? 'bg-blue-500' :
                                                            'bg-slate-500'
                                                }`}
                                            style={{ width: `${standard.percentile}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-muted uppercase tracking-wider">
                                        <span>Nivå: <span className="text-slate-300">{standard.level}</span></span>
                                        <span>{standard.percentile}%</span>
                                    </div>
                                </div>
                            );
                        })}
                        {strengthExercises.every(exName => getMaxWeight(exName) === 0) && (
                            <div className="text-sm text-muted italic text-center py-2">
                                Logg noen økter med baseøvelser for å se din styrkeprofil!
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Save Button */}
            <button
                onClick={handleSave}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-emerald-500 transition-all flex items-center justify-center"
            >
                <Save size={20} className="mr-2" />
                Lagre Profil
            </button>
        </div>
    );
};

export default ProfileView;
