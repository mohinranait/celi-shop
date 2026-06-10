import z from "zod";

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100),

  email: z
    .string()
    .email("Please enter a valid email address"),

  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[\+]?[0-9\s-()]{8,}$/.test(val), {
      message: "Please enter a valid phone number",
    }),

  orderNumber: z.string().optional(),

  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(150),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;