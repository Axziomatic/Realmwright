"use server";

import { redirect } from "next/navigation";
import { createSupabaseActionClient } from "@/lib/supabase/supabaseActionClient";
import { loginSchema, signupSchema } from "@/lib/validators/auth";

export async function signUp(formData: FormData): Promise<void> {
  const raw = {
    username: String(formData.get("username") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? "").trim(),
    confirmPassword: String(formData.get("confirmPassword") ?? "").trim(),
    acceptTerms: formData.get("acceptTerms") === "on",
  };

  const parsed = signupSchema.safeParse(raw);

  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid inputs";
    redirect(`/signup?error=${encodeURIComponent(msg)}`);
  }

  const supabase = await createSupabaseActionClient();

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { username: parsed.data.username } },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login");
}

export async function signIn(formData: FormData): Promise<void> {
  const raw = {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? "").trim(),
  };

  const parsed = loginSchema.safeParse(raw);

  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Ogiltiga uppgifter";
    redirect(`/login?error=${encodeURIComponent(msg)}`);
  }

  const supabase = await createSupabaseActionClient();

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/worlds");
}

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseActionClient();
  const { error } = await supabase.auth.signOut();

  redirect("/login");
}
