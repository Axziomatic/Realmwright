"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateItem, deleteItem } from "@/app/actions/items";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  type: z.string().max(60).optional().or(z.literal("")),
  rarity: z.string().max(40).optional().or(z.literal("")),
  summary: z.string().max(500).optional().or(z.literal("")),
  description: z.string().max(5000).optional().or(z.literal("")),
  locationId: z.string().uuid().optional().or(z.literal("")),
  ownerNpcId: z.string().uuid().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  worldId: string;
  item: {
    id: string;
    world_id: string;
    name: string;
    type: string | null;
    rarity: string | null;
    summary: string | null;
    description: string | null;
    owner_npc_id?: string | null;
    location_id?: string | null;
  };
  locations: { id: string; name: string }[];
  npcs: { id: string; name: string; role?: string | null }[];
};

export default function ItemEditorCard({
  worldId,
  item,
  locations,
  npcs,
}: Props) {
  const formRef = React.useRef<HTMLFormElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: item.name ?? "",
      type: item.type ?? "",
      rarity: item.rarity ?? "",
      summary: item.summary ?? "",
      description: item.description ?? "",
      locationId: item.location_id ?? "",
      ownerNpcId: item.owner_npc_id ?? "",
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
            Edit your item. Changes are saved when you click{" "}
            <span className="font-medium">Save</span>.
          </div>
        </div>

        <form ref={deleteRef} action={deleteItem}>
          <input type="hidden" name="worldId" value={worldId} />
          <input type="hidden" name="itemId" value={item.id} />
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
        title="Delete item?"
        description="This cannot be undone."
        confirmText="Delete"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          deleteRef.current?.requestSubmit();
        }}
      />

      <form ref={formRef} action={updateItem} className="space-y-4">
        <input type="hidden" name="worldId" value={worldId} />
        <input type="hidden" name="itemId" value={item.id} />

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
            <label className="text-sm font-medium" htmlFor="type">
              Type
            </label>
            <input
              id="type"
              {...register("type")}
              className="w-full rounded-xl border px-3 py-2 text-sm bg-transparent"
              placeholder="Weapon / Potion / Relic ..."
              aria-invalid={Boolean(errors.type)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="rarity">
              Rarity
            </label>
            <input
              id="rarity"
              {...register("rarity")}
              className="w-full rounded-xl border px-3 py-2 text-sm bg-transparent"
              placeholder="Common / Rare / Legendary ..."
              aria-invalid={Boolean(errors.rarity)}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="locationId">
              Location
            </label>
            <select
              id="locationId"
              {...register("locationId")}
              className="w-full rounded-xl border px-3 py-2 text-sm bg-transparent"
            >
              <option value="">None</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
            <p className="text-xs opacity-70">
              Where this item is currently located.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="ownerNpcId">
              Owner NPC
            </label>
            <select
              id="ownerNpcId"
              {...register("ownerNpcId")}
              className="w-full rounded-xl border px-3 py-2 text-sm bg-transparent"
            >
              <option value="">None</option>
              {npcs.map((npc) => (
                <option key={npc.id} value={npc.id}>
                  {npc.name}
                </option>
              ))}
            </select>
            <p className="text-xs opacity-70">Who currently owns this item.</p>
          </div>
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
            aria-invalid={Boolean(errors.description)}
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
            className="rounded-xl px-4 py-2 text-sm font-medium border"
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
