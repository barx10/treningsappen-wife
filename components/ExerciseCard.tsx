import React from 'react';
import { ExerciseDefinition } from '../types';
import { Activity } from 'lucide-react';

interface ExerciseCardProps {
  exercise: ExerciseDefinition;
  onSelect?: (exercise: ExerciseDefinition) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect && onSelect(exercise)}
      className={`p-4 bg-surface rounded-xl border border-slate-700 flex items-center justify-between ${onSelect ? 'cursor-pointer hover:bg-slate-700 active:scale-95 transition-all' : ''}`}
    >
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-primary border border-slate-700">
          <Activity size={18} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-100">{exercise.name}</h3>
          <p className="text-xs text-muted">{exercise.muscleGroup} • {exercise.type}</p>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;