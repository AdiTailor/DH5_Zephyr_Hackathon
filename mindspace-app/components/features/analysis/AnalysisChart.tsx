"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface AnalysisChartProps {
  data: {
    date: string;
    sentiment: number;
    mood: number;
  }[];
}

export default function AnalysisChart({ data }: AnalysisChartProps) {
  return (
    <div className="w-full h-96 bg-gradient-to-br from-violet-50/30 to-purple-50/20 rounded-xl p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
          
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickLine={{ stroke: '#cbd5e1' }}
          />
          
          <YAxis 
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickLine={{ stroke: '#cbd5e1' }}
          />
          
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
            }}
            labelStyle={{ color: '#1e293b', fontWeight: 'bold' }}
          />
          
          <Area
            type="monotone"
            dataKey="mood"
            stroke="#8b5cf6"
            strokeWidth={3}
            fill="url(#moodGradient)"
            name="Mood Rating"
          />
          
          <Line
            type="monotone"
            dataKey="sentiment"
            stroke="#06b6d4"
            strokeWidth={2}
            dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
            name="Sentiment Score"
          />
        </AreaChart>
      </ResponsiveContainer>
      
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full"></div>
          <span className="text-sm text-slate-600 font-medium">Mood Rating</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
          <span className="text-sm text-slate-600 font-medium">Sentiment Score</span>
        </div>
      </div>
    </div>
  );
}
