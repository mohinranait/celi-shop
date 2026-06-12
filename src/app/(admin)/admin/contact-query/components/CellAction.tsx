"use client";

import { Button } from '@/components/ui/button';
import { Eye, } from 'lucide-react';
import React, { useState } from 'react';
import { IContact } from '@/redux/service/contacts/type';
import ViewContactQuery from './ViewModal';

type Props = {
  data: IContact;

};

const CellAction = ({ data, }: Props) => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-end items-center gap-2">


      {/* View */}
      <Button
        size="icon"
        variant="outline"
        type="button"
        onClick={() => setIsOpen(true)}

      >
        <Eye />
      </Button>


      <ViewContactQuery
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        previousData={data}
      />
    </div>
  );
};

export default CellAction;