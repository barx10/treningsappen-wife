import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Target, TrendingUp, Save } from 'lucide-react';

interface ProfileViewProps {
    profile: UserProfile;
    onUpdateProfile: (profile: UserProfile) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, onUpdateProfile }) => {
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
