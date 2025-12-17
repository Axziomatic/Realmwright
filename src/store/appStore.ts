"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type WorldRef = {
  id: string;
  name?: string;
  slug?: string;
};

type AppState = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  globalSearch: string;
  setGlobalSearch: (value: string) => void;
  clearGlobalSearch: () => void;

  selectedWorld: WorldRef | null;
  setSelectedWorld: (world: WorldRef | null) => void;
  clearSelectedWorld: () => void;
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: true,
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

        globalSearch: "",
        setGlobalSearch: (value) => set({ globalSearch: value }),
        clearGlobalSearch: () => set({ globalSearch: "" }),

        selectedWorld: null,
        setSelectedWorld: (world) => set({ selectedWorld: world }),
        clearSelectedWorld: () => set({ selectedWorld: null }),
      }),
      {
        name: "realmwright-app",
        partialize: (state) => ({
          sidebarOpen: state.sidebarOpen,
          selectedWorld: state.selectedWorld,
        }),
      }
    ),
    { name: "RealmwrightAppStore" }
  )
);
