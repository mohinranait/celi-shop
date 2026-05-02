import GetDateFormate from "@/components/shared/GetDateFormate";
import { Badge } from "@/components/ui/badge";
import CellAction from "./CellAction";
import { IBrand } from "@/redux/service/brand/type";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export const columns: ColumnDef<IBrand>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({row}) => {
      const brandData = row.original;
      return <div className="flex items-center gap-1">
        <div>
          {
            brandData?.logo ? 
            <Image width={64} height={64} alt="Brand" src={brandData?.logo} className="rounded-md w-10 h-10 " /> :
            <div className="bg-slate-50 w-10 h-10 rounded-md"></div> 
          }
          </div>
          <p>{brandData?.name}</p>
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
    header: () => <div className="text-center">Actions</div>,
    enableSorting: false,
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];