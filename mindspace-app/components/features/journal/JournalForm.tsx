"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { toast } from "sonner";
import MoodSelector from "@/components/shared/MoodSelector";

export default function JournalForm({
  addEntryAction,
}: {
  addEntryAction: (formData: FormData) => Promise<void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedMood, setSelectedMood] = useState<number>(3);

  const handleAction = async (formData: FormData) => {
    formData.append('mood', selectedMood.toString());
    await addEntryAction(formData);
    formRef.current?.reset();
    toast.success("Journal entry saved!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>How are you feeling today?</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleAction} className="space-y-4">
          <Textarea
            name="content"
            placeholder="Write about your day..."
            required
            className="min-h-[120px]"
          />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <MoodSelector onMoodChange={setSelectedMood} />
            <Button type="submit" className="w-full sm:w-auto">Save Entry</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}