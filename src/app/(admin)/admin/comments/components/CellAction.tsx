"use client";

import { Button } from '@/components/ui/button';
import { Pen,  Trash2 } from 'lucide-react';
import  { useState } from 'react';
import { useDeleteBrandMutation,  } from '@/redux/service/brand';
import { toast } from 'sonner';


import DeleteAlert from '@/components/shared/DeleteAlert';
import { IComment } from '@/redux/service/comments/type';
import CommentForm from './CommentForm';

type Props = {
  data: IComment;
};

const CellAction = ({ data }: Props) => {

  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteBrand, { isLoading: deleteLoading }] = useDeleteBrandMutation();


  const handleDelete = async () => {
    try {
      await deleteBrand(data?._id).unwrap();
      toast.success("Deleted successfully");
      setIsDeleteOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete brand");
    }
  }

  return (
    <div className="flex justify-end items-center gap-2">

      {/* EDIT */}
      <Button
        size="icon"
        variant="outline"
        type="button"
        onClick={() => setIsOpen(true)}

      >
         <Pen />
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
      <DeleteAlert isDeleteOpen={isDeleteOpen} setIsDeleteOpen={setIsDeleteOpen} callBack={handleDelete} isLoading={deleteLoading}
       text={"This brand will be moved to trash. You can restore it later or undo this action anytime."}
       deleteType={data?.userId?.name}
       />

      {/* EDIT MODAL */}
      <CommentForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        previousData={data}
      />
    </div>
  );
};

export default CellAction;