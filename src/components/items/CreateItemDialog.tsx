"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createItem } from "@/app/actions/items";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  type: z.string().max(60).optional().or(z.literal("")),
  rarity: z.string().max(40).optional().or(z.literal("")),
  summary: z.string().max(500).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export default function CreateItemDialog({
  worldId,
  created,
}: {
  worldId: string;
  created?: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  const formRef = React.useRef<HTMLFormElement | null>(null);
  const nameRef = React.useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", type: "", rarity: "", summary: "" },
    mode: "onSubmit",
  });

  React.useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => nameRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  React.useEffect(() => {
    if (!created) return;
    setOpen(false);
    reset();
  }, [created, reset]);

  const close = () => {
    setOpen(false);
    reset();
  };

  const onValid = () => {
    formRef.current?.requestSubmit();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl px-4 py-2 text-sm font-medium border border-border-secondary bg-accent-primary text-black"
      >
        + Create Item
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close dialog"
            onClick={close}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-item-title"
            className="relative w-full max-w-lg rounded-2xl border bg-background-card p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="create-item-title" className="text-lg font-semibold">
                  Create Item
                </h2>
                <p className="text-sm opacity-80 mt-1">
                  Add an item to your world. Details can come later.
                </p>
              </div>

              <button
                type="button"
                onClick={close}
                className="rounded-xl px-3 py-1 text-sm border"
              >
                Close
              </button>
            </div>

            <form ref={formRef} action={createItem} className="mt-5 space-y-4">
              <input type="hidden" name="worldId" value={worldId} />

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  {...register("name")}
                  ref={(el) => {
                    register("name").ref(el);
                    nameRef.current = el;
                  }}
                  name="name"
                  className="w-full rounded-xl border px-3 py-2 text-sm bg-transparent"
                  placeholder="Moonsteel Dagger"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name ? (
                  <p className="text-sm" role="alert">
                    {errors.name.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="rarity">
                  Rarity (optional)
                </label>
                <input
                  id="rarity"
                  {...register("rarity")}
                  name="rarity"
                  className="w-full rounded-xl border px-3 py-2 text-sm bg-transparent"
                  placeholder="Common / Rare / Legendary ..."
                  aria-invalid={Boolean(errors.rarity)}
                />
                {errors.rarity ? (
                  <p className="text-sm" role="alert">
                    {errors.rarity.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="type">
                  Type (optional)
                </label>
                <input
                  id="type"
                  {...register("type")}
                  name="type"
                  className="w-full rounded-xl border px-3 py-2 text-sm bg-transparent"
                  placeholder="Weapon / Relic / Consumable ..."
                  aria-invalid={Boolean(errors.type)}
                />
                {errors.type ? (
                  <p className="text-sm" role="alert">
                    {errors.type.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="summary">
                  Summary (optional)
                </label>
                <textarea
                  id="summary"
                  {...register("summary")}
                  name="summary"
                  rows={3}
                  className="w-full rounded-xl border px-3 py-2 text-sm bg-transparent"
                  placeholder="A dagger forged from pale moonsteel..."
                  aria-invalid={Boolean(errors.summary)}
                />
                {errors.summary ? (
                  <p className="text-sm" role="alert">
                    {errors.summary.message}
                  </p>
                ) : (
                  <p className="text-xs opacity-70">Max 500 characters.</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={close}
                  className="rounded-xl px-4 py-2 text-sm font-medium border"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-xl px-4 py-2 text-sm font-medium border border-border-secondary bg-accent-primary text-black"
                  onClick={() => void handleSubmit(onValid)()}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
