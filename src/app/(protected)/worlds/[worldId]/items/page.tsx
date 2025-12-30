import { getWorld } from "@/app/actions/worlds";
import Link from "next/link";
import FlashBanner from "@/components/ui/FlashBanner";
import { listItems } from "@/app/actions/items";
import CreateItemDialog from "@/components/items/CreateItemDialog";

type PageProps = {
  params: Promise<{ worldId: string }>;
  searchParams?: Promise<{ error?: string; created?: string }>;
};

export default async function ItemsPage({ params, searchParams }: PageProps) {
  const { worldId } = await params;
  const sp = (await searchParams) ?? {};
  const errorMsg = sp.error ? decodeURIComponent(sp.error) : null;
  const created = sp.created === "1";

  const world = await getWorld(worldId);
  const items = await listItems(worldId);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground-primary">
            Items
          </h1>
          <p className="text-sm text-foreground-secondary">
            Equipment and artifacts in{" "}
            <span className="font-medium">{world.name}</span>
          </p>
        </div>
      </header>

      <FlashBanner />

      <CreateItemDialog worldId={worldId} created={created} />

      {errorMsg ? (
        <div role="alert" className="rounded-xl border px-4 py-3 text-sm">
          {errorMsg}
        </div>
      ) : null}

      {items.length === 0 ? (
        <section className="rounded-2xl border border-border-secondary bg-background-card p-6">
          <p className="text-sm text-foreground-secondary">
            No items yet. Create your first one.
          </p>
        </section>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-border-secondary bg-background-card p-4"
            >
              <Link
                href={`/worlds/${worldId}/items/${item.id}`}
                className="block rounded-xl focus:outline-none focus:ring-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="font-medium text-foreground-primary">
                      {item.name}
                    </h2>
                    {item.summary ? (
                      <p className="text-sm text-foreground-secondary">
                        {item.summary}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col items-end gap-1 text-sm opacity-70">
                    {item.rarity ? <span>{item.rarity}</span> : null}
                    {item.type ? <span>{item.type}</span> : null}
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
