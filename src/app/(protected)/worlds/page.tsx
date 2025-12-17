// import AuthHeader from "@/components/AuthHeader";

// export default function WorldsPage() {
//   return (
//     <main className="min-h-dvh bg-background-main">
//       <AuthHeader />
//       <div className="p-6">
//         <h1 className="text-2xl font-semibold text-foreground-primary">
//           Worlds
//         </h1>
//         <p className="mt-2 text-foreground-secondary">
//           Placeholder – här kommer din world list.
//         </p>
//       </div>
//     </main>
//   );
// }

// src/app/(protected)/worlds/page.tsx
import Link from "next/link";
import { listWorlds } from "@/app/actions/worlds";
import CreateWorldDialog from "@/components/worlds/CreateWorldDialog";

type WorldsPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function WorldsPage({ searchParams }: WorldsPageProps) {
  const sp = (await searchParams) ?? {};
  const errorMsg = sp.error ? decodeURIComponent(sp.error) : null;

  const worlds = await listWorlds();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Worlds</h1>
          <p className="text-sm opacity-80">Manage your worlds.</p>
        </div>

        <CreateWorldDialog />
      </header>

      {errorMsg ? (
        <div role="alert" className="rounded-xl border px-4 py-3 text-sm">
          {errorMsg}
        </div>
      ) : null}

      {worlds.length === 0 ? (
        <div className="rounded-2xl border p-6">
          <p className="text-sm opacity-80">
            You don’t have any worlds yet. Create your first one.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {worlds.map((w) => (
            <li key={w.id} className="rounded-2xl border p-4">
              <Link
                href={`/worlds/${w.id}`}
                className="block focus:outline-none focus:ring-2 rounded-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-medium">{w.name}</h2>
                    {w.summary ? (
                      <p className="text-sm opacity-80 mt-1">{w.summary}</p>
                    ) : null}
                  </div>

                  <span className="text-xs opacity-70">
                    {w.is_private ? "Private" : "Public"}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
