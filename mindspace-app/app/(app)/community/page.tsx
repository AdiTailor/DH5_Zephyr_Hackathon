import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import CommunityPostForm from "@/components/features/community/CommunityPostForm";
import PostCard from "@/components/features/community/PostCard";

// --- SERVER ACTION MOVED HERE ---
// It is now a top-level function and gets the user data itself.
async function addPost(formData: FormData) {
  "use server";
  
  const content = formData.get("content") as string;
  const supabase = createClient();
const { data: { user } } = await (await supabase).auth.getUser();

  if (!content || !user) return;

  const { error } = await (await supabase)
    .from("community_posts")
    .insert({ content, user_id: user.id });

  if (error) {
    // You can handle the error here, e.g., return it
    console.error("Error adding post:", error);
  } else {
    revalidatePath("/community");
  }
}
// --------------------------------

export default async function CommunityPage() {
  const supabase = await createClient();

  // Fetch posts and join with profiles to get the author's alias
  const { data: posts, error } = await supabase
    .from("community_posts")
    .select(`
      id,
      created_at,
      content,
      likes_count,
      profiles ( alias )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Community Feed</h1>
        <p className="text-gray-500">Share your thoughts anonymously with the community.</p>
      </div>

      {/* The form now receives the corrected server action */}
      <CommunityPostForm addPostAction={addPost} />

      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map((post) => {
            // This is a safer way to access the joined data
            const profiles = post.profiles as { alias: string }[] | null;
            const authorAlias = profiles && Array.isArray(profiles) && profiles.length > 0
              ? profiles[0].alias ?? 'Anonymous'
              : 'Anonymous';

            return <PostCard key={post.id} post={post} authorAlias={authorAlias} />;
          })
        ) : (
          <p className="text-gray-500 text-center py-8">
            The feed is empty. Be the first to share something!
          </p>
        )}
      </div>
    </div>
  );
}