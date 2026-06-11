import z from "zod";

export const commentSchema = z.object({
    productId: z.string().min(1, 'Product is required'),
    userId: z.string().min(1, 'User is required'),
    comment: z.string().min(1, 'Content is required'),
    rating: z.number().int().min(1).max(5).default(5),
    isApproved: z.boolean().default(false),
});


export type TCommentFormData = z.infer<typeof commentSchema>;