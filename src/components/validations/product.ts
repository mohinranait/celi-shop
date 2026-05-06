import { z } from "zod";

/**  Variation Schema */
const variationSchema = z.object({
  name: z.string().min(1, "Variation name is required"),

  price: z.coerce.number().min(0),
  offerPriceFixed: z.coerce.number().min(0).optional(),
  offerPriceParcent: z.coerce.number().min(0).max(100).optional(),
  costPrice: z.coerce.number().min(0).optional(),

  sku: z.string().optional(),
  barcode: z.string().optional(),

  stock: z.coerce.number().min(0).default(0),
  lowStockAlert: z.coerce.number().min(0).default(5),

  images: z.array(z.string()).optional(),
  attributeConfig: z.record(z.string(), z.string()).optional(),

  weight: z.coerce.number().optional(),

  dimensions: z.object({
    length: z.coerce.number().optional(),
    width: z.coerce.number().optional(),
    height: z.coerce.number().optional(),
  }).optional(),

  isDefault: z.boolean().optional()
});


/**  Selected Attributes */
const selectedAttributeSchema = z.object({
  attributeId: z.string(),
  name: z.string().min(1),
  selectedValues: z.array(z.string())
});


/**  Shipping */
const shippingSchema = z.object({
  weight: z.coerce.number().optional(),

  dimensions: z.object({
    length: z.coerce.number().optional(),
    width: z.coerce.number().optional(),
    height: z.coerce.number().optional(),
  }).optional(),

  isFreeShipping: z.boolean().optional()
});


/**  SEO */
const seoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional()
});


/**  Main Product Schema */
export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),

  slug: z.string().optional(),

  shortDescription: z.string().optional(),
  description: z.string().optional(),

  thumbnail: z.string().optional(),
  gallery: z.array(z.string()).optional(),

  price: z.coerce.number().min(0).optional(),
  discountPrice: z.coerce.number().min(0).optional(),
  discountParcent: z.coerce.number().min(0).max(100).optional(),

  // productType: z.enum(["single", "variant"]).default("single"),
   productType: z.enum(["single", "variant"]),

  selectedAttributes: z.array(selectedAttributeSchema).optional(),

  variations: z.array(variationSchema).optional(),

  category: z.string().min(1, "Category is required"),

  brand: z.string().optional(),

  stock: z.coerce.number().min(0).optional(),

  trackStock: z.boolean().optional(),

  shipping: shippingSchema.optional(),

  seo: seoSchema.optional(),

  tags: z.array(z.string()).optional(),

  isFeatured: z.boolean().optional(),
  isDelete: z.boolean().optional(),

  status: z.boolean(),
});


export type TProductFormType  = z.infer<typeof productSchema>
