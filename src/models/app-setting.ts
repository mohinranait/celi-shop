import mongoose, { Schema, Document, Model } from 'mongoose';



export interface IAppSettings extends Document {
  siteName: string;
  siteDescription: string;
  logo: string;
  footerLogo: string;
  favicon: string;

  contactEmail: string;
  contactPhone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };

  // SEO
  metaTitle: string;
  metaDescription: string;
  ogImage: string;

  // Currency & Localization
  currency: {
    code: string;
    symbol: string;
  };
  language: string;
  timezone: string;

  // Payment
  paymentMethods: {
    cod: boolean;
    stripe: {
      enabled: boolean;
      publishableKey: string;
    };
    sslcommerz: {
      enabled: boolean;
      storeId: string;
    };
    bKash: {
      enabled: boolean;
      merchantNumber?: string;
    };
    nagad: {
      enabled: boolean;
      merchantNumber?: string;
    };
  };

  // Shipping
  shipping: {
    freeShippingThreshold: number;
    defaultShippingFee: number;
    shippingZones: Array<{
      areaName: string;
      fee: number;
    }>;
  };

  // Tax
  tax: {
    enabled: boolean;
    rate: number;
  };

  // Features
  features: {
    wishlist: boolean;
    productReview: boolean;
    couponSystem: boolean;
    flashSale: boolean;
    multiVendor: boolean;
    blog: boolean;
    bannerSlider: boolean;
    guestOrder: boolean;
  };


  layouts: {
    categorySection: number;
    header: number;
  },

  // Social
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };

  maintenanceMode: boolean;
  maintenanceMessage: string;

  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const appSettingsSchema = new Schema<IAppSettings>(
  {
    siteName: { type: String, required: true, default: "My Ecommerce" },
    siteDescription: { type: String, default: "" },
    logo: { type: String, default: "" },
    footerLogo: { type: String, default: "" },
    favicon: { type: String, default: "" },

    contactEmail: { type: String, required: true },
    contactPhone: { type: String, default: "" },
    address: {
      street: String,
      city: String,
      state: String,
      country: { type: String, default: "Bangladesh" },
      zipCode: String,
    },

    metaTitle: String,
    metaDescription: String,
    ogImage: String,

    currency: {
      code: { type: String, default: "BDT" },
      symbol: { type: String, default: "৳" },
    },
    language: { type: String, default: "bn" },
    timezone: { type: String, default: "Asia/Dhaka" },

    paymentMethods: {
      cod: { type: Boolean, default: true },
      stripe: {
        enabled: { type: Boolean, default: false },
        publishableKey: String,
      },
      sslcommerz: {
        enabled: { type: Boolean, default: false },
        storeId: String,
      },
      bKash: {
        enabled: { type: Boolean, default: false },
        merchantNumber: String,
      },
      nagad: {
        enabled: { type: Boolean, default: false },
        merchantNumber: String,
      },
    },

    layouts: {
      categorySection: {
        type: Number,
        default: 1,
      },
      header: {
        type: Number,
        default: 1,
      }
    },

    shipping: {
      freeShippingThreshold: { type: Number, default: 0 },
      defaultShippingFee: { type: Number, default: 60 },
      shippingZones: [
        {
          areaName: String,
          fee: Number,
        },
      ],
    },

    tax: {
      enabled: { type: Boolean, default: false },
      rate: { type: Number, default: 0 },
    },

    features: {
      wishlist: { type: Boolean, default: true },
      productReview: { type: Boolean, default: true },
      couponSystem: { type: Boolean, default: true },
      flashSale: { type: Boolean, default: true },
      multiVendor: { type: Boolean, default: false },
      blog: { type: Boolean, default: true },
      bannerSlider: { type: Boolean, default: true },
      guestOrder: { type: Boolean, default: true },
    },

    socialLinks: {
      facebook: String,
      instagram: String,
      youtube: String,
      tiktok: String,
    },

    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: "Website is under maintenance." },

    updatedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);


const AppSetting: Model<IAppSettings> =
  mongoose.models.AppSetting || mongoose.model("AppSetting", appSettingsSchema);

export default AppSetting;