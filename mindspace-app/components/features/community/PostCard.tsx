import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';

export default function PostCard({ post, authorAlias }: { post: any, authorAlias: string }) {
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <p className="font-semibold text-gray-800">{authorAlias}</p>
          <p>{timeAgo}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
      </CardContent>
      <CardFooter>
        {/* We can add a like button here later */}
      </CardFooter>
    </Card>
  );
}
