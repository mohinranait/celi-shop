import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  
 
  selectedAttributes: [{
    name: { type: String, required: true },
    selectedValues: [String]
  }],

  variations: [{
    name: { type: String, required: true }, // "Red / XL" স্টাইলে থাকবে
    price: { type: Number, required: true, default: 0 },
    sku: { type: String, unique: true, sparse: true },
    stock: { type: Number, default: 0 },
    images: [String], 
    
    attributeConfig: {
      type: Map,
      of: String
      // { "Color": "Red", "Size": "XL" }
    },

  }],


  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  isDelete: Boolean,
  status: { 
    type: String, 
    enum: ['draft', 'active', 'out-of-stock'], 
    default: 'draft' 
  }
}, { timestamps: true });


ProductSchema.index({ name: 'text', 'variations.sku': 1 });

const Product =  mongoose.models.Product || mongoose.model('Product', ProductSchema);
export default Product;
