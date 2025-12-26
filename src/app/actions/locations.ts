"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/supabaseServerClient";

const createLocationSchema = z.object({
  worldId: z.string().uuid(),
  name: z.string().min(2, "Location name is too short").max(80),
  type: z.string().max(40).optional(),
  summary: z.string().max(200).optional(),
  // parent_location_id: z.string().uuid().optional(), // senare
});

export async function listLocations(worldId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("locations")
    .select("id, name, type, summary, created_at")
    .eq("world_id", worldId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch locations");
  }

  return data ?? [];
}

export async function createLocation(formData: FormData): Promise<void> {
  const raw = {
    worldId: String(formData.get("worldId") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    type: String(formData.get("type") ?? "").trim() || undefined,
    summary: String(formData.get("summary") ?? "").trim() || undefined,
  };

  const parsed = createLocationSchema.safeParse(raw);

  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid location data";
    redirect(
      `/worlds/${raw.worldId}/locations?error=${encodeURIComponent(msg)}`
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect("/login");
  }

  const { error } = await supabase.from("locations").insert({
    world_id: parsed.data.worldId,
    name: parsed.data.name,
    type: parsed.data.type,
    summary: parsed.data.summary,
  });

  if (error) {
    redirect(
      `/worlds/${parsed.data.worldId}/locations?error=${encodeURIComponent(
        error.message
      )}`
    );
  }

  revalidatePath(`/worlds/${parsed.data.worldId}/locations`);
  redirect(`/worlds/${parsed.data.worldId}/locations?created=1`);
}

const updateLocationSchema = z.object({
  worldId: z.string().uuid(),
  locationId: z.string().uuid(),
  name: z.string().min(2, "Location name is too short").max(80),
  type: z.string().max(40).optional(),
  summary: z.string().max(200).optional(),
  description: z.string().max(5000).optional(),
});

export async function getLocation(worldId: string, locationId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("locations")
    .select(
      "id, world_id, name, type, summary, description, created_at, updated_at"
    )
    .eq("id", locationId)
    .eq("world_id", worldId)
    .single();

  if (error || !data) {
    const msg =
      error?.message ??
      "Location not found (or you don't have access via RLS).";

    redirect(`/worlds/${worldId}/locations?error=${encodeURIComponent(msg)}`);
  }

  return data;
}

export async function updateLocation(formData: FormData): Promise<void> {
  const raw = {
    worldId: String(formData.get("worldId") ?? "").trim(),
    locationId: String(formData.get("locationId") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    type: String(formData.get("type") ?? "").trim() || undefined,
    summary: String(formData.get("summary") ?? "").trim() || undefined,
    description: String(formData.get("description") ?? "").trim() || undefined,
  };

  const parsed = updateLocationSchema.safeParse(raw);

  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid location data";
    redirect(
      `/worlds/${raw.worldId}/locations/${
        raw.locationId
      }?error=${encodeURIComponent(msg)}`
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) redirect("/login");

  const { error } = await supabase
    .from("locations")
    .update({
      name: parsed.data.name,
      type: parsed.data.type,
      summary: parsed.data.summary,
      description: parsed.data.description,
    })
    .eq("id", parsed.data.locationId)
    .eq("world_id", parsed.data.worldId);

  if (error) {
    redirect(
      `/worlds/${parsed.data.worldId}/locations/${
        parsed.data.locationId
      }?error=${encodeURIComponent(error.message)}`
    );
  }

  revalidatePath(`/worlds/${parsed.data.worldId}/locations`);
  revalidatePath(
    `/worlds/${parsed.data.worldId}/locations/${parsed.data.locationId}`
  );

  redirect(
    `/worlds/${parsed.data.worldId}/locations/${parsed.data.locationId}?saved=1`
  );
}

const deleteLocationSchema = z.object({
  worldId: z.string().uuid(),
  locationId: z.string().uuid(),
});

export async function deleteLocation(formData: FormData): Promise<void> {
  const raw = {
    worldId: String(formData.get("worldId") ?? "").trim(),
    locationId: String(formData.get("locationId") ?? "").trim(),
  };

  const parsed = deleteLocationSchema.safeParse(raw);

  if (!parsed.success) {
    redirect(`/worlds/${raw.worldId}/locations`);
  }

  const supabase = await createSupabaseServerClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) redirect("/login");

  const { error } = await supabase
    .from("locations")
    .delete()
    .eq("id", parsed.data.locationId)
    .eq("world_id", parsed.data.worldId);

  if (error) {
    redirect(
      `/worlds/${parsed.data.worldId}/locations/${
        parsed.data.locationId
      }?error=${encodeURIComponent(error.message)}`
    );
  }

  revalidatePath(`/worlds/${parsed.data.worldId}/locations`);
  redirect(`/worlds/${parsed.data.worldId}/locations?deleted=1`);
}
