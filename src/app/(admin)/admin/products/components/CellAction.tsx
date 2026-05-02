"use client";

import { Button } from '@/components/ui/button';
import { Pen, RotateCcw, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

import { useDeleteBrandMutation, useSoftDeleteBrandMutation } from '@/redux/service/brand';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IProduct } from '@/redux/service/products/type';

type Props = {
  data: IProduct;
  type: "active" | "deleted";
};

const CellAction = ({ data, type }: Props) => {

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [softDeleteBrand, { isLoading }] = useSoftDeleteBrandMutation();
  const [deleteBrand, { isLoading: deleteLoading }] = useDeleteBrandMutation();


  // Soft delete
  const softDelete = async () => {
    try {
      await softDeleteBrand({ id: data._id, payload: { isDelete: true } }).unwrap();
      toast.success("Deleted successfully");
      setIsDeleteOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete brand");
    }
  };

  // hard delete
  const hardDelete = async () => {
    try {
      await deleteBrand(data?._id).unwrap();
      toast.success("Deleted successfully");
      setIsDeleteOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete brand");
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
      {/* <Switch checked={data.status} /> */}

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
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This brand will be moved to trash. You can restore it later or undo this action anytime.
              <span className="font-semibold"> {data.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Yes, Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

     
    </div>
  );
};

export default CellAction;