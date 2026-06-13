
import { IBaseComment } from "@/redux/service/comments/type";
import mongoose, { Schema, Model, Document, Types } from "mongoose";

// =======================
// TypeScript interface
// =======================
export interface IComment extends IBaseComment, Document {
  productId: Types.ObjectId,
  userId: Types.ObjectId,
}

// =======================
// Schema
// =======================
const commentSchema = new Schema<IComment>(
  {
    productId: { type: Types.ObjectId, ref: 'Product', required: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    isApproved: { type: Boolean, default: true },
    isFeature: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// =======================
// Hot reload safe for Next.js
// =======================
const Comment: Model<IComment> =
  mongoose.models && mongoose.models.Comment
    ? mongoose.models.Comment
    : mongoose.model<IComment>("Comment", commentSchema);

export default Comment;
