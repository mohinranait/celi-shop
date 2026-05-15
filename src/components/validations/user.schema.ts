import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name name must be at least 2 characters"),
  phone: z
    .string({ message: "Phone field is required" })
    .min(11, "Must be exactly 11 digits")
    .max(11, "Must be exactly 11 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),

  role: z.enum(['Admin', 'User',]).default('User'),
  status: z.enum(['Active', 'Pending', "Banned"]).default('Active'),

});

export type TUserInput = z.infer<typeof userSchema>;