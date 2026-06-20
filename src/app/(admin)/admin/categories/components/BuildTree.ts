// lib/buildCategoryTree.ts

import { ICategory } from "@/redux/service/categories/type";


export interface ICategoryTreeNode extends ICategory {
  children: ICategoryTreeNode[];
}

export function buildCategoryTree(
  categories: ICategory[]
): ICategoryTreeNode[] {
  const map = new Map<string, ICategoryTreeNode>();
  const roots: ICategoryTreeNode[] = [];

  // First pass: create map with children array
  categories.forEach((cat) => {
    map.set(cat._id, { ...cat, children: [] });
  });

  // Second pass: attach children to parents
  categories.forEach((cat) => {
    const node = map.get(cat._id)!;
    if (cat.parentId && map.has(cat.parentId)) {
      map.get(cat.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  // Optional: sort by priority or name at every level
  const sortTree = (nodes: ICategoryTreeNode[]) => {
    nodes.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
    nodes.forEach((n) => sortTree(n.children));
  };
  sortTree(roots);

  return roots;
}