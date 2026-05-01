import { IBrandBase } from "@/redux/service/brand/type";
import mongoose, { Schema, Model, Document } from "mongoose";

// =======================
// TypeScript interface
// =======================
export interface IBrand extends IBrandBase, Document {
  isDelete: boolean;
}

// =======================
// Schema
// =======================
const brandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    description: {type:String},
    logo: {
      type: String,
    },
    banner: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true
    },
    priority: Number,
    isDelete: {
      type: Boolean,
      default : false,
    }
  },
  { timestamps: true },
);

// =======================
// Hot reload safe for Next.js
// =======================
const Brand: Model<IBrand> =
  mongoose.models && mongoose.models.Brand
    ? mongoose.models.Brand
    : mongoose.model<IBrand>("Brand", brandSchema);

export default Brand;
