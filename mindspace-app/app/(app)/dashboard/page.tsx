import { createClient } from "@/lib/supabase/server";

import DashboardChartClient from "./DashboardChartClient";

export type MoodEntry = {
  id: string;
  created_at: string;
  mood: number;
};

interface Stats {
  total: number;
  frequentMood: number | null;
  weekly: { week: string; count: number }[];
  streak: number;
}

function getStats(entries: MoodEntry[]): Stats {
  if (!entries || entries.length === 0) return { total: 0, frequentMood: null, weekly: [], streak: 0 };
  const total = entries.length;
  // Frequent mood
  const moodCounts: { [key: number]: number } = {};
  entries.forEach((e) => { moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1; });
  const sortedMoods = Object.entries(moodCounts).sort((a, b) => (b[1] as number) - (a[1] as number));
  const frequentMood = sortedMoods.length > 0 ? Number(sortedMoods[0][0]) : null;
  // Weekly summaries (group by week)
  const weekMap: { [key: string]: MoodEntry[] } = {};
  entries.forEach((e) => {
    const d = new Date(e.created_at);
    const week = `${d.getFullYear()}-W${Math.ceil((d.getDate() + 6 - d.getDay()) / 7)}`;
    if (!weekMap[week]) weekMap[week] = [];
    weekMap[week].push(e);
  });
  const weekly = Object.entries(weekMap).map(([week, arr]) => ({ week, count: (arr as MoodEntry[]).length }));
  // Current streak (consecutive days with entries)
  const days = Array.from(new Set(entries.map((e) => new Date(e.created_at).toDateString()))).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  let streak = days.length > 0 ? 1 : 0, maxStreak = days.length > 0 ? 1 : 0;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const curr = new Date(days[i]);
    if ((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24) === 1) streak++;
    else streak = 1;
    if (streak > maxStreak) maxStreak = streak;
  }
  return { total, frequentMood, weekly, streak: maxStreak };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let entries: MoodEntry[] = [];
  if (user) {
    const { data } = await supabase
      .from("journal_entries")
      .select("id, created_at, mood")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    entries = (data as MoodEntry[]) || [];
  }
  const stats = getStats(entries);

  const moodMap: { [key: number]: { emoji: string; label: string } } = {
    1: { emoji: '😔', label: 'Awful' },
    2: { emoji: '😟', label: 'Bad' },
    3: { emoji: '😐', label: 'Okay' },
    4: { emoji: '😊', label: 'Good' },
    5: { emoji: '😄', label: 'Great' },
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Your wellness journey at a glance.</p>
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Mood Over Time</h2>
        <DashboardChartClient entries={entries} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white rounded-xl shadow p-6 mb-8">
        <div className="text-center">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-xs text-gray-500">Total Entries</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{typeof stats.frequentMood === 'number' && moodMap[stats.frequentMood] ? moodMap[stats.frequentMood].emoji : '-'}</div>
          <div className="text-xs text-gray-500">Frequent Mood</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{stats.weekly.length}</div>
          <div className="text-xs text-gray-500">Weekly Summaries</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{stats.streak}</div>
          <div className="text-xs text-gray-500">Current Streak</div>
        </div>
      </div>
    </div>
  );
}