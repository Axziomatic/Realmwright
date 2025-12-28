"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/supabaseServerClient";

export async function listGods(worldId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("gods")
    .select("id, name, domain, summary, created_at")
    .eq("world_id", worldId)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to fetch gods");
  return data ?? [];
}

const createGodSchema = z.object({
  worldId: z.string().uuid(),
  name: z.string().min(2, "God name is too short").max(80),
  domain: z.string().max(80).optional().or(z.literal("")),
  alignment: z.string().max(60).optional().or(z.literal("")),
  symbol: z.string().max(120).optional().or(z.literal("")),
  summary: z.string().max(500).optional().or(z.literal("")),
  description: z.string().max(5000).optional().or(z.literal("")),
});

export async function createGod(formData: FormData): Promise<void> {
  const raw = {
    worldId: String(formData.get("worldId") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    domain: String(formData.get("domain") ?? "").trim(),
    alignment: String(formData.get("alignment") ?? "").trim(),
    symbol: String(formData.get("symbol") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
  };

  const parsed = createGodSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid god data";
    redirect(`/worlds/${raw.worldId}/gods?error=${encodeURIComponent(msg)}`);
  }

  const supabase = await createSupabaseServerClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) redirect("/login");

  const { error } = await supabase.from("gods").insert({
    world_id: parsed.data.worldId,
    name: parsed.data.name,
    domain: parsed.data.domain || null,
    alignment: parsed.data.alignment || null,
    symbol: parsed.data.symbol || null,
    summary: parsed.data.summary || null,
    description: parsed.data.description || null,
  });

  if (error) {
    redirect(
      `/worlds/${parsed.data.worldId}/gods?error=${encodeURIComponent(
        error.message
      )}`
    );
  }

  revalidatePath(`/worlds/${parsed.data.worldId}/gods`);
  redirect(`/worlds/${parsed.data.worldId}/gods?created=1`);
}

const getGodSchema = z.object({
  worldId: z.string().uuid(),
  godId: z.string().uuid(),
});

export async function getGod(worldId: string, godId: string) {
  const parsed = getGodSchema.safeParse({ worldId, godId });
  if (!parsed.success) {
    redirect(
      `/worlds/${worldId}/gods?error=${encodeURIComponent("Invalid god id")}`
    );
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("gods")
    .select(
      "id, world_id, name, domain, alignment, symbol, summary, description, created_at, updated_at"
    )
    .eq("id", godId)
    .eq("world_id", worldId)
    .single();

  if (error || !data) {
    const msg =
      error?.message ?? "God not found (or you don't have access via RLS).";
    redirect(`/worlds/${worldId}/gods?error=${encodeURIComponent(msg)}`);
  }

  return data;
}

const updateGodSchema = z.object({
  worldId: z.string().uuid(),
  godId: z.string().uuid(),
  name: z.string().min(2, "God name is too short").max(80),
  domain: z.string().max(80).optional().or(z.literal("")),
  alignment: z.string().max(60).optional().or(z.literal("")),
  symbol: z.string().max(120).optional().or(z.literal("")),
  summary: z.string().max(500).optional().or(z.literal("")),
  description: z.string().max(5000).optional().or(z.literal("")),
});

export async function updateGod(formData: FormData): Promise<void> {
  const raw = {
    worldId: String(formData.get("worldId") ?? "").trim(),
    godId: String(formData.get("godId") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    domain: String(formData.get("domain") ?? "").trim(),
    alignment: String(formData.get("alignment") ?? "").trim(),
    symbol: String(formData.get("symbol") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
  };

  const parsed = updateGodSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid god data";
    redirect(
      `/worlds/${raw.worldId}/gods/${raw.godId}?error=${encodeURIComponent(
        msg
      )}`
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) redirect("/login");

  const { error } = await supabase
    .from("gods")
    .update({
      name: parsed.data.name,
      domain: parsed.data.domain || null,
      alignment: parsed.data.alignment || null,
      symbol: parsed.data.symbol || null,
      summary: parsed.data.summary || null,
      description: parsed.data.description || null,
    })
    .eq("id", parsed.data.godId)
    .eq("world_id", parsed.data.worldId);

  if (error) {
    redirect(
      `/worlds/${parsed.data.worldId}/gods/${
        parsed.data.godId
      }?error=${encodeURIComponent(error.message)}`
    );
  }

  revalidatePath(`/worlds/${parsed.data.worldId}/gods`);
  revalidatePath(`/worlds/${parsed.data.worldId}/gods/${parsed.data.godId}`);
  redirect(`/worlds/${parsed.data.worldId}/gods/${parsed.data.godId}?saved=1`);
}

const deleteGodSchema = z.object({
  worldId: z.string().uuid(),
  godId: z.string().uuid(),
});

export async function deleteGod(formData: FormData): Promise<void> {
  const raw = {
    worldId: String(formData.get("worldId") ?? "").trim(),
    godId: String(formData.get("godId") ?? "").trim(),
  };

  const parsed = deleteGodSchema.safeParse(raw);
  if (!parsed.success) redirect(`/worlds/${raw.worldId}/gods`);

  const supabase = await createSupabaseServerClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) redirect("/login");

  const { error } = await supabase
    .from("gods")
    .delete()
    .eq("id", parsed.data.godId)
    .eq("world_id", parsed.data.worldId);

  if (error) {
    redirect(
      `/worlds/${parsed.data.worldId}/gods/${
        parsed.data.godId
      }?error=${encodeURIComponent(error.message)}`
    );
  }

  revalidatePath(`/worlds/${parsed.data.worldId}/gods`);
  redirect(`/worlds/${parsed.data.worldId}/gods?deleted=1`);
}
