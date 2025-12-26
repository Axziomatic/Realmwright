import { getWorld } from "@/app/actions/worlds";
import Link from "next/link";
import FlashBanner from "@/components/ui/FlashBanner";
import { listNpcs } from "@/app/actions/npcs";
import CreateNpcDialog from "@/components/npcs/CreateNpcDialog";

type PageProps = {
  params: Promise<{ worldId: string }>;
  searchParams?: Promise<{ error?: string; created?: string }>;
};

export default async function NpcsPage({ params, searchParams }: PageProps) {
  const { worldId } = await params;
  const sp = (await searchParams) ?? {};
  const errorMsg = sp.error ? decodeURIComponent(sp.error) : null;
  const created = sp.created === "1";

  const world = await getWorld(worldId);
  const npcs = await listNpcs(worldId);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground-primary">
            NPCs
          </h1>
          <p className="text-sm text-foreground-secondary">
            Characters in <span className="font-medium">{world.name}</span>
          </p>
        </div>
      </header>

      <FlashBanner />

      <CreateNpcDialog worldId={worldId} created={created} />

      {errorMsg ? (
        <div role="alert" className="rounded-xl border px-4 py-3 text-sm">
          {errorMsg}
        </div>
      ) : null}

      {npcs.length === 0 ? (
        <section className="rounded-2xl border border-border-secondary bg-background-card p-6">
          <p className="text-sm text-foreground-secondary">
            No NPCs yet. Create your first one.
          </p>
        </section>
      ) : (
        <ul className="grid gap-3">
          {npcs.map((npc) => (
            <li
              key={npc.id}
              className="rounded-2xl border border-border-secondary bg-background-card p-4"
            >
              <Link
                href={`/worlds/${worldId}/npcs/${npc.id}`}
                className="block rounded-xl focus:outline-none focus:ring-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="font-medium text-foreground-primary">
                      {npc.name}
                    </h2>
                    {npc.summary ? (
                      <p className="text-sm text-foreground-secondary">
                        {npc.summary}
                      </p>
                    ) : null}
                  </div>

                  {npc.role ? (
                    <span className="text-sm opacity-70">{npc.role}</span>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
