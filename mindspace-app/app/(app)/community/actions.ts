"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addPost(formData: FormData) {
  const content = formData.get("content") as string;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!content || !user) return { error: "User not found or content is empty." };

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
    return { error: "Could not add post." };
  }

  revalidatePath("/community");
}

export async function likePost(postId: number) {
  const supabase = await createClient();

  const { data: post, error: fetchError } = await supabase
    .from('community_posts')
    .select('likes_count')
    .eq('id', postId)
    .single();

  if (fetchError) {
    console.error('Error fetching post for like:', fetchError);
    return { error: 'Could not find post.' };
  }

  const newLikes = (post.likes_count ?? 0) + 1;

  const { error: updateError } = await supabase
    .from('community_posts')
    .update({ likes_count: newLikes })
    .eq('id', postId);

  if (updateError) {
    console.error('Error updating likes:', updateError);
    return { error: 'Could not update likes.' };
  }

  return { success: true, newLikes: newLikes };
}


export async function addComment(formData: FormData) {
    const content = formData.get("content") as string;
    const postId = Number(formData.get("postId"));

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!content || !postId || !user) {
        return { error: "Invalid data." };
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('alias')
        .eq('id', user.id)
        .single();
    
    const { error } = await supabase
        .from("comments")
        .insert({
            post_id: postId,
            user_id: user.id,
            content: content,
            author_name: profile?.alias ?? 'Anonymous'
        });
    
    if (error) {
        console.error("Error adding comment:", error);
        return { error: "Could not add comment." };
    }
}