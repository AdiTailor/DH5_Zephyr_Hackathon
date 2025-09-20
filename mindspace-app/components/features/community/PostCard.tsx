"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import { addComment, likePost } from "@/app/(app)/community/actions";
import { useRef, useState } from "react"; // Removed useOptimistic
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from 'next/navigation';

// Type definitions...
type Comment = { id: number; created_at: string; content: string; author_name: string; };
type Post = { id: number; created_at: string; content: string; likes_count: number; comments: Comment[]; };

export default function PostCard({ post, authorAlias }: { post: Post, authorAlias: string }) {
  const [showComments, setShowComments] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  
  // Use a simple state for likes, initialized with the server data
  const [likes, setLikes] = useState(post.likes_count ?? 0);

  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  const handleLike = async () => {
    // Call the server action and get the result
    const result = await likePost(post.id);
    
    // If successful, update the state with the new number from the server
    if (result.success) {
      setLikes(result.newLikes);
    } else {
      toast.error(result.error || "Failed to like post.");
    }
  };

  const handleCommentSubmit = async (formData: FormData) => {
    await addComment(formData);
    formRef.current?.reset();
    toast.success("Reply posted!");
    router.refresh(); // Keep router.refresh here for comments
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-none rounded-2xl">
      <CardHeader>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <p className="font-semibold text-gray-800">{authorAlias}</p>
          <p>{timeAgo}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <div className="flex items-center gap-4">
          {/* We now use a simple onClick handler */}
          <Button variant="ghost" size="sm" onClick={handleLike} className="flex items-center gap-2 text-gray-600 hover:text-red-500">
            <Heart className="w-4 h-4" />
            <span>{likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-blue-500" onClick={() => setShowComments(!showComments)}>
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments.length} Replies</span>
          </Button>
        </div>

        {/* Comments Section (remains the same) */}
        {showComments && (
          <div className="w-full pl-2 border-l-2 border-gray-200 space-y-4">
            <form action={handleCommentSubmit} ref={formRef} className="flex items-start gap-2 pt-4">
                <input type="hidden" name="postId" value={post.id} />
                <Textarea name="content" placeholder="Write a supportive reply..." required className="bg-white/80" rows={1}/>
                <Button type="submit" size="sm">Reply</Button>
            </form>
            {post.comments.length > 0 && (
                <div className="space-y-3 pt-2">
                    {post.comments.map(comment => (
                        <div key={comment.id} className="flex items-start gap-3">
                            <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs bg-gray-200 text-gray-600">
                                    {comment.author_name?.substring(0, 2).toUpperCase() || 'AN'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm w-full">
                                <p className="font-semibold text-gray-800">{comment.author_name}</p>
                                <p className="text-gray-600">{comment.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}