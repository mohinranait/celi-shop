// components/category/CategoryTree.tsx
"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Pen,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ICategoryTreeNode } from "./BuildTree";
import {
  useDeleteCategoryMutation,
  useSoftDeleteCategoryMutation,
} from "@/redux/service/categories";
import DeleteAlert from "@/components/shared/DeleteAlert";
import CategoryForm from "./CategoryForm";
import handleErrors, { ErrorResponse } from "@/lib/handle-error";

interface CategoryTreeProps {
  data: ICategoryTreeNode[];
  type: "active" | "deleted";
}

export function CategoryTree({ data, type }: CategoryTreeProps) {
  return (
    <div className="rounded-md border bg-card p-2">
      {data.map((node) => (
        <CategoryNode
          key={node._id}
          node={node}
          depth={0}
          type={type}
        />
      ))}
    </div>
  );
}

function CategoryNode({
  node,
  depth,
  type,
}: {
  node: ICategoryTreeNode;
  depth: number;
  type: "active" | "deleted";
}) {
  const [open, setOpen] = useState(depth === 0); // root level expanded by default
  const [isOpen, setIsOpen] = useState(false); // edit modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false); // delete confirm modal

  const hasChildren = node.children.length > 0;

  const [softDeleteCategory, { isLoading }] = useSoftDeleteCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  // Soft delete (move to trash) / restore
  const softDelete = async (isDelete: boolean) => {
    try {
      await softDeleteCategory({
        id: node._id,
        payload: { isDelete },
      }).unwrap();
      toast.success("Successfully");
      setIsDeleteOpen(false);
    } catch (error) {
      console.error(error);
       handleErrors( error as ErrorResponse)
    }
  };

  // Hard delete (permanent)
  const hardDelete = async () => {
    try {
      await deleteCategory(node._id).unwrap();
      toast.success("Deleted successfully");
      setIsDeleteOpen(false);
    } catch (error) {
      console.error(error);
       handleErrors( error as ErrorResponse)
    }
  };

  const handleEditAndRestore = () => {
    if (type === "active") {
      setIsOpen(true);
    } else {
      softDelete(false); // restore from trash
    }
  };

  const handleDelete = () => {
    if (type === "active") {
      softDelete(true); // move to trash
    } else {
      hardDelete(); // permanent delete
    }
  };

  return (
    <div>
      <div
        className="group flex items-center gap-2 rounded-md px-2 py-2 hover:bg-muted/60 transition-colors"
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        {/* Expand/collapse toggle */}
        <button
          type="button"
          onClick={() => hasChildren && setOpen((p) => !p)}
          className={cn(
            "flex cursor-pointer h-5 w-5 items-center justify-center rounded hover:bg-muted shrink-0",
            !hasChildren && "opacity-0 cursor-default"
          )}
        >
          {hasChildren &&
            (open ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
        </button>

        {/* Folder icon */}
        {open && hasChildren ? (
          <FolderOpen size={16} className="text-muted-foreground shrink-0" />
        ) : (
          <Folder size={16} className="text-muted-foreground shrink-0" />
        )}

        {/* Name + slug */}
        <span className="text-sm font-medium truncate">{node.name}</span>
        <span className="text-xs text-muted-foreground truncate">
          /{node.slug}
        </span>

        {/* Product count */}
        <Badge variant="outline" className="text-[10px] shrink-0">
          {node.totalProducts} products
        </Badge>

         <Badge variant={ node.status ? "default": "destructive" } className="text-[10px] shrink-0">
          {node.status ? "Active": "Inactive"}
        </Badge>

        {/* Actions - show on hover */}
        <div className="ml-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">

         

          {/* Edit / Restore */}
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-7 w-7"
            onClick={handleEditAndRestore}
          >
            {type === "active" ? <Pen size={14} /> : <RotateCcw size={14} />}
          </Button>

          {/* Delete */}
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="h-7 w-7"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      {/* Delete confirm modal */}
      <DeleteAlert
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        callBack={handleDelete}
        isLoading={isLoading}
        text={
          type === "active"
            ? "This category will be moved to trash. You can not restore it later or undo this action anytime."
            : "This category will be permanently deleted. This action cannot be undone."
        }
        deleteType={node?.name}
      />

      {/* Edit modal */}
      <CategoryForm isOpen={isOpen} setIsOpen={setIsOpen} previousData={node} />

      {/* Recursive children */}
      {hasChildren && open && (
        <div>
          {node.children.map((child) => (
            <CategoryNode
              key={child._id}
              node={child}
              depth={depth + 1}
              type={type}
            />
          ))}
        </div>
      )}
    </div>
  );
}