"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateGod, deleteGod } from "@/app/actions/gods";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  domain: z.string().max(80).optional().or(z.literal("")),
  alignment: z.string().max(60).optional().or(z.literal("")),
  symbol: z.string().max(120).optional().or(z.literal("")),
  summary: z.string().max(500).optional().or(z.literal("")),
  description: z.string().max(5000).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  worldId: string;
  god: {
    id: string;
    world_id: string;
    name: string;
    domain: string | null;
    alignment: string | null;
    symbol: string | null;
    summary: string | null;
    description: string | null;
  };
};

export default function GodEditorCard({ worldId, god }: Props) {
  const formRef = React.useRef<HTMLFormElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: god.name ?? "",
      domain: god.domain ?? "",
      alignment: god.alignment ?? "",
      symbol: god.symbol ?? "",
      summary: god.summary ?? "",
      description: god.description ?? "",
    },
    mode: "onSubmit",
  });

  const onValid = () => formRef.current?.requestSubmit();

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const deleteRef = React.useRef<HTMLFormElement | null>(null);

  return (
    <section className="rounded-2xl border border-border-secondary bg-background-card p-5 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-foreground-primary">
            Details
          </div>
          <div className="mt-1 text-sm text-foreground-secondary">
            Edit your god. Changes are saved when you click{" "}
            <span className="font-medium">Save</span>.
          </div>
        </div>

        <form ref={deleteRef} action={deleteGod}>
          <input type="hidden" name="worldId" value={worldId} />
          <input type="hidden" name="godId" value={god.id} />
          <button
            type="button"
            className="rounded-xl px-3 py-2 text-sm border"
            onClick={() => setConfirmOpen(true)}
          >
            Delete
          </button>
        </form>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete god?"
        description="This cannot be undone."
        confirmText="Delete"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          deleteRef.current?.requestSubmit();
        }}
      />

      <form ref={formRef} action={updateGod} className="space-y-4">
        <input type="hidden" name="worldId" value={worldId} />
        <input type="hidden" name="godId" value={god.id} />

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            {...register("name")}
            className="w-full rounded-xl border px-3 py-2 text-sm bg-transparent"
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? (
            <p className="text-sm" role="alert">
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="domain">
              Domain
            </label>
            <input
              id="domain"
              {...register("domain")}
              className="w-full rounded-xl border px-3 py-2 text-sm bg-transparent"
              placeholder="Sea / War / Knowledge ..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="alignment">
              Alignment
            </label>
            <input
              id="alignment"
              {...register("alignment")}
              className="w-full rounded-xl border px-3 py-2 text-sm bg-transparent"
              placeholder="LG / TN / CE ..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="symbol">
            Symbol
          </label>
          <input
            id="symbol"
            {...register("symbol")}
            className="w-full rounded-xl border px-3 py-2 text-sm bg-transparent"
            placeholder="A silver trident..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="summary">
            Summary
          </label>
          <textarea
            id="summary"
            {...register("summary")}
            rows={3}
            className="w-full rounded-xl border px-3 py-2 text-sm bg-transparent"
          />
          {errors.summary ? (
            <p className="text-sm" role="alert">
              {errors.summary.message}
            </p>
          ) : (
            <p className="text-xs opacity-70">Max 500 characters.</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={8}
            className="w-full rounded-xl border px-3 py-2 text-sm bg-transparent"
            placeholder="Write a longer description..."
          />
          {errors.description ? (
            <p className="text-sm" role="alert">
              {errors.description.message}
            </p>
          ) : (
            <p className="text-xs opacity-70">Max 5000 characters.</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            className="rounded-xl px-4 py-2 text-sm font-medium border border-border-secondary bg-accent-primary text-black"
            disabled={!isDirty}
            onClick={() => void handleSubmit(onValid)()}
          >
            Save
          </button>
        </div>
      </form>
    </section>
  );
}
