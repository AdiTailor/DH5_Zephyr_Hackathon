"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const alias = formData.get("alias") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
        data: {
            alias: alias
        }
    }
  });

  if (error) {
    return { error: error.message };
  }

  return { message: "Confirmation email sent." };
}

// This is the new function that replaces signInWithGoogle
export async function signInAnonymously() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInAnonymously();

    if (error) {
        return { error: error.message };
    }

    redirect("/dashboard");
}