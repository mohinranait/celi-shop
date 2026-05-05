"use client";

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Pen, RotateCcw, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';


import { ICategory } from '@/redux/service/categories/type';
import CategoryForm from './CategoryForm';
import { useDeleteCategoryMutation, useSoftDeleteCategoryMutation } from '@/redux/service/categories';
import DeleteAlert from '@/components/shared/DeleteAlert';

type Props = {
  data: ICategory;
  type: "active" | "deleted";
};

const CellAction = ({ data, type }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [softDeleteCategory, { isLoading }] = useSoftDeleteCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();



  // Soft delete
  const softDelete = async () => {
    try {
      await softDeleteCategory({ id: data._id, payload: { isDelete: true } }).unwrap();
      toast.success("Successfully");
      setIsDeleteOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete category");
    }
  };

  // hard delete
  const hardDelete = async () => {
    try {
      await deleteCategory(data?._id).unwrap();
      toast.success("Deleted successfully");
      setIsDeleteOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete category");
    }
  };



  const handleEditAndRestore = () => {
    if (type === 'active') {
      setIsOpen(true)
    } else {
      softDelete()
    }
  }


  const handleDelete = () => {
    if (type === 'active') {
      softDelete()
    } else {
      hardDelete()
    }
  }

  return (
    <div className="flex justify-end items-center gap-2">
      <Switch checked={data.status} />

      {/* EDIT */}
      <Button
        size="icon"
        variant="outline"
        type="button"
        onClick={() => handleEditAndRestore()}

      >
        {
          type === 'active' ? <Pen /> :
            <RotateCcw />
        }
      </Button>

      {/* DELETE BUTTON */}
      <Button
        size="icon"
        variant="destructive"
        onClick={() => setIsDeleteOpen(true)}
      >
        <Trash2 />
      </Button>

      {/* DELETE CONFIRM MODAL (STATE CONTROLLED) */}
      <DeleteAlert isDeleteOpen={isDeleteOpen} setIsDeleteOpen={setIsDeleteOpen} callBack={handleDelete} isLoading={isLoading}
        text={"This category will be moved to trash. You can restore it later or undo this action anytime."}
        deleteType={data?.name}
      />



      {/* EDIT MODAL */}
      <CategoryForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        previousData={data}
      />
    </div>
  );
};

export default CellAction;