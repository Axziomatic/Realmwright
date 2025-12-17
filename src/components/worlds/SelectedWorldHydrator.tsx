"use client";

import * as React from "react";
import { useAppStore } from "@/store/appStore";

type WorldRef = {
  id: string;
  name?: string;
  slug?: string;
};

export default function SelectedWorldHydrator({ world }: { world: WorldRef }) {
  const setSelectedWorld = useAppStore((s) => s.setSelectedWorld);

  React.useEffect(() => {
    setSelectedWorld(world);
  }, [setSelectedWorld, world.id, world.name, world.slug]);

  return null;
}
