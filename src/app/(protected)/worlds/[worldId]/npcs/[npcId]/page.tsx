import { getNpc } from "@/app/actions/npcs";
import { getWorld } from "@/app/actions/worlds";
import Link from "next/link";
import NpcEditorCard from "@/components/npcs/NpcEditorCard";
import FlashBanner from "@/components/ui/FlashBanner";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ worldId: string; npcId: string }>;
  searchParams?: Promise<{ error?: string; saved?: string }>;
};

export default async function NpcDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { worldId, npcId } = await params;
  const sp = (await searchParams) ?? {};
  const errorMsg = sp.error ? decodeURIComponent(sp.error) : null;
  const saved = sp.saved === "1";

  const world = await getWorld(worldId);
  const npc = await getNpc(worldId, npcId);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-6">
      <header className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground-primary">
              {npc.name}
            </h1>
            <p className="text-sm text-foreground-secondary">
              In <span>{world.name}</span>
            </p>
          </div>

          <Link
            href={`/worlds/${worldId}/npcs`}
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

      <FlashBanner />

      <NpcEditorCard worldId={worldId} npc={npc} />
    </div>
  );
}
