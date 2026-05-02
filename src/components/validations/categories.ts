
import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug is required"),
  parentId: z.string().optional().nullable(),
  description: z.string().max(200).optional(),
  thumbnail: z.string().optional().nullable(),
  banner: z.string().optional().nullable(),
  status : z.boolean(),
});

export type TCategoryFormData = z.infer<typeof categorySchema>;
