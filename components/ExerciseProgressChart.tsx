import React, { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { WorkoutSession } from '../types';

interface ExerciseProgressChartProps {
    exerciseId: string;
    history: WorkoutSession[];
}

const ExerciseProgressChart: React.FC<ExerciseProgressChartProps> = ({ exerciseId, history }) => {
    const data = useMemo(() => {
        // Filter sessions that contain this exercise
        const sessionsWithExercise = history.filter(session =>
            session.exercises.some(e => e.exerciseDefinitionId === exerciseId)
        );

        // Sort by date ascending
        sessionsWithExercise.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Map to data points
        return sessionsWithExercise.map(session => {
            const exerciseData = session.exercises.find(e => e.exerciseDefinitionId === exerciseId);
            if (!exerciseData) return null;

            // Calculate Max Weight for this session
            const maxWeight = Math.max(...exerciseData.sets.map(s => s.weight || 0));

            // Calculate Total Volume for this session
            // const volume = exerciseData.sets.reduce((acc, s) => acc + (s.weight || 0) * (s.reps || 0), 0);

            return {
                date: new Date(session.date).toLocaleDateString('no-NO', { day: '2-digit', month: '2-digit' }),
                weight: maxWeight,
                // volume: volume
            };
        }).filter(Boolean); // Remove nulls
    }, [history, exerciseId]);

    if (data.length < 2) {
        return (
            <div className="h-40 flex items-center justify-center text-muted text-sm italic border border-dashed border-slate-700 rounded-xl bg-slate-800/50">
                Trenger minst 2 økter for å vise graf
            </div>
        );
    }

    return (
        <div className="w-full h-64 bg-slate-900/50 rounded-xl border border-slate-700 p-2">
            <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-2 ml-2">Fremgang (Tyngste løft)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="#94a3b8"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}kg`}
                        domain={['dataMin - 5', 'dataMax + 5']}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                        itemStyle={{ color: '#f8fafc' }}
                        labelStyle={{ color: '#94a3b8', marginBottom: '0.5rem' }}
                        formatter={(value: number) => [`${value} kg`, 'Tyngste løft']}
                    />
                    <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#fff' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ExerciseProgressChart;
