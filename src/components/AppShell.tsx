"use client";

import Sidebar from "@/components/Sidebar";
import { useAppStore } from "@/store/appStore";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

  return (
    <div className="min-h-dvh bg-background-main text-foreground-primary">
      <header className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="rounded-xl border border-border-secondary bg-background-card px-3 py-2 text-sm hover:bg-background-muted"
        >
          Menu
        </button>

        <div className="font-heading text-lg tracking-wide">REALMWRIGHT</div>

        <div className="w-[60px]" />
      </header>

      <Sidebar />

      <main className="px-4 pb-10">{children}</main>
    </div>
  );
}
