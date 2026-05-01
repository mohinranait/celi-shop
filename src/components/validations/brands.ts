import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional().nullable(),
  status: z.boolean(),
  logo: z.string().optional().nullable(),
  banner: z.string().optional().nullable(),
});

export type TBrandInput = z.infer<typeof brandSchema>;