import { z } from "zod";

export const appSettingsSchema = z.object({
  siteName: z.string().min(3),
  siteDescription: z.string().optional(),
  logo: z.string().url().optional().or(z.literal("")),
  footerLogo: z.string().url().optional().or(z.literal("")),
  favicon: z.string().url().optional().or(z.literal("")),

  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().default("Bangladesh"),
    zipCode: z.string().optional(),
  }),

  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImage: z.string().optional(),

  currency: z.object({
    code: z.string(),
    symbol: z.string(),
  }),

  language: z.enum(["en", "bn"]),
  timezone: z.string(),

  paymentMethods: z.object({
    cod: z.boolean(),
    stripe: z.object({ enabled: z.boolean(), publishableKey: z.string().optional() }),
    sslcommerz: z.object({ enabled: z.boolean(), storeId: z.string().optional() }),
    bKash: z.object({ enabled: z.boolean(), merchantNumber: z.string().optional() }),
    nagad: z.object({ enabled: z.boolean(), merchantNumber: z.string().optional() }),
  }),

  shipping: z.object({
    freeShippingThreshold: z.number().min(0),
    defaultShippingFee: z.number().min(0),
    shippingZones: z.array(z.object({
      areaName: z.string(),
      fee: z.number(),
    })),
  }),

  tax: z.object({
    enabled: z.boolean(),
    rate: z.number().min(0).max(100),
  }),

  features: z.object({
    wishlist: z.boolean(),
    productReview: z.boolean(),
    couponSystem: z.boolean(),
    flashSale: z.boolean(),
    multiVendor: z.boolean(),
    blog: z.boolean(),
    bannerSlider: z.boolean(),
    guestOrder: z.boolean(),
  }),

  layouts: z.object({
    categorySection: z.coerce.number().default(1),
    header: z.coerce.number().default(1),
  }),

  socialLinks: z.object({
    facebook: z.string().url().optional().or(z.literal("")),
    instagram: z.string().url().optional().or(z.literal("")),
    youtube: z.string().url().optional().or(z.literal("")),
    tiktok: z.string().url().optional().or(z.literal("")),
  }),

  maintenanceMode: z.boolean(),
  maintenanceMessage: z.string().optional(),
});