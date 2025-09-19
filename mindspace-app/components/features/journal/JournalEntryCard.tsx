import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const moodMap: { [key: number]: { emoji: string; label: string } } = {
  1: { emoji: "😔", label: "Awful" },
  2: { emoji: "😟", label: "Bad" },
  3: { emoji: "😐", label: "Okay" },
  4: { emoji: "😊", label: "Good" },
  5: { emoji: "😄", label: "Great" },
};

export default function JournalEntryCard({ entry }: { entry: any }) {
  const { emoji, label } = moodMap[entry.mood] || moodMap[3];
  const entryDate = new Date(entry.created_at).toLocaleDateString("en-US", {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">{entryDate}</CardTitle>
          <div className="flex items-center gap-2 text-sm p-2 rounded-full bg-gray-100">
            <span className="text-2xl">{emoji}</span>
            <span className="font-medium hidden sm:block">{label}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
      </CardContent>
    </Card>
  );
}