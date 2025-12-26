import { getLocation } from "@/app/actions/locations";
import { getWorld } from "@/app/actions/worlds";
import Link from "next/link";

type PageProps = {
  params: { worldId: string; locationId: string };
  searchParams?: { error?: string; saved?: string };
};

export default async function LocationDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { worldId, locationId } = params;
  const sp = searchParams ?? {};
  const errorMsg = sp.error ? decodeURIComponent(sp.error) : null;
  const saved = sp.saved === "1";

  const world = await getWorld(worldId);
  const location = await getLocation(worldId, locationId);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-6">
      <header className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground-primary">
              {location.name}
            </h1>
            <p className="text-sm text-foreground-secondary">
              In <span>{world.name}</span>
            </p>
          </div>

          <Link
            href={`/worlds/${worldId}/locations`}
            className="rounded-xl px-3 py-2 text-sm border"
          >
            ← Back
          </Link>
        </div>

        {saved ? (
          <div className="rounded-xl border px-4 py-3 text-sm">Saved</div>
        ) : null}

        {errorMsg ? (
          <div role="alert" className="rounded-xl border px-4 py-3 text-sm">
            {errorMsg}
          </div>
        ) : null}
      </header>
    </div>
  );
}
