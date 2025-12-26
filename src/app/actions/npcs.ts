"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/supabaseServerClient";

async function assertLocationInWorld(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  worldId: string,
  locationId: string
) {
  const { data, error } = await supabase
    .from("locations")
    .select("id")
    .eq("id", locationId)
    .eq("world_id", worldId)
    .single();

  if (error || !data) {
    throw new Error("Primary location must belong to the same world.");
  }
}

export async function listNpcs(worldId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("npcs")
    .select("id, name, role, summary, primary_location_id, created_at")
    .eq("world_id", worldId)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to fetch NPCs");
  return data ?? [];
}

const createNpcSchema = z.object({
  worldId: z.string().uuid(),
  name: z.string().min(2, "NPC name is too short").max(80),
  role: z.string().max(120).optional().or(z.literal("")),
  summary: z.string().max(500).optional().or(z.literal("")),
  description: z.string().max(5000).optional().or(z.literal("")),
  alignment: z.string().max(60).optional().or(z.literal("")),
  primaryLocationId: z.string().uuid().optional().or(z.literal("")),
});

export async function createNpc(formData: FormData): Promise<void> {
  const raw = {
    worldId: String(formData.get("worldId") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    alignment: String(formData.get("alignment") ?? "").trim(),
    primaryLocationId: String(formData.get("primaryLocationId") ?? "").trim(),
  };

  const parsed = createNpcSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid NPC data";
    redirect(`/worlds/${raw.worldId}/npcs?error=${encodeURIComponent(msg)}`);
  }

  const supabase = await createSupabaseServerClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) redirect("/login");

  const primaryLocationId = parsed.data.primaryLocationId || null;

  try {
    if (primaryLocationId) {
      await assertLocationInWorld(
        supabase,
        parsed.data.worldId,
        primaryLocationId
      );
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid primary location";
    redirect(
      `/worlds/${parsed.data.worldId}/npcs?error=${encodeURIComponent(msg)}`
    );
  }

  const { error } = await supabase.from("npcs").insert({
    world_id: parsed.data.worldId,
    name: parsed.data.name,
    role: parsed.data.role || null,
    summary: parsed.data.summary || null,
    description: parsed.data.description || null,
    alignment: parsed.data.alignment || null,
    primary_location_id: primaryLocationId,
  });

  if (error) {
    redirect(
      `/worlds/${parsed.data.worldId}/npcs?error=${encodeURIComponent(
        error.message
      )}`
    );
  }

  revalidatePath(`/worlds/${parsed.data.worldId}/npcs`);
  redirect(`/worlds/${parsed.data.worldId}/npcs?created=1`);
}

const getNpcSchema = z.object({
  worldId: z.string().uuid(),
  npcId: z.string().uuid(),
});

export async function getNpc(worldId: string, npcId: string) {
  const parsed = getNpcSchema.safeParse({ worldId, npcId });
  if (!parsed.success) redirect(`/worlds/${worldId}/npcs`);

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("npcs")
    .select(
      "id, world_id, name, role, summary, description, alignment, primary_location_id, created_at, updated_at"
    )
    .eq("id", parsed.data.npcId)
    .eq("world_id", parsed.data.worldId)
    .single();

  if (error || !data) {
    const msg =
      error?.message ?? "NPC not found (or you don't have access via RLS).";
    redirect(`/worlds/${worldId}/npcs?error=${encodeURIComponent(msg)}`);
  }

  return data;
}

const updateNpcSchema = z.object({
  worldId: z.string().uuid(),
  npcId: z.string().uuid(),
  name: z.string().min(2, "NPC name is too short").max(80),
  role: z.string().max(120).optional().or(z.literal("")),
  summary: z.string().max(500).optional().or(z.literal("")),
  description: z.string().max(5000).optional().or(z.literal("")),
  alignment: z.string().max(60).optional().or(z.literal("")),
  primaryLocationId: z.string().uuid().optional().or(z.literal("")),
});

export async function updateNpc(formData: FormData): Promise<void> {
  const raw = {
    worldId: String(formData.get("worldId") ?? "").trim(),
    npcId: String(formData.get("npcId") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    alignment: String(formData.get("alignment") ?? "").trim(),
    primaryLocationId: String(formData.get("primaryLocationId") ?? "").trim(),
  };

  const parsed = updateNpcSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid NPC data";
    redirect(
      `/worlds/${raw.worldId}/npcs/${raw.npcId}?error=${encodeURIComponent(
        msg
      )}`
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) redirect("/login");

  const primaryLocationId = parsed.data.primaryLocationId || null;

  try {
    if (primaryLocationId) {
      await assertLocationInWorld(
        supabase,
        parsed.data.worldId,
        primaryLocationId
      );
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid primary location";
    redirect(
      `/worlds/${parsed.data.worldId}/npcs/${
        parsed.data.npcId
      }?error=${encodeURIComponent(msg)}`
    );
  }

  const { error } = await supabase
    .from("npcs")
    .update({
      name: parsed.data.name,
      role: parsed.data.role || null,
      summary: parsed.data.summary || null,
      description: parsed.data.description || null,
      alignment: parsed.data.alignment || null,
      primary_location_id: primaryLocationId,
    })
    .eq("id", parsed.data.npcId)
    .eq("world_id", parsed.data.worldId);

  if (error) {
    redirect(
      `/worlds/${parsed.data.worldId}/npcs/${
        parsed.data.npcId
      }?error=${encodeURIComponent(error.message)}`
    );
  }

  revalidatePath(`/worlds/${parsed.data.worldId}/npcs`);
  revalidatePath(`/worlds/${parsed.data.worldId}/npcs/${parsed.data.npcId}`);
  redirect(`/worlds/${parsed.data.worldId}/npcs/${parsed.data.npcId}?saved=1`);
}

const deleteNpcSchema = z.object({
  worldId: z.string().uuid(),
  npcId: z.string().uuid(),
});

export async function deleteNpc(formData: FormData): Promise<void> {
  const raw = {
    worldId: String(formData.get("worldId") ?? "").trim(),
    npcId: String(formData.get("npcId") ?? "").trim(),
  };

  const parsed = deleteNpcSchema.safeParse(raw);
  if (!parsed.success) redirect(`/worlds/${raw.worldId}/npcs`);

  const supabase = await createSupabaseServerClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) redirect("/login");

  const { error } = await supabase
    .from("npcs")
    .delete()
    .eq("id", parsed.data.npcId)
    .eq("world_id", parsed.data.worldId);

  if (error) {
    redirect(
      `/worlds/${parsed.data.worldId}/npcs/${
        parsed.data.npcId
      }?error=${encodeURIComponent(error.message)}`
    );
  }

  revalidatePath(`/worlds/${parsed.data.worldId}/npcs`);
  redirect(`/worlds/${parsed.data.worldId}/npcs?deleted=1`);
}
