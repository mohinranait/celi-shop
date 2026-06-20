import mongoose, { Schema, model, Types } from "mongoose";

/* -------------------------------------------------------------------------- */
/*                                ORDER ITEM                                  */
/* -------------------------------------------------------------------------- */

const orderItemSchema = new Schema(
  {
    productId: {
      type: Types.ObjectId,
      ref: "Product",
      required: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    productImage: {
      type: String,
      // required: true,
    },

    productSlug: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      default: "",
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    salePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    selectedVariants: {
      type: Map,
      of: String,
      default: {},
    },

    // product snapshot
    categoryName: {
      type: String,
      default: "",
    },

    brandName: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

/* -------------------------------------------------------------------------- */
/*                            SHIPPING ADDRESS                                */
/* -------------------------------------------------------------------------- */

const shippingAddressSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },


    address: {
      type: String,
      required: true,
    },

    postalCode: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

/* -------------------------------------------------------------------------- */
/*                              PAYMENT INFO                                  */
/* -------------------------------------------------------------------------- */

const paymentSchema = new Schema(
  {
    method: {
      type: String,
      enum: ["COD", "BKASH", "NAGAD", "CARD", "STRIPE"],
      default: "COD",
    },

    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING",
    },

    transactionId: {
      type: String,
      default: "",
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  }
);

/* -------------------------------------------------------------------------- */
/*                               ORDER SCHEMA                                 */
/* -------------------------------------------------------------------------- */

const orderSchema = new Schema(
  {
    /* ------------------------------- USER -------------------------------- */

    userId: {
      type: Types.ObjectId,
      ref: "User",
      default: null, 
    },

    /* ------------------------------- ITEMS ------------------------------- */

    items: {
      type: [orderItemSchema],
      required: true,
    },

    totalItems: {
      type: Number,
      required: true,
      min: 1,
    },

    totalQuantity: {
      type: Number,
      required: true,
      min: 1,
    },

    /* ------------------------------ PRICING ------------------------------ */

    pricing: {
      subtotal: {
        type: Number,
        required: true,
        min: 0,
      },

      discount: {
        type: Number,
        default: 0,
      },

      shippingCharge: {
        type: Number,
        default: 0,
      },

      tax: {
        type: Number,
        default: 0,
      },

      total: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    /* ------------------------------ COUPON ------------------------------- */

    coupon: {
      code: {
        type: String,
        default: "",
      },

      discountAmount: {
        type: Number,
        default: 0,
      },
    },

    /* -------------------------- SHIPPING INFO ---------------------------- */

    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    /* ------------------------------ PAYMENT ------------------------------ */

    payment: {
      type: paymentSchema,
      required: true,
    },

    /* --------------------------- ORDER STATUS ---------------------------- */

    orderStatus: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
        "RETURNED",
      ],
      default: "PENDING",
    },

    /* ------------------------------ TRACKING ----------------------------- */

    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },

    trackingNumber: {
      type: String,
      default: "",
    },

    courierName: {
      type: String,
      default: "",
    },

    estimatedDeliveryDate: {
      type: Date,
      default: null,
    },

    /* ------------------------------ NOTES -------------------------------- */

    customerNote: {
      type: String,
      default: "",
    },

    adminNote: {
      type: String,
      default: "",
    },

    /* ---------------------------- TIMESTAMPS ----------------------------- */

    deliveredAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    /* ---------------------------- SOFT DELETE ---------------------------- */

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/* -------------------------------------------------------------------------- */
/*                                  INDEXES                                   */
/* -------------------------------------------------------------------------- */

orderSchema.index({ userId: 1 });

orderSchema.index({ orderStatus: 1 });

orderSchema.index({ createdAt: -1 });

orderSchema.index({ invoiceNumber: 1 });

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */



const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;