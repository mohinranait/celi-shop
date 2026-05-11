import { z } from "zod";

export const sliderSchema = z.object({
  title: z.string().min(2, "title name must be at least 2 characters"),
  description: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  buttonName: z.string().optional().nullable(),
  sliderType: z.enum(['directImage',"withImage","withoutImage"]).default('withoutImage'),
  status: z.boolean(),
  image: z.string().optional().nullable(),
  order: z.coerce.number().optional().nullable(),
});

export type TSliderInput = z.infer<typeof sliderSchema>;