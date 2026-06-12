import GetDateFormate from "@/components/shared/GetDateFormate";
import CellAction from "./CellAction";
import { ColumnDef } from "@tanstack/react-table";
import { IContact } from "@/redux/service/contacts/type";

export const columns: ColumnDef<IContact>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
    cell: ({ row }) => {
      const { fullName } = row.original;
      return <div className="flex items-center gap-1">
        <p>{fullName}</p>
      </div>
    }
  },

  {
    accessorKey: "email",
    header: "Email",

  },

  {
    accessorKey: "phone",
    header: "Phone",

  },
  {
    accessorKey: "orderNumber",
    header: "Order Number",

  },
  {
    header: "Apply Date",
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



