import Link from "next/link";
import Image from "next/image";
import { listWorlds } from "@/app/actions/worlds";
import CreateWorldDialog from "@/components/worlds/CreateWorldDialog";

type WorldsPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

const WORLD_COVERS = [
  "/world-covers/1.jpg",
  "/world-covers/2.jpg",
  "/world-covers/3.jpg",
];

function pickCover(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return WORLD_COVERS[hash % WORLD_COVERS.length] ?? "/world-covers/1.jpg";
}

function StatPill({
  label,
  value,
  className = "",
}: {
  label: string;
  value: number;
  className?: string;
}) {
  return (
    <div
      className={[
        "inline-flex items-baseline gap-1 rounded-full border border-border-secondary bg-background-card/60 px-2.5 py-1 text-xs",
        className,
      ].join(" ")}
    >
      <span className="font-medium text-foreground-primary">{value}</span>
      <span className="text-foreground-secondary">{label}</span>
    </div>
  );
}

export default async function WorldsPage({ searchParams }: WorldsPageProps) {
  const sp = (await searchParams) ?? {};
  const errorMsg = sp.error ? decodeURIComponent(sp.error) : null;

  const worlds = await listWorlds();

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Worlds</h1>
          <p className="text-sm text-foreground-secondary">
            Create and manage your campaign settings.
          </p>
        </div>

        <CreateWorldDialog />
      </header>

      {errorMsg ? (
        <div
          role="alert"
          className="rounded-xl border border-border-secondary bg-background-card px-4 py-3 text-sm text-foreground-primary"
        >
          {errorMsg}
        </div>
      ) : null}

      {worlds.length === 0 ? (
        <div className="rounded-2xl border border-border-secondary bg-background-card p-6">
          <p className="text-sm text-foreground-secondary">
            You don’t have any worlds yet. Create your first one.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {worlds.map((w) => (
            <li key={w.id}>
              <Link
                href={`/worlds/${w.id}`}
                className="group block overflow-hidden rounded-2xl border border-border-secondary bg-background-card transition hover:border-border-primary focus:outline-none focus:ring-2 focus:ring-accent-highlight"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={pickCover(w.id)}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-background-main via-background-main/40 to-transparent" />
                </div>

                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-medium text-foreground-primary">
                        {w.name}
                      </h2>
                      <p className="mt-1 line-clamp-2 text-sm text-foreground-secondary">
                        {w.summary ?? "A world waiting to be written."}
                      </p>
                    </div>

                    <span className="text-xs text-foreground-secondary">
                      {w.is_private ? "Private" : "Public"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs">
                    <span className="flex items-baseline gap-1">
                      <span className="font-medium text-sky-300">
                        {w.counts.npcs}
                      </span>
                      <span className="text-foreground-secondary">NPCs</span>
                    </span>

                    <span className="flex items-baseline gap-1">
                      <span className="font-medium text-emerald-300">
                        {w.counts.locations}
                      </span>
                      <span className="text-foreground-secondary">
                        Locations
                      </span>
                    </span>

                    <span className="flex items-baseline gap-1">
                      <span className="font-medium text-fuchsia-300">
                        {w.counts.items}
                      </span>
                      <span className="text-foreground-secondary">Items</span>
                    </span>

                    <span className="flex items-baseline gap-1">
                      <span className="font-medium text-amber-300">
                        {w.counts.gods}
                      </span>
                      <span className="text-foreground-secondary">Gods</span>
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
