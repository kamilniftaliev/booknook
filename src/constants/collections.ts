import { z } from "zod";

export const collectionFormSchema = z.object({
  title: z
    .string()
    .min(2, "Collection title must contain at least 2 characters"),
  isPublic: z.boolean().optional(),
});
