import { z } from "zod";

export const npcBaseSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  role: z.string().trim().max(120).optional().or(z.literal("")),
  summary: z.string().trim().max(500).optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
  alignment: z.string().trim().max(60).optional().or(z.literal("")),
  primaryLocationId: z.string().uuid().nullable().optional(),
});

export const createNpcSchema = npcBaseSchema;

export const updateNpcSchema = npcBaseSchema;

export type CreateNpcInput = z.infer<typeof createNpcSchema>;
export type UpdateNpcInput = z.infer<typeof updateNpcSchema>;
