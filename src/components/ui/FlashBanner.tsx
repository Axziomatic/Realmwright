"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Variant = "success" | "error";

export default function FlashBanner({
  keys = ["saved", "created", "deleted", "error"],
}: {
  keys?: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const error = sp.get("error");
  const saved = sp.get("saved") === "1";
  const created = sp.get("created") === "1";
  const deleted = sp.get("deleted") === "1";

  let variant: Variant | null = null;
  let message: string | null = null;

  if (error) {
    variant = "error";
    message = decodeURIComponent(error);
  } else if (saved) {
    variant = "success";
    message = "Saved.";
  } else if (created) {
    variant = "success";
    message = "Created.";
  } else if (deleted) {
    variant = "success";
    message = "Deleted.";
  }

  React.useEffect(() => {
    if (!message) return;

    const t = window.setTimeout(() => {
      router.replace(pathname);
    }, 3000);

    return () => window.clearTimeout(t);
  }, [message, pathname, router]);

  if (!message || !variant) return null;

  const cls =
    variant === "error"
      ? "rounded-xl border px-4 py-3 text-sm"
      : "rounded-xl border px-4 py-3 text-sm";

  return (
    <div role="status" className={cls}>
      {message}
    </div>
  );
}
