"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateNpc, deleteNpc } from "@/app/actions/npcs";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const schema = z.object({
  name: z.string().min(2).max(80),
  role: z.string().max(80).optional().or(z.literal("")),
  summary: z.string().max(500).optional().or(z.literal("")),
  description: z.string().max(5000).optional().or(z.literal("")),
  primaryLocationId: z.string().uuid().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  worldId: string;
  npc: {
    id: string;
    name: string;
    role: string | null;
    summary: string | null;
    description: string | null;
    primary_location_id: string | null;
  };
  locations: { id: string; name: string }[];
};

export default function NpcEditorCard({ worldId, npc, locations }: Props) {
  const formRef = React.useRef<HTMLFormElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: npc.name ?? "",
      role: npc.role ?? "",
      summary: npc.summary ?? "",
      description: npc.description ?? "",
      primaryLocationId: npc.primary_location_id ?? "",
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
          <div className="text-sm font-medium">Details</div>
          <div className="mt-1 text-sm opacity-80">
            Edit your NPC. Changes are saved when you click{" "}
            <span className="font-medium">Save</span>.
          </div>
        </div>

        <form ref={deleteRef} action={deleteNpc}>
          <input type="hidden" name="worldId" value={worldId} />
          <input type="hidden" name="npcId" value={npc.id} />
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
        title="Delete NPC?"
        description="This cannot be undone."
        confirmText="Delete"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          deleteRef.current?.requestSubmit();
        }}
      />

      <form ref={formRef} action={updateNpc} className="space-y-4">
        <input type="hidden" name="worldId" value={worldId} />
        <input type="hidden" name="npcId" value={npc.id} />

        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <input
            {...register("name")}
            className="w-full rounded-xl border px-3 py-2 text-sm bg-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Role</label>
          <input
            {...register("role")}
            className="w-full rounded-xl border px-3 py-2 text-sm bg-transparent"
            placeholder="Innkeeper / Guard / Noble..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Primary location</label>
          <select
            {...register("primaryLocationId")}
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
            Where this NPC is primarily found.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Summary</label>
          <textarea
            {...register("summary")}
            rows={3}
            className="w-full rounded-xl border px-3 py-2 text-sm bg-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            {...register("description")}
            rows={8}
            className="w-full rounded-xl border px-3 py-2 text-sm bg-transparent"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            className="rounded-xl px-4 py-2 text-sm border"
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
