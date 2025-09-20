"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { Button } from "@/components/ui/button";
import { MessageCircle, Send } from "lucide-react";
import { addComment } from "@/app/(app)/community/actions";
import { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

// Type definitions...
type Comment = { id: number; created_at: string; content: string; author_name: string; };
type Post = { id: number; created_at: string; content: string; comments: Comment[]; };

export default function PostCard({ post, authorAlias }: { post: Post, authorAlias: string }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  const handleCommentSubmit = async (formData: FormData) => {
    await addComment(formData);
    formRef.current?.reset();
    setNewComment('');
    toast.success("Reply posted!");
    router.refresh();
  };

  // Determine if user is anonymous (you can adjust this logic based on your app)
  const isAnonymous = authorAlias === 'Anonymous' || authorAlias.startsWith('Anonymous');

  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {/* Enhanced User Avatar */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shadow-lg transition-transform duration-300 group-hover:scale-105 ${
              isAnonymous 
                ? 'bg-gradient-to-br from-emerald-400 to-teal-500' 
                : 'bg-gradient-to-br from-blue-400 to-purple-500'
            }`}>
              {isAnonymous ? '?' : authorAlias.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800 text-lg">{authorAlias}</span>
                {isAnonymous && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full font-medium">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    Anonymous
                  </span>
                )}
              </div>
              <span className="text-sm text-slate-500 font-medium">{timeAgo}</span>
            </div>
          </div>
          
          {/* Floating time indicator */}
          <div className="bg-slate-100/80 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-xs text-slate-600 font-medium">📅 {timeAgo}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="py-4">
        <div className="bg-gradient-to-br from-slate-50/50 to-blue-50/30 rounded-xl p-4 border-l-4 border-blue-300">
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base">{post.content}</p>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col items-start gap-6 pt-4">
        {/* Enhanced Action Bar */}
        <div className="flex items-center justify-between w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl px-4 py-2 transition-all duration-300 group/btn"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
            <span className="font-medium">
              {post.comments.length} {post.comments.length === 1 ? 'Reply' : 'Replies'}
            </span>
          </Button>
          
          {isAnonymous && (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50/80 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-xs font-medium">Safe Space</span>
            </div>
          )}
        </div>

        {/* Enhanced Comments Section */}
        {showComments && (
          <div className="w-full bg-gradient-to-br from-slate-50/50 to-blue-50/30 rounded-xl p-6 border border-slate-200/50">
            {/* Enhanced Comment Form */}
            <form action={handleCommentSubmit} ref={formRef} className="mb-6">
              <input type="hidden" name="postId" value={post.id} />
              <div className="space-y-3">
                <Textarea 
                  name="content" 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your supportive thoughts..." 
                  required 
                  className="bg-white/80 backdrop-blur-sm border-white/50 focus:border-blue-300 rounded-xl resize-none min-h-[100px] text-slate-700"
                  maxLength={300}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">
                    {newComment.length}/300 characters
                  </span>
                  <Button 
                    type="submit" 
                    size="sm"
                    disabled={!newComment.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl px-4 py-2 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Reply
                  </Button>
                </div>
              </div>
            </form>

            {/* Enhanced Comments List */}
            {post.comments.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-semibold text-slate-700">💬 Replies ({post.comments.length})</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
                </div>
                
                {post.comments.map((comment, index) => {
                  const commentIsAnonymous = comment.author_name === 'Anonymous' || comment.author_name?.startsWith('Anonymous');
                  
                  return (
                    <div key={comment.id} className="group/comment animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 hover:shadow-md transition-all duration-300">
                        <div className="flex items-start gap-3">
                          {/* Comment Avatar */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md ${
                            commentIsAnonymous
                              ? 'bg-gradient-to-br from-emerald-400 to-teal-500' 
                              : 'bg-gradient-to-br from-blue-400 to-purple-500'
                          }`}>
                            {commentIsAnonymous ? '?' : (comment.author_name?.charAt(0).toUpperCase() || 'A')}
                          </div>
                          
                          <div className="flex-1">
                            {/* Comment Header */}
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-slate-800 text-sm">
                                {comment.author_name || 'Anonymous'}
                              </span>
                              {commentIsAnonymous && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full font-medium">
                                  <span className="w-1 h-1 bg-emerald-400 rounded-full"></span>
                                  Anon
                                </span>
                              )}
                              <span className="text-xs text-slate-500">
                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                              </span>
                            </div>
                            
                            {/* Comment Content */}
                            <div className="bg-gradient-to-br from-slate-50/50 to-blue-50/20 rounded-lg p-3 border-l-3 border-blue-300">
                              <p className="text-slate-700 text-sm leading-relaxed">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-medium">No replies yet</p>
                <p className="text-xs text-slate-400 mt-1">Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
