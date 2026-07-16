import GetDateFormate from "@/components/shared/GetDateFormate";
import CellAction from "./CellAction";
import { ColumnDef } from "@tanstack/react-table";
import { Image as LucidImage } from "lucide-react";
import Image from "next/image";
import { IRequestQuote } from "@/redux/service/request-quote/type";



export const columns: ColumnDef<IRequestQuote>[] = [
  {
    accessorKey: "productId",
    header: "Product",
    cell: ({ row }) => {
      const { productId } = row.original;
      return productId ? <div className="flex items-center gap-1">
        <div>
          {
            productId?.gallery[0] ?
              <Image width={64} height={64} alt="Brand" src={productId?.gallery[0]} className="rounded-md w-10 h-10 " /> :
              <div className="bg-accent w-10 h-10 rounded-md flex items-center justify-center text-foreground"><LucidImage size={16} /></div>
          }
        </div>
        <p>{productId?.name}</p>
      </div> : <div>No Product Selected</div>
    }
  },
  {
    accessorKey: "request",
    header: "Full Name",
    cell: ({ row }) => {
      return <p>{row.original?.request?.name}</p>
    }
  },
  {
    accessorKey: "request",
    header: "Phone Number",
    cell: ({ row }) => {
      return <p>{row.original?.request?.phone || "--"}</p>
    }
  },
  {
    accessorKey: "request",
    header: "WhatsApp Number",
    cell: ({ row }) => {
      return <p>{row.original?.request?.whatsappNumber || "--"}</p>
    }
  },

  {
    accessorKey: "quantity",
    header: "R. Quantity",
    cell: ({ row }) => {
      return <p>{row.original?.quantity}</p>
    }
  },

  {
    header: "Date",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      return <GetDateFormate date={row.original.createdAt} />
    }
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    enableSorting: false,
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
