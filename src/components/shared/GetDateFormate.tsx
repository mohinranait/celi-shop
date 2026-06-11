import React from 'react'
import { format } from "date-fns";
import { cn } from '@/lib/utils';
type Props = {
  date: string | Date;
  className?: string;
}
const GetDateFormate = ({date,className}:Props) => {
  return (
    <div className={cn('', className)}>
      {format(new Date(date), "dd MMM, yyyy")}
    </div>
  )
}

export default GetDateFormate