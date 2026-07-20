"use client";

import { Button } from '@/components/ui/button';
import { Pen, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';


import DeleteAlert from '@/components/shared/DeleteAlert';
import { IUser } from '@/redux/service/users/type';
import { useDeleteUserMutation } from '@/redux/service/users';
import Link from 'next/link';
import handleErrors, { ErrorResponse } from '@/lib/handle-error';

type Props = {
  data: IUser;
  type: "active" | "deleted";
};

const CellAction = ({ data,  }: Props) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [deleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation();


  // hard delete
  const hardDelete = async () => {
    try {
      await deleteUser(data?._id).unwrap();
      toast.success("Deleted successfully");
      setIsDeleteOpen(false);
    } catch (error) {
      console.error(error);
      handleErrors( error as ErrorResponse)
    }
  };


  const handleDelete = () => {
    hardDelete();

  }

  return (
    <div className="flex justify-end items-center gap-2">

      {/* EDIT */}
      <Link href={`/admin/users/${data?._id}`}>
        <Button
          size="icon"
          variant="outline"
          type="button"

        >
          <Pen />
        </Button></Link>

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
        text={"This user will be moved to delete. You can't restore it later"}
        deleteType={data?.name}
      />

    
    </div>
  );
};

export default CellAction;