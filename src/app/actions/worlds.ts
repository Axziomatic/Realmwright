"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/supabaseServerClient";

const createWorldSchema = z.object({
  name: z.string().min(2, "World name is too short").max(50),
  summary: z.string().max(200).optional(),
});

export async function listWorlds() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("worlds")
    .select("id, name, slug, summary, is_private, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch worlds");
  }

  return data;
}

export async function getWorld(worldId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("worlds")
    .select("id, name, slug, summary, description, is_private")
    .eq("id", worldId)
    .single();

  if (error || !data) {
    redirect("/worlds");
  }

  return data;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createWorld(formData: FormData): Promise<void> {
  const raw = {
    name: String(formData.get("name") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim() || undefined,
  };

  const parsed = createWorldSchema.safeParse(raw);

  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid world data";
    redirect(`/worlds?error=${encodeURIComponent(msg)}`);
  }

  const supabase = await createSupabaseServerClient();

  const slug = slugify(parsed.data.name);

  const { error } = await supabase.from("wrolds").insert({
    name: parsed.data.name,
    summary: parsed.data.summary,
    slug,
  });
  if (error) {
    redirect(`/worlds?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/worlds");
}
