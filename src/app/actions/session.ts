"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabaseServerClient";

export async function getSessionUser() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
