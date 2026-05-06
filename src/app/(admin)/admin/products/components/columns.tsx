import GetDateFormate from "@/components/shared/GetDateFormate";
import { Badge } from "@/components/ui/badge";

import { ColumnDef } from "@tanstack/react-table";
import { Image as LucidImage } from "lucide-react";
import Image from "next/image";
import CellAction from "./CellAction";
import { IProduct } from "@/redux/service/products/type";


const tableColumns = ({ type = 'active' }: { type: "active" | "deleted" }) => {
  const columns: ColumnDef<IProduct>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const productData = row.original;
        return <div className="flex items-center gap-1">
          <div>
            {
              productData?.logo ?
                <Image width={64} height={64} alt="Product" src={productData?.logo} className="rounded-md w-10 h-10 " /> :
                <div className="bg-accent w-10 h-10 rounded-md flex items-center justify-center text-foreground"><LucidImage size={16} /></div>
            }
          </div>
          <p>{productData?.name}</p>
        </div>
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return <Badge
          className={
            row.original.status
              ? "bg-green-500/10 text-green-600"
              : "bg-red-500/10 text-red-600"
          }
        >
          {row.original.status ? "Active" : "Inactive"}
        </Badge>
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
      cell: ({ row }) => <CellAction data={row.original} type={type} />,
    },
  ];
  return columns;
}

export default tableColumns;