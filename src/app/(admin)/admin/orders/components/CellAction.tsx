"use client";

import { Button } from '@/components/ui/button';
import { Eye, Pen,  Trash2 } from 'lucide-react';
import React, { useState } from 'react';

import { toast } from 'sonner';

import DeleteAlert from '@/components/shared/DeleteAlert';
import { useRouter } from 'next/navigation';
import { IOrder } from '@/redux/service/orders/type';
import Link from 'next/link';
import { useDeleteOrderMutation } from '@/redux/service/orders';

type Props = {
  data: IOrder;
};

const CellAction = ({ data }: Props) => {
  const router = useRouter()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteProduct, { isLoading: deleteLoading }] = useDeleteOrderMutation();


  const handleEditAndRestore = () => {

    router.push(`/admin/order/${data?._id}?mode=edit`)

  }


  const handleDelete = async () => {
    try {
      await deleteProduct(data?._id).unwrap();
      toast.success("Deleted successfully");
      setIsDeleteOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  }

  return (
    <div className="flex justify-end items-center gap-2">
      {/* <Switch checked={data.status} /> */}


      <Link href={`/admin/order/${data?._id}`}>
        <Button
          size="icon"
          variant="outline"

        >
          <Eye />
        </Button>
      </Link>

      {/* EDIT */}
      <Button
        size="icon"
        variant="outline"
        type="button"
        onClick={() => handleEditAndRestore()}

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
        text={"This order will be moved to trash. You can not restore it later"}
        deleteType={data?.invoiceNumber}
      />



    </div>
  );
};

export default CellAction;