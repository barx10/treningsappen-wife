import React, { useMemo } from 'react';
import { WorkoutSession } from '../types';
import { Calendar, Clock, Dumbbell, Trash2 } from 'lucide-react';

interface WorkoutHistoryCardProps {
  session: WorkoutSession;
  onDelete?: (id: string) => void;
}

const WorkoutHistoryCard: React.FC<WorkoutHistoryCardProps> = ({ session, onDelete }) => {
  const duration = useMemo(() => {
    if (!session.endTime) return '';
    const start = new Date(session.startTime).getTime();
    const end = new Date(session.endTime).getTime();
    const diffMinutes = Math.round((end - start) / 60000);
    return `${diffMinutes}m`;
  }, [session.startTime, session.endTime]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && confirm('Er du sikker på at du vil slette denne økten fra historikken?')) {
      onDelete(session.id);
    }
  };

  const totalSets = session.exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0);
  const totalVolume = session.exercises.reduce((acc, ex) => {
    return acc + ex.sets.reduce((sAcc, set) => {
      if (!set.completed || !set.weight || !set.reps) return sAcc;
      return sAcc + (set.weight * set.reps);
    }, 0);
  }, 0);

  return (
    <div className="bg-surface rounded-xl p-4 border border-slate-700 shadow-sm relative group">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-slate-100">{session.name}</h3>
          <div className="flex items-center text-xs text-muted space-x-3 mt-1">
            <span className="flex items-center"><Calendar size={12} className="mr-1" /> {new Date(session.date).toLocaleDateString('no-NO')}</span>
            <span className="flex items-center"><Clock size={12} className="mr-1" /> {duration}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 bg-secondary/10 rounded text-secondary text-xs font-medium">
            Fullført
          </div>
          {onDelete && (
            <button
              onClick={handleDelete}
              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
              title="Slett økt"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-background p-2 rounded border border-slate-700/50">
          <div className="text-xs text-muted">Antall øvelser</div>
          <div className="font-mono font-medium text-sm">{session.exercises.length}</div>
        </div>
        <div className="bg-background p-2 rounded border border-slate-700/50">
          <div className="text-xs text-muted">Totalt volum</div>
          <div className="font-mono font-medium text-sm">{totalVolume.toLocaleString('no-NO')} kg</div>
        </div>
      </div>

      <div className="space-y-1">
        {session.exercises.slice(0, 3).map((ex) => (
          <div key={ex.id} className="text-sm text-slate-400 flex justify-between">
            <span>Øvelse ID: {ex.exerciseDefinitionId.replace('ex_', '#')}</span>
            <span className="text-muted text-xs">{ex.sets.filter(s => s.completed).length} sett</span>
          </div>
        ))}
        {session.exercises.length > 3 && (
          <div className="text-xs text-muted italic pt-1">
            + {session.exercises.length - 3} øvelser til
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutHistoryCard;