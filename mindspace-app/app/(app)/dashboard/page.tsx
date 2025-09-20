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
  
  // Weekly summaries
  const weekMap: { [key: string]: MoodEntry[] } = {};
  entries.forEach((e) => {
    const d = new Date(e.created_at);
    const week = `${d.getFullYear()}-W${Math.ceil((d.getDate() + 6 - d.getDay()) / 7)}`;
    if (!weekMap[week]) weekMap[week] = [];
    weekMap[week].push(e);
  });
  const weekly = Object.entries(weekMap).map(([week, arr]) => ({ week, count: (arr as MoodEntry[]).length }));
  
  // Current streak
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

// Mood-based inspirational commands
function getMoodMessage(averageMood: number, frequentMood: number | null): { message: string; emoji: string; gradient: string } {
  if (averageMood <= 1.5) {
    return {
      message: "Stars shine the brightest in the dark ✨",
      emoji: "🌟",
      gradient: "from-purple-600 to-blue-600"
    };
  } else if (averageMood <= 2.5) {
    return {
      message: "Every sunset brings the promise of a new dawn 🌅",
      emoji: "🌈",
      gradient: "from-orange-500 to-pink-500"
    };
  } else if (averageMood <= 3.5) {
    return {
      message: "Progress, not perfection. You're doing great! 💪",
      emoji: "🌱",
      gradient: "from-green-500 to-teal-500"
    };
  } else if (averageMood <= 4.5) {
    return {
      message: "Your positive energy is contagious! Keep glowing ✨",
      emoji: "🌞",
      gradient: "from-yellow-500 to-orange-500"
    };
  } else {
    return {
      message: "Carpe Diem! Seize this beautiful moment 🎉",
      emoji: "🚀",
      gradient: "from-pink-500 to-purple-600"
    };
  }
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
  
  // Calculate average mood for inspirational message
  const last5Entries = entries.length > 5 
    ? entries.slice(-5)  // Get last 5 entries
    : entries;           // Use all entries if less than 5
    
  const averageMood = last5Entries.length > 0 
    ? last5Entries.reduce((sum, entry) => sum + entry.mood, 0) / last5Entries.length 
    : 3;
  
  const moodMessage = getMoodMessage(averageMood, stats.frequentMood);

  const moodMap: { [key: number]: { emoji: string; label: string; color: string } } = {
    1: { emoji: '😔', label: 'Awful', color: 'text-red-500' },
    2: { emoji: '😟', label: 'Bad', color: 'text-orange-500' },
    3: { emoji: '😐', label: 'Okay', color: 'text-yellow-500' },
    4: { emoji: '😊', label: 'Good', color: 'text-green-500' },
    5: { emoji: '😄', label: 'Great', color: 'text-blue-500' },
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Dashboard-themed Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>
        
        {/* Dashboard-themed Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/5 left-1/5 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-3/5 right-1/5 w-96 h-96 bg-gradient-to-br from-indigo-200/25 to-purple-200/25 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/3 left-4/5 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-1/4 left-1/6 w-88 h-88 bg-gradient-to-br from-violet-200/20 to-purple-200/20 rounded-full blur-3xl animate-float"></div>
        </div>
      </div>

      {/* Scrollable Content Container */}
      <div className="relative z-0 min-h-screen w-full">
        <div className="w-full px-4 py-12">
          {/* Dashboard Animations */}
          <div className="relative max-w-6xl mx-auto mb-12">
            {/* Top Left - Analytics Charts Animation */}
            <div className="absolute top-16 left-8 w-24 h-24 pointer-events-none z-10">
              <div className="analytics-animation">
                <svg width="96" height="96" viewBox="0 0 96 96" className="analytics-svg">
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6"/>
                      <stop offset="50%" stopColor="#3b82f6"/>
                      <stop offset="100%" stopColor="#06b6d4"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Animated chart bars */}
                  <rect className="chart-bar bar-1" x="20" y="60" width="8" height="20" fill="url(#chartGradient)" rx="2"/>
                  <rect className="chart-bar bar-2" x="32" y="45" width="8" height="35" fill="url(#chartGradient)" rx="2"/>
                  <rect className="chart-bar bar-3" x="44" y="30" width="8" height="50" fill="url(#chartGradient)" rx="2"/>
                  <rect className="chart-bar bar-4" x="56" y="40" width="8" height="40" fill="url(#chartGradient)" rx="2"/>
                  <rect className="chart-bar bar-5" x="68" y="25" width="8" height="55" fill="url(#chartGradient)" rx="2"/>
                </svg>
              </div>
            </div>

            {/* Top Right - Floating Statistics */}
            <div className="absolute top-16 right-8 w-32 h-24 pointer-events-none z-10">
              <div className="floating-stats">
                <div className="stat-item stat-1">📊</div>
                <div className="stat-item stat-2">📈</div>
                <div className="stat-item stat-3">🎯</div>
                <div className="stat-item stat-4">⭐</div>
              </div>
            </div>
          </div>

          {/* Header Section */}
          <div className="text-center mb-12 space-y-6 max-w-6xl mx-auto">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-purple-200/50 shadow-lg animate-fade-in">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-purple-700 uppercase tracking-wider">Wellness Dashboard</span>
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
              </div>
              
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent animate-fade-in-up">
                Your Journey
              </h1>
              
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up-delayed">
                Track your wellness progress and celebrate every step forward. 
                <span className="inline-flex items-center gap-1 ml-2">
                  Your growth matters 
                  <span className="animate-bounce">💜</span>
                </span>
              </p>
            </div>

            {/* Motivational Message Based on Mood */}
            <div className={`bg-gradient-to-r ${moodMessage.gradient} text-white rounded-2xl p-6 mx-auto max-w-2xl animate-slide-up shadow-xl`}>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-3xl animate-bounce">{moodMessage.emoji}</span>
                <h3 className="text-xl font-semibold">Daily Inspiration</h3>
              </div>
              <p className="text-lg font-medium">{moodMessage.message}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
            <div className="bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 animate-slide-up transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-xl">📝</span>
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">{stats.total}</div>
              <div className="text-sm text-slate-500 uppercase tracking-wide font-medium">Total Entries</div>
              {stats.total > 0 && (
                <div className="mt-2 text-xs text-purple-600 font-medium">
                  🎉 Great consistency!
                </div>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 animate-slide-up transform hover:scale-105" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-xl">😊</span>
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">
                {typeof stats.frequentMood === 'number' && moodMap[stats.frequentMood] ? moodMap[stats.frequentMood].emoji : '😐'}
              </div>
              <div className="text-sm text-slate-500 uppercase tracking-wide font-medium">Frequent Mood</div>
              {typeof stats.frequentMood === 'number' && moodMap[stats.frequentMood] && (
                <div className={`mt-2 text-xs font-medium ${moodMap[stats.frequentMood].color}`}>
                  {moodMap[stats.frequentMood].label}
                </div>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 animate-slide-up transform hover:scale-105" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-xl">📊</span>
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">{stats.weekly.length}</div>
              <div className="text-sm text-slate-500 uppercase tracking-wide font-medium">Weekly Summaries</div>
              {stats.weekly.length > 0 && (
                <div className="mt-2 text-xs text-indigo-600 font-medium">
                  📈 Trending up!
                </div>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 animate-slide-up transform hover:scale-105" style={{ animationDelay: '0.3s' }}>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-xl">🔥</span>
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">{stats.streak}</div>
              <div className="text-sm text-slate-500 uppercase tracking-wide font-medium">Best Streak</div>
              {stats.streak > 1 && (
                <div className="mt-2 text-xs text-orange-600 font-medium">
                  🔥 On fire!
                </div>
              )}
            </div>
          </div>

          {/* Chart Section */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 animate-slide-up-delayed">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg">📈</span>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-800">Mood Over Time</h2>
                  <p className="text-slate-600 text-sm">Track your emotional journey and see your progress</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6">
                <DashboardChartClient entries={entries} />
              </div>
            </div>
          </div>

          {/* Insights Section */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-3xl shadow-xl p-8 animate-slide-up-delayed">
              <h3 className="text-2xl font-semibold text-slate-800 mb-6 text-center">
                Personal Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">🎯</span>
                    <h4 className="font-semibold text-slate-800">Your Progress</h4>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {stats.total === 0 
                      ? "Start your wellness journey by adding your first journal entry!"
                      : stats.total < 7
                      ? `You've made ${stats.total} entries so far. Every entry counts towards understanding yourself better!`
                      : `Amazing! You've logged ${stats.total} entries. You're building a strong foundation for self-awareness.`
                    }
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">💡</span>
                    <h4 className="font-semibold text-slate-800">Next Steps</h4>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {stats.streak === 0
                      ? "Consider starting a daily journaling habit. Even a few words can make a difference!"
                      : stats.streak < 3
                      ? "You're on a roll! Try to journal for a few more consecutive days to build momentum."
                      : `Fantastic streak of ${stats.streak} days! You're developing an excellent self-care routine.`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
