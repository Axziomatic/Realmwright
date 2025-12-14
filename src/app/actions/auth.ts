"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/supabaseServerClient";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabaseBrowserClient";

export async function signUp(formData: FormData): Promise<void> {
  const username = String(formData.get("username") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const confirmPassword = String(formData.get("confirmPassword") ?? "").trim();
  const acceptTerms = formData.get("acceptTerms") === "on";

  if (!acceptTerms) {
    console.error("Terms must be accepted");
    return;
  }

  if (!username || !email || !password) {
    console.error("Missing required fields");
    return;
  }

  if (password !== confirmPassword) {
    console.error("Passwords do not match");
    return;
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Detta hamnar i auth.users.user_metadata
      data: { username },
    },
  });

  if (error) {
    console.error(error.message);
    return;
  }

  redirect("/login");
}

export async function signIn(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error.message);
    return;
  }

  redirect("/worlds");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
