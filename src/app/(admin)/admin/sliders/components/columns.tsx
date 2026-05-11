import GetDateFormate from "@/components/shared/GetDateFormate";
import { Badge } from "@/components/ui/badge";
import CellAction from "./CellAction";
import { ColumnDef } from "@tanstack/react-table";
import { Image as LucidImage } from "lucide-react";
import Image from "next/image";
import { ISlider } from "@/redux/service/sliders/type";


const tableColumns = ({ type = 'active' }: { type: "active" | "deleted" }) => {
  const columns: ColumnDef<ISlider>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const brandData = row.original;
        return <div className="flex items-center gap-1">
          <div>
            {
              brandData?.image ?
                <Image width={64} height={64} alt="Brand" src={brandData?.image} className="rounded-md w-10 h-10 " /> :
                <div className="bg-accent w-10 h-10 rounded-md flex items-center justify-center text-foreground"><LucidImage size={16} /></div>
            }
          </div>
          <p>{brandData?.title}</p>
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