import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/shared/Navbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('alias')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} alias={profile?.alias ?? 'User'} />
      <main className="container mx-auto max-w-5xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}