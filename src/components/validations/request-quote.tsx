import { z } from "zod";

export const requestQuoteSchema = z.object({
  productId: z.string().min(1, "Required"),
  request: z.object({
    name: z
      .string()
      .min(2, "Name is required"),

    phone: z
      .string()
      .min(11, "Phone number must be 11 digits"),

    whatsappNumber: z
      .string()
      .optional().nullable(),
  }),

  quantity: z.coerce
    .number()
    .min(1, "Quantity is required"),

  location: z.object({
    district: z
      .string()
       .optional().nullable(),

    zipCode: z.string().optional(),

    address: z
      .string()
      .min(5, "Address is required"),
  }),

  notes: z.string().optional(),
});

export type TRequestQuoteInput = z.infer<
  typeof requestQuoteSchema
>;