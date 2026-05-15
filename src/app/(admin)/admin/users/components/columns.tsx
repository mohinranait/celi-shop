import GetDateFormate from "@/components/shared/GetDateFormate";
import { Badge } from "@/components/ui/badge";
import CellAction from "./CellAction";
import { ColumnDef } from "@tanstack/react-table";
import { IUser } from "@/redux/service/users/type";


const tableColumns = ({ type = 'active' }: { type: "active" | "deleted" }) => {
  const columns: ColumnDef<IUser>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const userData = row.original;
        return <div className="flex items-center gap-1">
          {/* <div>
            {
              brandData?.logo ?
                <Image width={64} height={64} alt="Brand" src={brandData?.logo} className="rounded-md w-10 h-10 " /> :
                <div className="bg-accent w-10 h-10 rounded-md flex items-center justify-center text-foreground"><LucidImage size={16} /></div>
            }
          </div> */}
          <p>{userData?.name}</p>
        </div>
      }
    },
      {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        const userData = row.original;
        return <div className="flex items-center gap-1">
          <p>{userData?.phone}</p>
        </div>
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return <Badge
          className={
            row.original.status === 'Active'
              ? "bg-green-500/10 text-green-600"
              : "bg-red-500/10 text-red-600"
          }
        >
          {row.original.status }
        </Badge>
      }
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        return <Badge
          className={
            row.original.role === 'Admin'
              ? "bg-green-500/10 text-green-600"
              : "bg-red-500/10 text-red-600"
          }
        >
          {row.original.role }
        </Badge>
      }
    },

    {
      header: "Joined",
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