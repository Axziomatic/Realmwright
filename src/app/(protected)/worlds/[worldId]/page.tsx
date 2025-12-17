import SelectedWorldHydrator from "@/components/worlds/SelectedWorldHydrator";
import { getWorld } from "@/app/actions/worlds";
import Link from "next/link";

type PageProps = {
  params: Promise<{ worldId: string }>;
};

export default async function WorldPage({ params }: PageProps) {
  const { worldId } = await params;

  const world = await getWorld(worldId);

  return (
    <div className="space-y-6">
      <SelectedWorldHydrator
        world={{ id: world.id, name: world.name, slug: world.slug }}
      />

      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">{world.name}</h1>
        {world.summary ? (
          <p className="text-sm opacity-80">{world.summary}</p>
        ) : null}
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          className="rounded-2xl border p-4"
          href={`/worlds/${world.id}/locations`}
        >
          Locations
        </Link>
        <Link
          className="rounded-2xl border p-4"
          href={`/worlds/${world.id}/npcs`}
        >
          NPCs
        </Link>
        <Link
          className="rounded-2xl border p-4"
          href={`/worlds/${world.id}/items`}
        >
          Items
        </Link>
        <Link
          className="rounded-2xl border p-4"
          href={`/worlds/${world.id}/gods`}
        >
          Gods
        </Link>
      </section>
    </div>
  );
}
