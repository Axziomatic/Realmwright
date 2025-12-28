import { getWorld } from "@/app/actions/worlds";
import { listGods } from "@/app/actions/gods";
import CreateGodDialog from "@/components/gods/CreateGodDialog";
import Link from "next/link";
import FlashBanner from "@/components/ui/FlashBanner";

type PageProps = {
  params: Promise<{ worldId: string }>;
  searchParams?: Promise<{ error?: string; created?: string }>;
};

export default async function GodsPage({ params, searchParams }: PageProps) {
  const { worldId } = await params;
  const sp = (await searchParams) ?? {};
  const errorMsg = sp.error ? decodeURIComponent(sp.error) : null;
  const created = sp.created === "1";

  const world = await getWorld(worldId);
  const gods = await listGods(worldId);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground-primary">
            Gods
          </h1>
          <p className="text-sm text-foreground-secondary">
            Deities in <span className="font-medium">{world.name}</span>
          </p>
        </div>
      </header>

      <FlashBanner />

      <CreateGodDialog worldId={worldId} created={created} />

      {errorMsg ? (
        <div role="alert" className="rounded-xl border px-4 py-3 text-sm">
          {errorMsg}
        </div>
      ) : null}

      {gods.length === 0 ? (
        <section className="rounded-2xl border border-border-secondary bg-background-card p-6">
          <p className="text-sm text-foreground-secondary">
            No gods yet. Create your first one.
          </p>
        </section>
      ) : (
        <ul className="grid gap-3">
          {gods.map((god) => (
            <li
              key={god.id}
              className="rounded-2xl border border-border-secondary bg-background-card p-4"
            >
              <Link
                href={`/worlds/${worldId}/gods/${god.id}`}
                className="block rounded-xl focus:outline-none focus:ring-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="font-medium text-foreground-primary">
                      {god.name}
                    </h2>
                    {god.summary ? (
                      <p className="text-sm text-foreground-secondary">
                        {god.summary}
                      </p>
                    ) : null}
                  </div>

                  {god.domain ? (
                    <span className="text-sm opacity-70">{god.domain}</span>
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
