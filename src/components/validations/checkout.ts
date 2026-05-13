import z from "zod";

export const checkoutSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().min(1, "Name is required"),
    phone: z.string().min(1, "Phone is required"),
    address: z.string().min(1, "Address is required"),
    postalCode: z.string().optional().nullable()
  }),
  payment: z.object({
    method: z.enum(['COD', "BKASH","NAGAD"]).default("COD"),
    status: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]).default("PENDING"),
    transactionId: z.string().optional().nullable(),
  }),

  coupon: z.object({
    code: z.string().optional().nullable(),
    discountAmount: z.coerce.number().optional().nullable(),
  }).optional(),
  deliveryCharge: z.coerce.number().optional().nullable(),
  customerNote: z.string().optional(),
}).superRefine((data, ctx) => {
  const method = data.payment.method;
  const txId = data.payment.transactionId;


  if ((method === "BKASH" || method === "NAGAD") && 
      (!txId || typeof txId === "string" && txId.trim() === "")) {
    
    ctx.addIssue({
      path: ["payment", "transactionId"],
      code: "custom",
      message: `Transaction ID is required for ${method} payment`,
    });
  }
});

export type TCheckoutForm = z.infer<typeof checkoutSchema>;