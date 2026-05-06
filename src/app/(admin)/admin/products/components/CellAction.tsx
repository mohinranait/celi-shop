"use client";

import { Button } from '@/components/ui/button';
import { Pen, RotateCcw, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

import { toast } from 'sonner';

import { IProduct } from '@/redux/service/products/type';
import DeleteAlert from '@/components/shared/DeleteAlert';
import { useDeleteProductMutation, useSoftDeleteProductMutation } from '@/redux/service/products';

type Props = {
  data: IProduct;
  type: "active" | "deleted";
};

const CellAction = ({ data, type }: Props) => {

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [softDeleteProduct, { isLoading }] = useSoftDeleteProductMutation();
  const [deleteProduct, { isLoading: deleteLoading }] = useDeleteProductMutation();


  // Soft delete
  const softDelete = async (action: "restore"|"soft"='restore') => {
    try {
      await softDeleteProduct({ id: data._id, payload: { isDelete: true } }).unwrap();
       toast.success( action === 'restore' ? "Restore" :"Delete" + ` successfully`);
      setIsDeleteOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };

  // hard delete
  const hardDelete = async () => {
    try {
      await deleteProduct(data?._id).unwrap();
      toast.success("Deleted successfully");
      setIsDeleteOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
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
      <DeleteAlert isDeleteOpen={isDeleteOpen} setIsDeleteOpen={setIsDeleteOpen} callBack={handleDelete} isLoading={isLoading}
        text={"This product will be moved to trash. You can restore it later or undo this action anytime."}
        deleteType={data?.name}
      />
     

     
    </div>
  );
};

export default CellAction;