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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Journal</h1>
        <p className="text-gray-500">A private space for your thoughts.</p>
      </div>

      <JournalForm addEntryAction={addEntry} />

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Past Entries</h2>
        {entries && entries.length > 0 ? (
          entries.map((entry) => (
            <JournalEntryCard key={entry.id} entry={entry} />
          ))
        ) : (
          <p className="text-gray-500">You haven't written any entries yet.</p>
        )}
      </div>
    </div>
  );
}