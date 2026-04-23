import mongoose, { Schema, Model, Document } from "mongoose";

// =======================
// TypeScript interface
// =======================
export interface IBrand extends Document {
  name: string;
  slug: string;
  status?: "Active" | "Pending" | "Delete";
  priority?: number;
}

// =======================
// Schema
// =======================
const brandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Pending", "Delete"],
    },
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
