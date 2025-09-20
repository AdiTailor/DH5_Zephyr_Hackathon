import { createClient } from "@/lib/supabase/server";
import JournalForm from "@/components/features/journal/JournalForm";
import JournalEntryCard from "@/components/features/journal/JournalEntryCard";
import { revalidatePath } from "next/cache";

export default async function JournalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: entries, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  async function addEntry(formData: FormData) {
    "use server";
    const content = formData.get("content") as string;
    const mood = formData.get("mood") as string;

    if (!content || !mood || !user) return;

    const supabase = await createClient();
    const { error } = await supabase
      .from("journal_entries")
      .insert({ content, mood: parseInt(mood), user_id: user.id });

    if (!error) {
      revalidatePath("/journal");
    }
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Journal-themed Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>
        
        {/* Writing-themed Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/5 left-1/5 w-80 h-80 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-3/5 right-1/5 w-96 h-96 bg-gradient-to-br from-green-200/25 to-lime-200/25 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/3 left-4/5 w-72 h-72 bg-gradient-to-br from-cyan-200/30 to-sky-200/30 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-1/4 left-1/6 w-88 h-88 bg-gradient-to-br from-mint-200/20 to-emerald-200/20 rounded-full blur-3xl animate-float"></div>
        </div>
      </div>

      {/* Scrollable Content Container */}
      <div className="relative z-0 min-h-screen w-full">
        <div className="w-full px-4 py-12">
          {/* Writing Animations - positioned relatively and scroll with content */}
          <div className="relative max-w-6xl mx-auto mb-12">
            {/* Top Left Animated Quill Pen */}
            <div className="absolute top-16 left-8 w-24 h-24 pointer-events-none z-10">
              <div className="quill-animation">
                <svg width="96" height="96" viewBox="0 0 96 96" className="quill-svg">
                  <defs>
                    <linearGradient id="quillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#059669"/>
                      <stop offset="50%" stopColor="#0d9488"/>
                      <stop offset="100%" stopColor="#0891b2"/>
                    </linearGradient>
                    <linearGradient id="inkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1f2937"/>
                      <stop offset="100%" stopColor="#374151"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Quill feather */}
                  <path 
                    className="quill-feather" 
                    fill="url(#quillGradient)" 
                    d="M30,20 Q35,15 45,20 Q50,25 48,35 L46,50 Q45,55 40,52 L35,45 Q32,40 30,35 Z"
                  />
                  
                  {/* Quill tip */}
                  <path 
                    className="quill-tip" 
                    fill="url(#inkGradient)" 
                    d="M40,52 L42,60 Q41,65 38,62 L36,58 Q37,54 40,52"
                  />
                  
                  {/* Animated ink drops */}
                  <circle className="ink-drop ink-drop-1" cx="42" cy="60" r="1" fill="url(#inkGradient)"/>
                  <circle className="ink-drop ink-drop-2" cx="44" cy="65" r="0.8" fill="url(#inkGradient)"/>
                  <circle className="ink-drop ink-drop-3" cx="40" cy="68" r="0.6" fill="url(#inkGradient)"/>
                </svg>
              </div>
            </div>

            {/* Top Right Floating Words Animation */}
            <div className="absolute top-16 right-8 w-32 h-24 pointer-events-none z-10">
              <div className="floating-words">
                <div className="word word-1">Dream</div>
                <div className="word word-2">Create</div>
                <div className="word word-3">Inspire</div>
                <div className="word word-4">Reflect</div>
              </div>
            </div>

            {/* Bottom Left Paper Airplane */}
            <div className="absolute top-32 left-20 w-16 h-16 pointer-events-none z-10">
              <div className="paper-plane">
                <svg width="64" height="64" viewBox="0 0 64 64" className="plane-svg">
                  <defs>
                    <linearGradient id="planeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981"/>
                      <stop offset="100%" stopColor="#06b6d4"/>
                    </linearGradient>
                  </defs>
                  <path 
                    className="plane-path" 
                    fill="url(#planeGradient)" 
                    d="M10,32 L20,28 L35,20 L50,32 L35,44 L20,36 Z M20,28 L20,36 L30,32 Z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Header Section */}
          <div className="text-center mb-12 space-y-6 max-w-6xl mx-auto">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-emerald-200/50 shadow-lg animate-fade-in">
                <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-700 uppercase tracking-wider">Personal Journal</span>
                <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-pulse"></div>
              </div>
              
              <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent animate-fade-in-up">
                My Journal
              </h1>
              
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up-delayed">
                A private space for your thoughts, dreams, and reflections. 
                <span className="inline-flex items-center gap-1 ml-2">
                  Let your words flow 
                  <span className="animate-bounce">✍️</span>
                </span>
              </p>
            </div>

            {/* Writing Stats Bar */}
            <div className="flex justify-center gap-12 mt-8">
              <div className="text-center group">
                <div className="text-2xl font-bold text-emerald-700 group-hover:text-teal-600 transition-colors duration-300">
                  {entries?.length || 0}
                </div>
                <div className="text-sm text-slate-500 uppercase tracking-wide">Total Entries</div>
              </div>
              <div className="w-px bg-emerald-200"></div>
              <div className="text-center group">
                <div className="text-2xl font-bold text-emerald-700 group-hover:text-cyan-600 transition-colors duration-300">
                  📝
                </div>
                <div className="text-sm text-slate-500 uppercase tracking-wide">Your Space</div>
              </div>
              <div className="w-px bg-emerald-200"></div>
              <div className="text-center group">
                <div className="text-2xl font-bold text-emerald-700 group-hover:text-lime-600 transition-colors duration-300">
                  ∞
                </div>
                <div className="text-sm text-slate-500 uppercase tracking-wide">Possibilities</div>
              </div>
            </div>
          </div>

          {/* Journal Form Section */}
          <div className="mb-12 max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 animate-slide-up">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg">✨</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">Express Yourself</h3>
                  <p className="text-slate-600 text-sm">What's on your mind today? Let your thoughts flow freely</p>
                </div>
              </div>
              
              <JournalForm addEntryAction={addEntry} />
            </div>
          </div>

          {/* Writing Tips */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 mb-8 animate-slide-up-delayed max-w-6xl mx-auto">
            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <span className="text-emerald-600">💡</span>
              Writing Tips
            </h4>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="inline-flex items-center gap-2 bg-white/70 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Write without judgment
              </span>
              <span className="inline-flex items-center gap-2 bg-white/70 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
                Let emotions guide you
              </span>
              <span className="inline-flex items-center gap-2 bg-white/70 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                Celebrate small moments
              </span>
            </div>
          </div>

          {/* Past Entries Section */}
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-semibold text-slate-800">Past Entries</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-emerald-200 to-transparent"></div>
              <span className="text-sm text-slate-500 bg-white/60 px-3 py-1 rounded-full">
                {entries?.length || 0} memories captured
              </span>
            </div>

            {entries && entries.length > 0 ? (
              <div className="space-y-4">
                {entries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="transform transition-all duration-500 hover:scale-[1.02] animate-fade-in-sequence"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <JournalEntryCard entry={entry} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 animate-fade-in">
                <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-3xl p-12 shadow-lg">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <span className="text-3xl">📓</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Start Your Writing Journey!</h3>
                  <p className="text-slate-600 max-w-md mx-auto">
                    Your first entry awaits. Share your thoughts, dreams, or simply how you're feeling today.
                  </p>
                  <div className="flex justify-center gap-2 mt-6">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}