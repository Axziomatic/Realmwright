import SelectedWorldHydrator from "@/components/worlds/SelectedWorldHydrator";
import { getWorld } from "@/app/actions/worlds";
import { getWorldDashboardCounts } from "@/app/actions/worldDashboard";
import Link from "next/link";
import { MapPin, Users, Package, Sparkles } from "lucide-react";

type PageProps = {
  params: Promise<{ worldId: string }>;
};

function StatCard({
  title,
  value,
  href,
  Icon,
}: {
  title: string;
  value: number;
  href: string;
  Icon: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-border-secondary bg-background-card px-4 py-2.5 transition hover:bg-background-muted hover:border-border-primary"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <div className="text-xs text-foreground-secondary">{title}</div>
          <div className="text-2xl font-semibold text-foreground-primary">
            {value}
          </div>
        </div>

        <Icon className="h-5 w-5 text-foreground-secondary" />
      </div>
    </Link>
  );
}
function ResourceCard({
  title,
  description,
  countLabel,
  count,
  href,
  Icon,
}: {
  title: string;
  description: string;
  countLabel: string;
  count: number;
  href: string;
  Icon?: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-border-secondary bg-background-card transition hover:bg-background-muted hover:border-border-primary"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-gradient-to-r from-white/5 to-transparent" />
      <div className="relative p-5">
        <h2 className="text-lg font-semibold text-foreground-primary">
          {title}
        </h2>

        <p className="mt-3 text-sm text-foreground-secondary line-clamp-3">
          {description}
        </p>

        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="text-foreground-secondary">
            <span className="font-medium text-foreground-primary">{count}</span>{" "}
            {countLabel}
          </div>

          {Icon ? (
            <div className="rounded-xl bg-background-muted p-2 transition group-hover:bg-background-main">
              <Icon className="h-5 w-5 text-foreground-secondary" />
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export default async function WorldPage({ params }: PageProps) {
  const { worldId } = await params;

  const world = await getWorld(worldId);
  const counts = await getWorldDashboardCounts(worldId);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-8">
      <div className="space-y-8">
        <SelectedWorldHydrator
          world={{ id: world.id, name: world.name, slug: world.slug }}
        />

        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground-primary">
            {world.name}
          </h1>
          <p className="text-sm text-foreground-secondary">
            {world.summary ?? "Your world overview and key resources."}
          </p>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Locations"
            value={counts.locations}
            href={`/worlds/${worldId}/locations`}
            Icon={MapPin}
          />
          <StatCard
            title="NPCs"
            value={counts.npcs}
            href={`/worlds/${worldId}/npcs`}
            Icon={Users}
          />
          <StatCard
            title="Items"
            value={counts.items}
            href={`/worlds/${worldId}/items`}
            Icon={Package}
          />
          <StatCard
            title="Gods"
            value={counts.gods}
            href={`/worlds/${worldId}/gods`}
            Icon={Sparkles}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <ResourceCard
            title="Locations"
            description="Create and organize places in your world - cities, dungeons, regions and landmarks."
            href={`/worlds/${worldId}/locations`}
            count={counts.locations}
            countLabel="Locations"
            Icon={MapPin}
          />
          <ResourceCard
            title="NPCs"
            description="Keep track of characters, factions, allies, and enemies. Link them to locations and items."
            href={`/worlds/${worldId}/npcs`}
            count={counts.npcs}
            countLabel="NPCs"
            Icon={Users}
          />
          <ResourceCard
            title="Items"
            description="Artifacts, equipment, quest items, and treasures — and who owns them."
            href={`/worlds/${worldId}/items`}
            count={counts.items}
            countLabel="Items"
            Icon={Package}
          />
          <ResourceCard
            title="Gods"
            description="Pantheons, domains, symbols, and relationships — everything divine in one place."
            href={`/worlds/${worldId}/gods`}
            count={counts.gods}
            countLabel="Gods"
            Icon={Sparkles}
          />
        </section>

        <section className="rounded-2xl border border-border-secondary bg-background-card p-5">
          <div className="text-sm font-medium text-foreground-primary">
            Recent Activity
          </div>
          <div className="mt-2 text-sm text-foreground-secondary">
            Coming soon.
          </div>
        </section>
      </div>
    </div>
  );
}
