import { Category } from "@/models/categories";
import mongoose from "mongoose";

export async function getAllDescendantIds(categoryId: string): Promise<mongoose.Types.ObjectId[]> {
  const allCategories = await Category.find({ isDelete: false, status: true })
    .select("_id parentId")
    .lean();

  const result: mongoose.Types.ObjectId[] = [];
  const queue: string[] = [categoryId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    result.push(new mongoose.Types.ObjectId(current));

    // এই node এর direct children খোঁজো
    const children = allCategories.filter(
      (c) => c.parentId?.toString() === current
    );
    children.forEach((c) => queue.push(c._id.toString()));
  }

  return result;
}