import { createSupabaseServerClient } from "@/lib/supabase/supabaseServerClient";

async function countByWorld(table: string, worldId: string): Promise<number> {
  const supabase = await createSupabaseServerClient();

  const { count, error } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true })
    .eq("world_id", worldId);

  if (error) {
    throw new Error(`Failed to count ${table}: ${error.message}`);
  }

  return count ?? 0;
}

export async function getWorldDashboardCounts(worldId: string) {
  const [locations, npcs, items, gods] = await Promise.all([
    countByWorld("locations", worldId),
    countByWorld("npcs", worldId),
    countByWorld("items", worldId),
    countByWorld("gods", worldId),
  ]);

  return {
    locations,
    npcs,
    items,
    gods,
  };
}
