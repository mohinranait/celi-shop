"use client";

import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';


import DeleteAlert from '@/components/shared/DeleteAlert';
import { IRequestQuote } from '@/redux/service/request-quote/type';
import { useDeleteQuoteMutation } from '@/redux/service/request-quote';
import ViewQuotation from './ViewQuotation';

type Props = {
  data: IRequestQuote;
};

const CellAction = ({ data }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [deleteBrand, { isLoading: deleteLoading }] = useDeleteQuoteMutation();




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

        <Eye />

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
        text={"This request will be moved to trash. You can restore it later or undo this action anytime."}
        deleteType={data?.productId?.name}
      />
      <ViewQuotation
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        previousData={data}
      />
    </div>
  );
};

export default CellAction;