"use client";

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { IBrand } from '@/redux/service/brand/type';
import { Pen, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import BrandForm from './BrandForm';
import {  useSoftDeleteBrandMutation } from '@/redux/service/brand';
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

type Props = {
  data: IBrand;
};

const CellAction = ({ data }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [deleteBrand, { isLoading }] = useSoftDeleteBrandMutation();

  const handleDelete = async () => {
    try {
      await deleteBrand({id:data._id, payload: {isDelete: true}}).unwrap();
      toast.success("Deleted successfully");
      setIsDeleteOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete brand");
    }
  };

  return (
    <div className="flex justify-end items-center gap-2">
      <Switch checked={data.status} />

      {/* EDIT */}
      <Button
        size="sm"
        variant="outline"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        <Pen />
      </Button>

      {/* DELETE BUTTON */}
      <Button
        size="sm"
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

      {/* EDIT MODAL */}
      <BrandForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        previousData={data}
      />
    </div>
  );
};

export default CellAction;