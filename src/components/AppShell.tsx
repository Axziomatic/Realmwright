"use client";

import Sidebar from "@/components/Sidebar";
import { useAppStore } from "@/store/appStore";
import GlobalSearchBar from "./search/GlobalSearchBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

  return (
    <div className="min-h-dvh bg-background-main text-foreground-primary">
      <div className="p-4 pt-4 bg-background-card border border-border-secondary">
        <header className="mx-auto w-full max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={toggleSidebar}
              className="rounded-xl border border-border-secondary bg-background-card px-3 py-2 text-sm hover:bg-background-muted"
            >
              Menu
            </button>

            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-2xl rounded-2xl border border-border-secondary bg-background-muted/60 px-3 py-1.5">
                <GlobalSearchBar />
              </div>
            </div>

            <div className="w-[60px]" />
          </div>
        </header>
      </div>

      <Sidebar />

      <main className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6">
        {children}
      </main>
    </div>
  );
}
