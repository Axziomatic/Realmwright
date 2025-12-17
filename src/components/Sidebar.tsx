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
  { href: "/worlds", label: "Worlds", icon: Shield },
  { href: "/worlds/test-world/locations", label: "Locations", icon: MapPin },
  { href: "/worlds/test-world/npcs", label: "NPCs", icon: Users },
  { href: "/worlds/test-world/items", label: "Items", icon: Package },
  { href: "/worlds/test-world/factions", label: "Factions", icon: Flag },
  { href: "/worlds/test-world/gods", label: "Gods", icon: Sparkles },
];

export default function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

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

        <nav className="mt-6">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
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
