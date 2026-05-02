import React from 'react'
import { format } from "date-fns";
type Props = {
  date: string;
}
const GetDateFormate = ({date}:Props) => {
  return (
    <div>
      {format(new Date(date), "dd MMM, yyyy")}
    </div>
  )
}

export default GetDateFormate