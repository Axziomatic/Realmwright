"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  MapPin,
  Users,
  Package,
  Flag,
  Sparkles,
  X,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";

const navItems = [
  {
    key: "worlds",
    label: "Worlds",
    icon: Shield,
    path: "/worlds",
    worldScoped: false,
  },
  {
    key: "locations",
    label: "Locations",
    icon: MapPin,
    path: "/locations",
    worldScoped: true,
  },
  { key: "npcs", label: "NPCs", icon: Users, path: "/npcs", worldScoped: true },
  {
    key: "items",
    label: "Items",
    icon: Package,
    path: "/items",
    worldScoped: true,
  },
  {
    key: "gods",
    label: "Gods",
    icon: Sparkles,
    path: "/gods",
    worldScoped: true,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const selectedWorld = useAppStore((s) => s.selectedWorld);
  const worldId = selectedWorld?.id;
  const worldDisabled = !worldId;

  const buildHref = (item: (typeof navItems)[number]) => {
    if (!item.worldScoped) return item.path;
    return worldId ? `/worlds/${worldId}${item.path}` : "/worlds";
  };

  const worldHref = (path: string) =>
    worldId ? `/worlds/${worldId}${path}` : "/worlds";

  if (!sidebarOpen) return null;

  return (
    <>
      <button
        aria-label="Close sidebar overlay"
        onClick={() => setSidebarOpen(false)}
        className="fixed inset-0 z-40 bg-black/50"
      />

      <aside className="fixed left-0 top-0 z-50 h-dvh w-[280px] border-r border-border-secondary bg-gradient-to-b from-background-card to-background-main p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-accent-highlight">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border-secondary">
                ✦
              </span>
              <span className="font-heading text-base text-accent-highlight">
                Realmwright
              </span>
            </div>
            <p className="mt-1 text-sm text-foreground-secondary">
              Worldbuilding Studio
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-xl border border-border-secondary bg-background-card p-2 hover:bg-background-muted"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4 text-foreground-primary" />
          </button>
        </div>

        {selectedWorld ? (
          <div className="mt-4 rounded-2xl border border-border-secondary p-3 text-sm">
            <div className="text-xs text-foreground-secondary">
              Selected world
            </div>
            <div className="font-medium text-foreground-primary">
              {selectedWorld.name}
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-border-secondary p-3 text-sm text-foreground-secondary">
            Select a world to unlock world content
          </div>
        )}

        <nav className="mt-6">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const href = buildHref(item);
              const disabled = item.worldScoped && worldDisabled;
              const active = pathname === href;

              if (disabled) {
                return (
                  <li key={item.key}>
                    <button
                      type="button"
                      className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2 text-sm text-foreground-primary/40"
                      aria-disabled="true"
                      title="Select a world first"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              }

              return (
                <li key={item.key}>
                  <Link
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                    className={[
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                      active
                        ? "bg-white/10 text-accent-highlight"
                        : "text-foreground-primary/90 hover:bg-white/5",
                    ].join(" ")}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 w-full border-t border-border-secondary p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-primary text-black">
              GM
            </div>
            <div>
              <div className="text-sm text-foreground-primary">Game Master</div>
              <div className="text-xs text-foreground-secondary">Free Plan</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
