import mongoose, { Schema, Model, Document } from "mongoose";

// =======================
// TypeScript interface (optional)
// =======================
export interface IFaq extends Document {
  title?: string;
  contents?: string[];
  priority?: number;
  status?: boolean;
}

// =======================
// Schema
// =======================
const faqSchema = new Schema<IFaq>(
  {
    title: { type: String, trim: true },
    contents: { type: [String], default: [] },
    priority: { type: Number, default: 10 },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// =======================
// Hot reload safe for Next.js
// =======================
const Faq: Model<IFaq> = (mongoose.models && mongoose.models.Faq)
  ? mongoose.models.Faq
  : mongoose.model<IFaq>("Faq", faqSchema);

export default Faq;