import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import CommunityPostForm from "@/components/features/community/CommunityPostForm";
import PostCard from "@/components/features/community/PostCard";

// --- SERVER ACTION (unchanged) ---
async function addPost(formData: FormData) {
  "use server";
  
  const content = formData.get("content") as string;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!content || !user) return;

  // Get user profile to check if they have an alias (logged-in user) or are anonymous
  const { data: profile } = await supabase
    .from('profiles')
    .select('alias')
    .eq('id', user.id)
    .single();

  const { error } = await supabase
    .from("community_posts")
    .insert({ 
      content, 
      user_id: user.id,
      author_name: profile?.alias ?? 'Anonymous', // Store author name directly
      // Store whether this was posted anonymously or not
      is_anonymous: !profile?.alias || profile.alias.startsWith('Anonymous') || profile.alias === 'Anonymous'
    });

  if (error) {
    console.error("Error adding post:", error);
  } else {
    revalidatePath("/community");
  }
}

export default async function CommunityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get user profile to determine if they're anonymous or logged in
  const { data: profile } = await supabase
    .from('profiles')
    .select('alias')
    .eq('id', user?.id)
    .single();

  const isAnonymousUser = !profile?.alias || profile.alias.startsWith('Anonymous') || profile.alias === 'Anonymous';

  // Updated query to fetch posts AND their comments (no likes_count)
  const { data: posts, error } = await supabase
    .from("community_posts")
    .select(`
      id,
      created_at,
      content,
      author_name,
      is_anonymous,
      comments ( id, created_at, content, author_name )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Fixed Background Only */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
        
        {/* Enhanced Floating Background Elements - Full Coverage */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/6 left-1/6 w-96 h-96 bg-gradient-to-br from-blue-200/40 to-purple-200/40 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-2/3 right-1/6 w-[36rem] h-[36rem] bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-4/5 w-80 h-80 bg-gradient-to-br from-emerald-200/35 to-teal-200/35 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute top-1/12 right-1/12 w-64 h-64 bg-gradient-to-br from-pink-200/25 to-rose-200/25 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/6 left-1/12 w-72 h-72 bg-gradient-to-br from-violet-200/30 to-purple-200/30 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute top-1/3 left-1/2 w-80 h-80 bg-gradient-to-br from-cyan-200/25 to-blue-200/25 rounded-full blur-3xl animate-float"></div>
        </div>
      </div>

      {/* Scrollable Content Container */}
      <div className="relative z-0 min-h-screen w-full">
        <div className="w-full px-4 py-12">
          {/* Scrollable Animations - positioned relatively and lower */}
          <div className="relative max-w-6xl mx-auto mb-12">
            {/* Top Left Pen Drawing Animation - Now scrolls with content */}
            <div className="absolute top-16 left-8 w-20 h-20 pointer-events-none z-10">
              <div className="pen-drawing">
                <svg width="80" height="80" viewBox="0 0 80 80" className="drawing-svg">
                  <defs>
                    <linearGradient id="penGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff9500"/>
                      <stop offset="50%" stopColor="#ff6b6b"/>
                      <stop offset="100%" stopColor="#4ecdc4"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Infinity path that gets drawn like a pen */}
                  <path 
                    className="pen-path" 
                    fill="none" 
                    stroke="url(#penGradient)" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    d="M25,40 C25,30 35,30 40,40 C45,50 55,50 55,40 C55,30 45,30 40,40 C35,50 25,50 25,40 Z"
                  />
                  
                  {/* Starting dot */}
                  <circle 
                    className="pen-dot" 
                    cx="25" 
                    cy="40" 
                    r="2" 
                    fill="url(#penGradient)"
                  />
                </svg>
              </div>
            </div>

            {/* Top Right Neon Sign - Now scrolls with content */}
            <div className="absolute top-16 right-8 pointer-events-none z-10">
              <div className="neon-sign-container">
                <div className="neon-sign-static">
                  <div className="neon-text">Your Journey</div>
                  <div className="neon-text neon-text-bottom">is Ours</div>
                  <div className="neon-glow-static"></div>
                  <div className="neon-flicker-static"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Header Section - Centered but full width background */}
          <div className="text-center mb-12 space-y-6 max-w-6xl mx-auto">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 shadow-lg animate-fade-in">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-600 uppercase tracking-wider">Community Hub</span>
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
              </div>
              
              <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent animate-fade-in-up">
                Community Feed
              </h1>
              
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up-delayed">
                Share your thoughts {isAnonymousUser ? 'anonymously' : ''} with our supportive community. 
                <span className="inline-flex items-center gap-1 ml-2">
                  Every voice matters 
                  <span className="animate-bounce">💙</span>
                </span>
              </p>
            </div>

            {/* Updated Stats Bar */}
            <div className="flex justify-center gap-12 mt-8">
              <div className="text-center group">
                <div className="text-2xl font-bold text-slate-700 group-hover:text-blue-600 transition-colors duration-300">
                  {posts?.length || 0}
                </div>
                <div className="text-sm text-slate-500 uppercase tracking-wide">Active Posts</div>
              </div>
              <div className="w-px bg-slate-200"></div>
              <div className="text-center group">
                <div className="text-2xl font-bold text-slate-700 group-hover:text-purple-600 transition-colors duration-300">
                  🌟
                </div>
                <div className="text-sm text-slate-500 uppercase tracking-wide">Safe Space</div>
              </div>
            </div>
          </div>

          {/* Wider Post Form Section */}
          <div className="mb-12 max-w-6xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 animate-slide-up">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg">✨</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">
                    {isAnonymousUser ? 'Share Anonymously' : 'Share Your Thoughts'}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {isAnonymousUser 
                      ? 'Your identity is protected - share freely and safely'
                      : 'Your story might be exactly what someone needs to hear'
                    }
                  </p>
                </div>
              </div>
              
              <CommunityPostForm 
                addPostAction={addPost} 
              />
            </div>
          </div>

          {/* Wider Community Guidelines */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 mb-8 animate-slide-up-delayed max-w-6xl mx-auto">
            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <span className="text-blue-500">🤝</span>
              Community Guidelines
            </h4>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="inline-flex items-center gap-2 bg-white/60 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Be supportive and kind
              </span>
              <span className="inline-flex items-center gap-2 bg-white/60 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Respect privacy
              </span>
              <span className="inline-flex items-center gap-2 bg-white/60 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                Share thoughtfully
              </span>
            </div>
          </div>

          {/* Wider Posts Section */}
          <div className="space-y-6 max-w-6xl mx-auto">
            {posts && posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post, index) => {
                  // Use stored author_name or fallback to Anonymous
                  const displayName = post.author_name ?? 'Anonymous';
                  const isAnonymousPost = post.is_anonymous;

                  return (
                    <div
                      key={post.id}
                      className="transform transition-all duration-500 hover:scale-[1.02] animate-fade-in-sequence"
                      style={{ 
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: 'both'
                      }}
                    >
                      <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                        <PostCard 
                          post={post} 
                          authorAlias={displayName}
                          isAnonymous={isAnonymousPost}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 animate-fade-in">
                <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl p-12 shadow-lg">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <span className="text-3xl">💬</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Be the First to Share!</h3>
                  <p className="text-slate-600 max-w-md mx-auto">
                    The community is waiting for your story. Share something that might help or inspire others.
                  </p>
                  <div className="flex justify-center gap-2 mt-6">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
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
