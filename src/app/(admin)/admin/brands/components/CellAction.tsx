"use client";

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { IBrand } from '@/redux/service/brand/type';
import { Pen, RotateCcw, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import BrandForm from './BrandForm';
import { useDeleteBrandMutation, useSoftDeleteBrandMutation } from '@/redux/service/brand';
import { toast } from 'sonner';


import DeleteAlert from '@/components/shared/DeleteAlert';

type Props = {
  data: IBrand;
  type: "active" | "deleted";
};

const CellAction = ({ data, type }: Props) => {

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [softDeleteBrand, { isLoading }] = useSoftDeleteBrandMutation();
  const [deleteBrand, { isLoading: deleteLoading }] = useDeleteBrandMutation();


  // Soft delete
  const softDelete = async (action: "restore" | "soft" = 'restore') => {
    try {
      await softDeleteBrand({ id: data._id, payload: { isDelete: true } }).unwrap();
      toast.success(action === 'restore' ? "Restore" : "Delete" + ` successfully`);
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
      softDelete("restore")
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
       text={"This brand will be moved to trash. You can restore it later or undo this action anytime."}
       deleteType={data?.name}
       />

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