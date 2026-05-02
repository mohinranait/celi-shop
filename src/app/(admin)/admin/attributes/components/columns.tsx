import GetDateFormate from "@/components/shared/GetDateFormate";
import { Badge } from "@/components/ui/badge";
import CellAction from "./CellAction";
import { ColumnDef } from "@tanstack/react-table";

import { IAttribute } from "@/redux/service/attributes/type";


const tableColumns = ({ type = 'active' }: { type: "active" | "deleted" }) => {
  const columns: ColumnDef<IAttribute>[] = [
    {
      accessorKey: "displayName",
      header: "Name",
      cell: ({ row }) => {
        const brandData = row.original;
        return <div className="flex items-center gap-1">
          <p>{brandData?.displayName}</p>
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