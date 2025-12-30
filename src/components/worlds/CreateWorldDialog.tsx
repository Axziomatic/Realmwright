"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWorld } from "@/app/actions/worlds";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  summary: z
    .string()
    .max(200, "Summary must be at most 200 characters")
    .optional()
    .or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export default function CreateWorldDialog() {
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
    defaultValues: { name: "", summary: "" },
    mode: "onSubmit",
  });

  React.useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => nameRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

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
        className="inline-flex items-center gap-2 rounded-xl bg-accent-primary px-4 py-2 text-sm font-medium text-black hover:bg-accent-highlight focus:outline-none focus:ring-2 focus:ring-accent-highlight"
      >
        + Create New World
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-hidden={false}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close dialog"
            onClick={close}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-world-title"
            className="relative w-full max-w-lg rounded-2xl border bg-background p-5 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="create-world-title" className="text-lg font-semibold">
                  Create New World
                </h2>
                <p className="text-sm opacity-80 mt-1">
                  Give it a name — you can add details later.
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

            <form ref={formRef} action={createWorld} className="mt-5 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="name">
                  World name
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
                  placeholder="Eldermoor"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name ? (
                  <p className="text-sm" role="alert">
                    {errors.name.message}
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
                  placeholder="A dark fantasy realm where ancient magic..."
                  aria-invalid={Boolean(errors.summary)}
                />
                {errors.summary ? (
                  <p className="text-sm" role="alert">
                    {errors.summary.message}
                  </p>
                ) : (
                  <p className="text-xs opacity-70">Max 200 characters.</p>
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
                  onClick={() => {
                    void handleSubmit(onValid)();
                  }}
                >
                  Create
                </button>{" "}
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
