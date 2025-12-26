"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/supabaseServerClient";

async function assertNpcInWorld(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  worldId: string,
  npcId: string
) {
  const { data, error } = await supabase
    .from("npcs")
    .select("id")
    .eq("id", npcId)
    .eq("world_id", worldId)
    .single();

  if (error || !data) {
    throw new Error("Owner NPC must belong to the same world.");
  }
}

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
    throw new Error("Location must belong to the same world.");
  }
}

export async function listItems(worldId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("items")
    .select("id, name, type, rarity, summary, created_at")
    .eq("world_id", worldId)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to fetch items");
  return data ?? [];
}

const createItemSchema = z.object({
  worldId: z.string().uuid(),
  name: z.string().min(2, "Item name is too short").max(80),
  type: z.string().max(60).optional().or(z.literal("")),
  rarity: z.string().max(40).optional().or(z.literal("")),
  summary: z.string().max(500).optional().or(z.literal("")),
  description: z.string().max(5000).optional().or(z.literal("")),
  ownerNpcId: z.string().uuid().optional().or(z.literal("")),
  locationId: z.string().uuid().optional().or(z.literal("")),
});

export async function createItem(formData: FormData): Promise<void> {
  const raw = {
    worldId: String(formData.get("worldId") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    type: String(formData.get("type") ?? "").trim(),
    rarity: String(formData.get("rarity") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    ownerNpcId: String(formData.get("ownerNpcId") ?? "").trim(),
    locationId: String(formData.get("locationId") ?? "").trim(),
  };

  const parsed = createItemSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid item data";
    redirect(`/worlds/${raw.worldId}/items?error=${encodeURIComponent(msg)}`);
  }

  const supabase = await createSupabaseServerClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) redirect("/login");

  const ownerNpcId = parsed.data.ownerNpcId || null;
  const locationId = parsed.data.locationId || null;

  try {
    if (ownerNpcId)
      await assertNpcInWorld(supabase, parsed.data.worldId, ownerNpcId);
    if (locationId)
      await assertLocationInWorld(supabase, parsed.data.worldId, locationId);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid relation";
    redirect(
      `/worlds/${parsed.data.worldId}/items?error=${encodeURIComponent(msg)}`
    );
  }

  const { error } = await supabase.from("items").insert({
    world_id: parsed.data.worldId,
    name: parsed.data.name,
    type: parsed.data.type || null,
    rarity: parsed.data.rarity || null,
    summary: parsed.data.summary || null,
    description: parsed.data.description || null,
    owner_npc_id: ownerNpcId,
    location_id: locationId,
  });

  if (error) {
    redirect(
      `/worlds/${parsed.data.worldId}/items?error=${encodeURIComponent(
        error.message
      )}`
    );
  }

  revalidatePath(`/worlds/${parsed.data.worldId}/items`);
  redirect(`/worlds/${parsed.data.worldId}/items?created=1`);
}

export async function getItem(worldId: string, itemId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("items")
    .select(
      "id, world_id, name, type, rarity, summary, description, owner_npc_id, location_id, created_at, updated_at"
    )
    .eq("id", itemId)
    .eq("world_id", worldId)
    .single();

  if (error || !data) {
    const msg =
      error?.message ?? "Item not found (or you don't have access via RLS).";
    redirect(`/worlds/${worldId}/items?error=${encodeURIComponent(msg)}`);
  }

  return data;
}

const updateItemSchema = z.object({
  worldId: z.string().uuid(),
  itemId: z.string().uuid(),
  name: z.string().min(2, "Item name is too short").max(80),
  type: z.string().max(60).optional().or(z.literal("")),
  rarity: z.string().max(40).optional().or(z.literal("")),
  summary: z.string().max(500).optional().or(z.literal("")),
  description: z.string().max(5000).optional().or(z.literal("")),
  ownerNpcId: z.string().uuid().optional().nullable(),
  locationId: z.string().uuid().optional().nullable(),
});

export async function updateItem(formData: FormData): Promise<void> {
  const raw = {
    worldId: String(formData.get("worldId") ?? "").trim(),
    itemId: String(formData.get("itemId") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    type: String(formData.get("type") ?? "").trim() || "",
    rarity: String(formData.get("rarity") ?? "").trim() || "",
    summary: String(formData.get("summary") ?? "").trim() || "",
    description: String(formData.get("description") ?? "").trim() || "",
    ownerNpcId: (() => {
      const v = String(formData.get("ownerNpcId") ?? "").trim();
      return v ? v : null; // allow clearing
    })(),
    locationId: (() => {
      const v = String(formData.get("locationId") ?? "").trim();
      return v ? v : null; // allow clearing
    })(),
  };

  const parsed = updateItemSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid item data";
    redirect(
      `/worlds/${raw.worldId}/items/${raw.itemId}?error=${encodeURIComponent(
        msg
      )}`
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) redirect("/login");

  try {
    if (parsed.data.ownerNpcId)
      await assertNpcInWorld(
        supabase,
        parsed.data.worldId,
        parsed.data.ownerNpcId
      );
    if (parsed.data.locationId)
      await assertLocationInWorld(
        supabase,
        parsed.data.worldId,
        parsed.data.locationId
      );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid relation";
    redirect(
      `/worlds/${parsed.data.worldId}/items/${
        parsed.data.itemId
      }?error=${encodeURIComponent(msg)}`
    );
  }

  const { error } = await supabase
    .from("items")
    .update({
      name: parsed.data.name,
      type: parsed.data.type || null,
      rarity: parsed.data.rarity || null,
      summary: parsed.data.summary || null,
      description: parsed.data.description || null,
      owner_npc_id: parsed.data.ownerNpcId ?? null,
      location_id: parsed.data.locationId ?? null,
    })
    .eq("id", parsed.data.itemId)
    .eq("world_id", parsed.data.worldId);

  if (error) {
    redirect(
      `/worlds/${parsed.data.worldId}/items/${
        parsed.data.itemId
      }?error=${encodeURIComponent(error.message)}`
    );
  }

  revalidatePath(`/worlds/${parsed.data.worldId}/items`);
  revalidatePath(`/worlds/${parsed.data.worldId}/items/${parsed.data.itemId}`);
  redirect(
    `/worlds/${parsed.data.worldId}/items/${parsed.data.itemId}?saved=1`
  );
}

const deleteItemSchema = z.object({
  worldId: z.string().uuid(),
  itemId: z.string().uuid(),
});

export async function deleteItem(formData: FormData): Promise<void> {
  const raw = {
    worldId: String(formData.get("worldId") ?? "").trim(),
    itemId: String(formData.get("itemId") ?? "").trim(),
  };

  const parsed = deleteItemSchema.safeParse(raw);
  if (!parsed.success) redirect(`/worlds/${raw.worldId}/items`);

  const supabase = await createSupabaseServerClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) redirect("/login");

  const { error } = await supabase
    .from("items")
    .delete()
    .eq("id", parsed.data.itemId)
    .eq("world_id", parsed.data.worldId);

  if (error) {
    redirect(
      `/worlds/${parsed.data.worldId}/items/${
        parsed.data.itemId
      }?error=${encodeURIComponent(error.message)}`
    );
  }

  revalidatePath(`/worlds/${parsed.data.worldId}/items`);
  redirect(`/worlds/${parsed.data.worldId}/items?deleted=1`);
}
