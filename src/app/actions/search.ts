"use server";

import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/supabaseServerClient";

const schema = z.object({
  worldId: z.string().uuid(),
  query: z.string().trim().min(1).max(80),
});

export type SearchResult = {
  type: "location" | "npc" | "item" | "god";
  id: string;
  title: string;
  subtitle?: string | null;
  href: string;
};

function makeRank(title: string, q: string) {
  const t = (title ?? "").toLowerCase();
  const s = q.toLowerCase();
  if (!t) return 999;
  if (t === s) return 0;
  if (t.startsWith(s)) return 1;
  if (t.includes(s)) return 2;
  return 50;
}

export async function globalSearch(
  worldId: string,
  query: string
): Promise<SearchResult[]> {
  const parsed = schema.safeParse({ worldId, query });
  if (!parsed.success) return [];

  const supabase = await createSupabaseServerClient();
  const q = parsed.data.query;

  // Locations
  const locationsPromise = supabase
    .from("locations")
    .select("id, name, type, summary")
    .eq("world_id", parsed.data.worldId)
    .or(`name.ilike.%${q}%,summary.ilike.%${q}%,description.ilike.%${q}%`)
    .limit(6);

  // NPCs
  const npcsPromise = supabase
    .from("npcs")
    .select("id, name, role, summary")
    .eq("world_id", parsed.data.worldId)
    .or(
      `name.ilike.%${q}%,role.ilike.%${q}%,summary.ilike.%${q}%,description.ilike.%${q}%`
    )
    .limit(6);

  // Items
  const itemsPromise = supabase
    .from("items")
    .select("id, name, type, summary")
    .eq("world_id", parsed.data.worldId)
    .or(
      `name.ilike.%${q}%,type.ilike.%${q}%,summary.ilike.%${q}%,description.ilike.%${q}%`
    )
    .limit(6);

  // Gods
  const godsPromise = supabase
    .from("gods")
    .select("id, name, domain, summary")
    .eq("world_id", parsed.data.worldId)
    .or(
      `name.ilike.%${q}%,domain.ilike.%${q}%,summary.ilike.%${q}%,description.ilike.%${q}%`
    )
    .limit(6);

  const [locations, npcs, items, gods] = await Promise.all([
    locationsPromise,
    npcsPromise,
    itemsPromise,
    godsPromise,
  ]);

  // If a table doesn't exist yet or columns differ, Supabase returns an error.
  // For MVP we just ignore that source.
  const results: SearchResult[] = [];

  if (!locations.error && locations.data) {
    for (const l of locations.data) {
      results.push({
        type: "location",
        id: l.id,
        title: l.name,
        subtitle: l.summary ?? l.type ?? null,
        href: `/worlds/${parsed.data.worldId}/locations/${l.id}`,
      });
    }
  }

  if (!npcs.error && npcs.data) {
    for (const n of npcs.data) {
      results.push({
        type: "npc",
        id: n.id,
        title: n.name,
        subtitle: n.summary ?? n.role ?? null,
        href: `/worlds/${parsed.data.worldId}/npcs/${n.id}`,
      });
    }
  }

  if (!items.error && items.data) {
    for (const it of items.data) {
      results.push({
        type: "item",
        id: it.id,
        title: it.name,
        subtitle: it.summary ?? it.type ?? null,
        href: `/worlds/${parsed.data.worldId}/items/${it.id}`,
      });
    }
  }

  if (!gods.error && gods.data) {
    for (const g of gods.data) {
      results.push({
        type: "god",
        id: g.id,
        title: g.name,
        subtitle: g.summary ?? g.domain ?? null,
        href: `/worlds/${parsed.data.worldId}/gods/${g.id}`,
      });
    }
  }

  // Rank + limit
  results.sort((a, b) => {
    const ra = makeRank(a.title, q);
    const rb = makeRank(b.title, q);
    if (ra !== rb) return ra - rb;
    return a.title.localeCompare(b.title);
  });

  return results.slice(0, 20);
}
