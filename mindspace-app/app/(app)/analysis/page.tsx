import { createClient } from "@/lib/supabase/server";
import AnalysisChart from "@/components/features/analysis/AnalysisChart";
import { analyzeSentiment } from "@/lib/ai/sentiment";

export default async function AnalysisPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please log in to view your analysis.</div>;
  }

  const { data: entries, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error || !entries || entries.length === 0) {
    return (
      <div className="min-h-screen w-full relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>
        </div>

        <div className="relative z-0 min-h-screen w-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-violet-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">📊</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">No Entries to Analyze</h2>
            <p className="text-slate-600 max-w-md mx-auto">
              Start journaling to see your emotional journey and growth patterns!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const analysisResults = await analyzeSentiment(entries);

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/5 left-1/5 w-80 h-80 bg-gradient-to-br from-violet-200/30 to-purple-200/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-3/5 right-1/5 w-96 h-96 bg-gradient-to-br from-indigo-200/25 to-blue-200/25 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/3 left-4/5 w-72 h-72 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-float-slow"></div>
        </div>
      </div>

      <div className="relative z-0 min-h-screen w-full">
        <div className="w-full px-4 py-12">
          <div className="text-center mb-12 space-y-6 max-w-6xl mx-auto">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-violet-200/50 shadow-lg animate-fade-in">
                <div className="w-2 h-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-violet-700 uppercase tracking-wider">AI-Powered Analysis</span>
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse"></div>
              </div>
              
              <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-fade-in-up">
                Your Journey Insights
              </h1>
              
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up-delayed">
                Discover patterns in your emotional journey and celebrate your growth. 
                <span className="inline-flex items-center gap-1 ml-2">
                  AI-powered insights 
                  <span className="animate-bounce">🧠</span>
                </span>
              </p>
            </div>

            <div className="flex justify-center gap-12 mt-8">
              <div className="text-center group">
                <div className="text-2xl font-bold text-violet-700 group-hover:text-purple-600 transition-colors duration-300">
                  {entries.length}
                </div>
                <div className="text-sm text-slate-500 uppercase tracking-wide">Entries Analyzed</div>
              </div>
              <div className="w-px bg-violet-200"></div>
              <div className="text-center group">
                <div className="text-2xl font-bold text-violet-700 group-hover:text-indigo-600 transition-colors duration-300">
                  📈
                </div>
                <div className="text-sm text-slate-500 uppercase tracking-wide">Growth Tracking</div>
              </div>
            </div>
          </div>

          <div className="mb-12 max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border border-violet-200/50 rounded-3xl shadow-xl p-8 animate-slide-up">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg">🌟</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-800">Overall Growth Summary</h3>
                  <p className="text-slate-600 text-sm">Your emotional journey at a glance</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-violet-50/50 to-purple-50/30 rounded-xl p-6 border-l-4 border-violet-300">
                <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">
                  {analysisResults.overallSummary}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12 max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border border-violet-200/50 rounded-3xl shadow-xl p-8 animate-slide-up-delayed">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg">💝</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-800">Recent Emotional Status</h3>
                  <p className="text-slate-600 text-sm">How you've been feeling lately</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50/50 to-blue-50/30 rounded-xl p-6 border-l-4 border-indigo-300">
                <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">
                  {analysisResults.recentStatus}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12 max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border border-violet-200/50 rounded-3xl shadow-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg">📊</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-800">Emotional Timeline</h3>
                  <p className="text-slate-600 text-sm">Your mood patterns over time</p>
                </div>
              </div>
              
              <AnalysisChart data={analysisResults.chartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
