"use client";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  // ---- THIS FUNCTION IS NOW FIXED ----
  const handleAnonymousLogin = async () => {
    const { error } = await supabase.auth.signInAnonymously();
    if (!error) {
      // This is the new line that fixes the redirect
      window.location.href = '/dashboard';
    } else {
      console.error("Anonymous login error:", error.message);
    }
  };
  // ------------------------------------

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Welcome to MindSpace
        </h1>
        <p className="mt-2 text-gray-600">
          Your safe space to reflect and connect.
        </p>
        <div className="flex flex-col space-y-4 pt-4">
          <Button onClick={handleGoogleLogin} variant="outline">
            Continue with Google
          </Button>
          <Button onClick={handleAnonymousLogin}>
            Continue Anonymously
          </Button>
        </div>
      </div>
    </div>
  );
}