import { z } from "zod";

export const attributeSchema = z.object({
  name: z
    .string()
    .min(2, "Attribute name must be at least 2 characters")
    .trim()
    .toLowerCase(), // URL বা DB কী-এর জন্য lowercase করা ভালো
  
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .trim(),
  
  description: z
    .string()
    .optional()
    .nullable(),
  
  status: z
    .boolean(),

  values: z
    .array(z.string().min(1, "Value cannot be empty"))
    .min(1, "At least one attribute value is required"),
});

export type TAttributeInput = z.infer<typeof attributeSchema>;
