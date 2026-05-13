import GetDateFormate from "@/components/shared/GetDateFormate";
import { Badge } from "@/components/ui/badge";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";
import { IOrder } from "@/redux/service/orders/type";
import { OrderStatusBadge } from "@/components/shared/render-status";
import { CURRENCY } from "@/lib/envSecret";


const tableColumns = ({ type = 'active' }: { type: "active" | "deleted" }) => {
  const columns: ColumnDef<IOrder>[] = [
    {
      accessorKey: "invoiceNumber",
      header: "Invoice",
      cell: ({ row }) => {
        return <Badge
          variant={'outline'}
        >
          #{row.original.invoiceNumber}
        </Badge>
      }
    },
     {
      accessorKey: "trackingNumber",
      header: "Tracking No",
      cell: ({ row }) => {
        return <Badge
          variant={'outline'}
        >
          #{row.original.trackingNumber}
        </Badge>
      }
    },
     {
      accessorKey: "pricing.total",
      header: "Total Price",
      cell: ({ row }) => {
        return <span>{CURRENCY} {row?.original?.pricing?.total}</span>
      }
    },
     {
      accessorKey: "payment.method",
      header: "Method",
      cell: ({ row }) => {
        const method = row?.original?.payment.method;
        return <div> 
          <p>{method}</p>
          <Badge variant={"outline"}>T. ID: {method === 'BKASH' || method === 'NAGAD' && row?.original?.payment?.transactionId || '--'}</Badge>
        </div>
      }
    },
     {
      accessorKey: "totalItems",
      header: "Quantity",
      cell: ({ row }) => {
        return <div className="flex flex-col">
          <span> {row?.original?.totalItems} items</span>
          <span> {row?.original?.totalQuantity} Qty</span>
        </div>
      }
    },
    {
      accessorKey: "orderStatus",
      header: "Status",
      cell: ({ row }) => {
        return <OrderStatusBadge status={row?.original?.orderStatus} />
      }
    },

    {
      header: "Date",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        return <GetDateFormate date={row.original.createdAt && row.original.createdAt } />
      }
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      enableSorting: false,
      cell: ({ row }) => <CellAction data={row.original} type={type} />,
    },
  ];
  return columns;
}

export default tableColumns;