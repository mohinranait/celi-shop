"use client";

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Pen, RotateCcw, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

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
import { IAttribute } from '@/redux/service/attributes/type';
import AttributeForm from './AttributeForm';
import { useDeleteAttributeMutation, useSoftDeleteAttributeMutation } from '@/redux/service/attributes';

type Props = {
  data: IAttribute;
  type: "active" | "deleted";
};

const CellAction = ({ data, type }: Props) => {

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [softDeleteAction, { isLoading }] = useSoftDeleteAttributeMutation();
  const [hardDeleteAction, { isLoading: deleteLoading }] = useDeleteAttributeMutation();


  // Soft delete
  const softDelete = async () => {
    try {
      await softDeleteAction({ id: data._id, payload: { isDelete: true } }).unwrap();
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
      await hardDeleteAction(data?._id).unwrap();
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
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This attribute will be moved to trash. You can restore it later or undo this action anytime.
              <span className="font-semibold"> {data.displayName}</span>.
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
      <AttributeForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        previousData={data}
      />
    </div>
  );
};

export default CellAction;