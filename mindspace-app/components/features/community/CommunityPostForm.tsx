"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useRef } from "react";
import { toast } from "sonner";

export default function CommunityPostForm({
  addPostAction,
}: {
  addPostAction: (formData: FormData) => Promise<void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleAction = async (formData: FormData) => {
    await addPostAction(formData);
    formRef.current?.reset();
    toast.success("Your thought has been shared!");
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form ref={formRef} action={handleAction} className="space-y-4">
          <Textarea
            name="content"
            placeholder="Share something positive or a challenge you're facing..."
            required
            className="min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button type="submit">Share</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}