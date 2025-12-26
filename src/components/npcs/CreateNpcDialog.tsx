"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNpc } from "@/app/actions/npcs";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  role: z.string().max(120).optional().or(z.literal("")),
  summary: z.string().max(500).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export default function CreateNpcDialog({
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
    defaultValues: { name: "", role: "", summary: "" },
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
        className="rounded-xl px-4 py-2 text-sm font-medium border"
      >
        + Create NPC
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
            aria-labelledby="create-npc-title"
            className="relative w-full max-w-lg rounded-2xl border bg-background-card p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="create-npc-title" className="text-lg font-semibold">
                  Create NPC
                </h2>
                <p className="text-sm opacity-80 mt-1">
                  Add a character to your world. Details can come later.
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

            <form ref={formRef} action={createNpc} className="mt-5 space-y-4">
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
                  placeholder="Rissou"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name ? (
                  <p className="text-sm" role="alert">
                    {errors.name.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="role">
                  Role (optional)
                </label>
                <input
                  id="role"
                  {...register("role")}
                  name="role"
                  className="w-full rounded-xl border px-3 py-2 text-sm bg-transparent"
                  placeholder="Inquisitor / Merchant / Guard ..."
                  aria-invalid={Boolean(errors.role)}
                />
                {errors.role ? (
                  <p className="text-sm" role="alert">
                    {errors.role.message}
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
                  placeholder="A sharp-eyed detective who..."
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
                  className="rounded-xl px-4 py-2 text-sm font-medium border"
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
