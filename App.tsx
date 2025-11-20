import React, { useState, useEffect } from 'react';
import {
  ExerciseDefinition,
  WorkoutSession,
  Screen,
  WorkoutStatus,
  ExerciseType,
  UserProfile
} from './types';
import {
  createEmptySession
} from './utils/initialData';
import {
  loadExercises,
  saveExercises,
  loadHistory,
  saveHistory,
  loadActiveSession,
  saveActiveSession
} from './utils/storage';
import { loadProfile, saveProfile } from './utils/profileStorage';
import BottomNav from './components/BottomNav';
import ExerciseCard from './components/ExerciseCard';
import WorkoutHistoryCard from './components/WorkoutHistoryCard';
import ActiveSessionView from './components/ActiveSessionView';
import ExerciseDetailModal from './components/ExerciseDetailModal';
import ExerciseFormModal from './components/ExerciseFormModal';
import WelcomeScreen from './components/WelcomeScreen';
import ProfileView from './components/ProfileView';
import { getRecommendations, getWeeklyStats } from './utils/fitnessCalculations';
import { TrendingUp, Calendar, Play, Heart, Plus, Dumbbell, Lightbulb, Flame } from 'lucide-react';

export default function App() {
  // --- State ---
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(loadActiveSession);
  // Start på ACTIVE_WORKOUT hvis vi har en aktiv økt lagret
  const [currentScreen, setCurrentScreen] = useState<Screen>(() =>
    loadActiveSession() ? Screen.ACTIVE_WORKOUT : Screen.HOME
  );

  const [exercises, setExercises] = useState<ExerciseDefinition[]>(loadExercises);
  const [history, setHistory] = useState<WorkoutSession[]>(loadHistory);
  const [profile, setProfile] = useState<UserProfile>(loadProfile);

  // --- Effects for Persistence ---
  useEffect(() => {
    saveExercises(exercises);
  }, [exercises]);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  useEffect(() => {
    saveActiveSession(activeSession);
  }, [activeSession]);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  // Modals State
  const [viewingExercise, setViewingExercise] = useState<ExerciseDefinition | null>(null);
  const [isCreatingExercise, setIsCreatingExercise] = useState(false);
  const [exerciseToEdit, setExerciseToEdit] = useState<ExerciseDefinition | undefined>(undefined);

  // --- Actions ---

  const handleStartSession = () => {
    const session = createEmptySession();
    setActiveSession(session);
    setCurrentScreen(Screen.ACTIVE_WORKOUT);
  };

  const handleFinishSession = () => {
    if (!activeSession) return;

    const completedSession: WorkoutSession = {
      ...activeSession,
      endTime: new Date().toISOString(),
      status: WorkoutStatus.COMPLETED
    };

    setHistory([completedSession, ...history]);
    setActiveSession(null);
    setCurrentScreen(Screen.HISTORY);
  };

  const handleCancelSession = () => {
    if (confirm("Er du sikker på at du vil avbryte denne økten?")) {
      setActiveSession(null);
      setCurrentScreen(Screen.HOME);
    }
  };

  const handleSaveExercise = (exercise: ExerciseDefinition) => {
    if (exerciseToEdit) {
      // Update existing
      setExercises(exercises.map(e => e.id === exercise.id ? exercise : e));
    } else {
      // Create new
      setExercises([exercise, ...exercises]);
    }
    setIsCreatingExercise(false);
    setExerciseToEdit(undefined);
  };

  const handleDeleteExercise = (id: string) => {
    setExercises(exercises.filter(e => e.id !== id));
    setViewingExercise(null);
  };

  const handleEditExercise = (updatedExercise: ExerciseDefinition) => {
    setExercises(exercises.map(e => e.id === updatedExercise.id ? updatedExercise : e));
    setViewingExercise(null); // Close detail modal
    // Optionally we could keep it open with the new data, but closing is simpler for now
  };

  const handleDeleteHistory = (sessionId: string) => {
    setHistory(history.filter(s => s.id !== sessionId));
  };

  // --- Views ---

  const renderHome = () => {
    const recentWorkouts = history.slice(0, 2);

    return (
      <div className="p-4 pb-24 space-y-6">
        <header className="flex justify-between items-center mb-6 mt-2">
          <div>
            <h1 className="text-2xl font-bold text-white">Hei {profile.name}!</h1>
            <p className="text-muted text-sm">Klar for en sunnere uke?</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg">
            <Heart size={20} fill="white" />
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface p-4 rounded-xl border border-slate-700">
            <div className="flex items-center space-x-2 text-secondary mb-2">
              <TrendingUp size={18} />
              <span className="font-bold text-xs uppercase tracking-wide">Denne uken</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {(() => {
                const now = new Date();
                const day = now.getDay();
                const diff = now.getDate() - day + (day === 0 ? -6 : 1);
                const monday = new Date(now.setDate(diff));
                monday.setHours(0, 0, 0, 0);
                return history.filter(s => new Date(s.date) >= monday).length;
              })()}
              <span className="text-sm text-muted font-normal ml-1">økter</span>
            </div>
          </div>
          <div className="bg-surface p-4 rounded-xl border border-slate-700">
            <div className="flex items-center space-x-2 text-primary mb-2">
              <Dumbbell size={18} />
              <span className="font-bold text-xs uppercase tracking-wide">Totalt løftet</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {(() => {
                const volume = history.reduce((total, session) => {
                  return total + session.exercises.reduce((vol, ex) => {
                    return vol + ex.sets.reduce((sVol, set) => {
                      if (!set.completed || !set.weight || !set.reps) return sVol;
                      return sVol + (set.weight * set.reps);
                    }, 0);
                  }, 0);
                }, 0);
                return (volume / 1000).toFixed(1);
              })()}
              <span className="text-sm text-muted font-normal ml-1">tonn</span>
            </div>
          </div>
        </div>

        {/* Personalized Recommendations */}
        {profile.goal && (
          <section className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-xl p-5">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center">
              <Lightbulb size={20} className="mr-2 text-yellow-400" />
              Anbefalinger for deg
            </h2>
            <div className="space-y-2">
              {getRecommendations(profile, history).map((rec, idx) => (
                <div key={idx} className="text-sm text-slate-200 flex items-start">
                  <span className="mr-2 mt-0.5">•</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Weekly Summary with Calories */}
        {profile.weight && history.length > 0 && (() => {
          const weekStats = getWeeklyStats(history);
          return weekStats.workouts > 0 ? (
            <section className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-800/30 rounded-xl p-5">
              <h2 className="text-lg font-bold text-white mb-3 flex items-center">
                <Flame size={20} className="mr-2 text-orange-400" />
                Denne uken
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Økter</div>
                  <div className="text-2xl font-bold text-white">{weekStats.workouts}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Minutter</div>
                  <div className="text-2xl font-bold text-white">{weekStats.totalMinutes}</div>
                </div>
              </div>
            </section>
          ) : null;
        })()}

        {/* Quick Start Section */}
        {!activeSession && (
          <section>
            <h2 className="text-lg font-bold text-white mb-3">Start trening</h2>
            <button
              onClick={handleStartSession}
              className="w-full bg-gradient-to-r from-primary to-emerald-600 p-6 rounded-2xl flex items-center justify-between hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20 group"
            >
              <div className="text-left">
                <div className="font-bold text-white text-xl group-hover:underline">Start ny økt</div>
                <div className="text-emerald-100 text-sm mt-1">Velg øvelser selv og logg fremgang</div>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Play size={28} fill="currentColor" className="text-white" />
              </div>
            </button>
          </section>
        )}

        <section>
          <h2 className="text-lg font-bold text-white mb-3">Siste aktivitet</h2>
          <div className="space-y-3">
            {recentWorkouts.length > 0 ? (
              recentWorkouts.map(session => (
                <WorkoutHistoryCard
                  key={session.id}
                  session={session}
                  exercises={exercises}
                  userWeight={profile.weight}
                  onDelete={handleDeleteHistory}
                />
              ))
            ) : (
              <div className="p-8 text-center border border-dashed border-slate-700 rounded-xl text-muted">
                Ingen historikk enda.
              </div>
            )}
          </div>
        </section>
      </div>
    );
  };

  const renderHistory = () => (
    <div className="p-4 pb-24 space-y-4">
      <h1 className="text-2xl font-bold text-white mb-4 mt-2">Treningshistorikk</h1>
      {history.map(session => (
        <WorkoutHistoryCard
          key={session.id}
          session={session}
          exercises={exercises}
          userWeight={profile.weight}
          onDelete={handleDeleteHistory}
        />
      ))}
    </div>
  );

  const renderExercises = () => {
    const sortOrder: Record<string, number> = {
      [ExerciseType.CARDIO]: 0,
      [ExerciseType.DURATION]: 1, // Grouping Time with Bodyweight/Cardio
      [ExerciseType.BODYWEIGHT]: 1,
      [ExerciseType.WEIGHTED]: 2,
    };

    const sortedExercises = [...exercises].sort((a, b) => {
      const orderA = sortOrder[a.type] ?? 99;
      const orderB = sortOrder[b.type] ?? 99;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name);
    });

    return (
      <div className="p-4 pb-24 space-y-4">
        <div className="flex justify-between items-center mt-2 mb-4">
          <h1 className="text-2xl font-bold text-white">Øvelser</h1>
          <button
            onClick={() => setIsCreatingExercise(true)}
            className="bg-primary text-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="space-y-3">
          {sortedExercises.map(ex => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              onSelect={(exercise) => setViewingExercise(exercise)}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderActiveWorkout = () => {
    if (!activeSession) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
          <div className="bg-slate-800 p-6 rounded-full mb-4">
            <Dumbbell size={48} className="text-muted" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Ingen aktiv økt</h2>
            <p className="text-muted">Du har ikke startet en treningsøkt enda.</p>
          </div>
          <button
            onClick={handleStartSession}
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform flex items-center"
          >
            <Play size={20} className="mr-2" fill="currentColor" />
            Start ny økt
          </button>
        </div>
      );
    }

    return (
      <ActiveSessionView
        session={activeSession}
        exercises={exercises}
        history={history}
        onUpdateSession={setActiveSession}
        onFinishSession={handleFinishSession}
        onCancelSession={handleCancelSession}
        onRequestCreateExercise={() => setIsCreatingExercise(true)}
      />
    );
  };

  const renderProfile = () => (
    <ProfileView profile={profile} onUpdateProfile={setProfile} />
  );

  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <WelcomeScreen onEnter={() => setShowSplash(false)} />;
  }

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-background relative shadow-2xl font-sans overflow-hidden">
      <div className="h-full overflow-y-auto scrollbar-hide">
        {currentScreen === Screen.HOME && renderHome()}
        {currentScreen === Screen.HISTORY && renderHistory()}
        {currentScreen === Screen.EXERCISES && renderExercises()}
        {currentScreen === Screen.ACTIVE_WORKOUT && renderActiveWorkout()}
        {currentScreen === Screen.PROFILE && renderProfile()}
      </div>

      {/* Exercise Detail Modal (View/Delete) */}
      {viewingExercise && (
        <ExerciseDetailModal
          exercise={viewingExercise}
          history={history}
          onClose={() => setViewingExercise(null)}
          onDelete={handleDeleteExercise}
          onEdit={(ex) => {
            setViewingExercise(null);
            setExerciseToEdit(ex);
            setIsCreatingExercise(true);
          }}
        />
      )}

      {isCreatingExercise && (
        <ExerciseFormModal
          initialExercise={exerciseToEdit}
          onSave={handleSaveExercise}
          onClose={() => {
            setIsCreatingExercise(false);
            setExerciseToEdit(undefined);
          }}
        />
      )}

      <BottomNav
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        hasActiveWorkout={!!activeSession}
      />
    </div>
  );
}