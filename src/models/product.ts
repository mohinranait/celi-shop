import mongoose from "mongoose";

const VariationSchema = new mongoose.Schema({
  name: { type: String, required: true }, // "Red / XL"
  
  price: { type: Number, required: true, default: 0 },
  offerPriceFixed: { type: Number }, // discount fixed value
  offerPriceParcent: { type: Number }, // discount % value 
  costPrice: { type: Number }, // profit calculation
  
  sku: { type: String, unique: true, sparse: true },
  barcode: { type: String },

  stock: { type: Number, default: 0 },
  lowStockAlert: { type: Number, default: 5 },

  images: [String],

  attributeConfig: {
    type: Map,
    of: String
    // { Color: "Red", Size: "XL" }
  },

  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },

  isDefault: { type: Boolean, default: false }

}, { _id: false });


const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },

  shortDescription: String,
  description: String,

  // thumbnail + gallery
  thumbnail: String,
  gallery: [String],

  // pricing (for single variant fallback)
  price: Number,
  discountPrice: Number,
  discountParcent: Number,

  // product type
  productType: {
    type: String,
    enum: ["single", "variant"],
    default: "single"
  },

  // attributes (UI select করার জন্য)
  selectedAttributes: [{
    attributeId: String,
    name: { type: String, required: true },
    selectedValues: [String]
  }],

  // variations
  variations: [VariationSchema],

  // category & brand
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },

  // inventory 
  stock: { type: Number, default: 0 },

  trackStock: { type: Boolean, default: true }, // Overall total stock

  // shipping info
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    isFreeShipping: { type: Boolean, default: false }
  },

  // SEO
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },

  // rating summary
  ratings: {
    average: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
  },

  // tags (search/filter)
  tags: [String],

  // flags
  isFeatured: { type: Boolean, default: false },
  isDelete: { type: Boolean, default: false },

  status: {
      type: Boolean,
      default: true
  },

}, { timestamps: true });


// 🔍 Indexing (important for performance)
ProductSchema.index({ name: "text", slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ "variations.sku": 1 });

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;