import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import CommunityPostForm from "@/components/features/community/CommunityPostForm";
import PostCard from "@/components/features/community/PostCard";

async function addPost(formData: FormData) {
  "use server";
  
  const content = formData.get("content") as string;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!content || !user) return;

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
      author_name: profile?.alias ?? 'Anonymous'
    });

  if (error) {
    console.error("Error adding post:", error);
  } else {
    revalidatePath("/community");
  }
}

export default async function CommunityPage() {
  const supabase = await createClient();

  // Updated query to fetch posts AND their comments
  const { data: posts, error } = await supabase
    .from("community_posts")
    .select(`
      id,
      created_at,
      content,
      likes_count,
      author_name,
      comments ( id, created_at, content, author_name )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
  }

  // The rest of your beautiful UI code remains the same...
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* ... (keep all your background and header divs) ... */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
         {/* ... */}
      </div>

      <div className="relative z-0 min-h-screen w-full">
        <div className="w-full px-4 py-12">
            {/* ... (keep all your animation and header sections) ... */}
            <div className="text-center mb-12 space-y-6 max-w-6xl mx-auto">
                {/* ... */}
            </div>
            <div className="mb-12 max-w-6xl mx-auto">
                <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 animate-slide-up">
                    <CommunityPostForm addPostAction={addPost} />
                </div>
            </div>
             {/* ... (keep your guidelines section) ... */}

            <div className="space-y-6 max-w-6xl mx-auto">
                {posts && posts.length > 0 ? (
                <div className="space-y-4">
                    {posts.map((post, index) => (
                    <div
                        key={post.id}
                        className="transform transition-all duration-500 hover:scale-[1.02] animate-fade-in-sequence"
                        style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                    >
                        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                        <PostCard 
                            post={post} 
                            authorAlias={post.author_name ?? 'Anonymous'}
                        />
                        </div>
                    </div>
                    ))}
                </div>
                ) : (
                <div className="text-center py-16 animate-fade-in">
                    {/* ... (keep your empty state UI) ... */}
                </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
