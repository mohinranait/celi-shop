
import { IBaseCategory } from '@/redux/service/categories/type';
import mongoose, { Schema, Document } from 'mongoose';

export interface IDCategory extends IBaseCategory , Document {
  isDelete: boolean;
}

const CategorySchema = new Schema<IDCategory>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  thumbnail: {
    type: String,
  },
  banner: {
    type: String,
  },
  description: { type: String },
  status: {
    type: Boolean,
    default: true
  },
  priority: Number,
  isDelete: {
    type: Boolean,
    default : false,
  }
}, { timestamps: true });

export const Category = mongoose.models.Category || mongoose.model<IDCategory>('Category', CategorySchema);
