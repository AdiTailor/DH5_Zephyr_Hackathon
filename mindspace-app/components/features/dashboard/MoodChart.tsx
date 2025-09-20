
"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts';

interface MoodData {
    id: string;
    created_at: string;
    mood: number;
}

const moodMap: { [key: number]: { emoji: string; label: string } } = {
    1: { emoji: '😔', label: 'Awful' },
    2: { emoji: '😟', label: 'Bad' },
    3: { emoji: '😐', label: 'Okay' },
    4: { emoji: '😊', label: 'Good' },
    5: { emoji: '😄', label: 'Great' },
};

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        const mood = payload[0].payload.mood;
        const { emoji, label: moodLabel } = moodMap[mood] || {};
        return (
            <div className="p-2 bg-white border rounded-lg shadow">
                <p className="label">{`${new Date(label).toLocaleDateString()}`}</p>
                <p className="intro">{`Mood: ${emoji} ${moodLabel}`}</p>
            </div>
        );
    }

    return null;
};

export default function MoodChart({ data }: { data: MoodData[] }) {
    const chartData = data.map(entry => ({
        ...entry,
        created_at: new Date(entry.created_at).getTime(),
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="created_at"
                    type="number"
                    domain={['dataMin', 'dataMax']}
                    tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()}
                />
                <YAxis 
                    domain={[1, 5]}
                    tickFormatter={(mood) => moodMap[mood]?.label || ''}
                    width={60}
                    tick={{ dx: -10 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="mood" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
}
