import GetDateFormate from "@/components/shared/GetDateFormate";
import { Badge } from "@/components/ui/badge";
import CellAction from "./CellAction";
import { ColumnDef } from "@tanstack/react-table";

import { IComment } from "@/redux/service/comments/type";



export   const columns: ColumnDef<IComment>[] = [
    {
      accessorKey: "name",
      header: "Commenter Name",
      cell: ({ row }) => {
        const {userId} = row.original;
        return <div className="flex items-center gap-1">
          <div>
           
          </div>
          <p>{userId?.name}</p>
        </div>
      }
    },
     {
      accessorKey: "productId",
      header: "Product",
      cell: ({ row }) => {
        const {productId} = row.original;
        return <div className="flex items-center gap-1 max-w-25">
          <p>{productId?.name}</p>
        </div>
      }
    },
    {
      accessorKey: "isApproved",
      header: "Status",
      cell: ({ row }) => {
        return <Badge
          className={
            row.original.isApproved
              ? "bg-green-500/10 text-green-600"
              : "bg-red-500/10 text-red-600"
          }
        >
          {row.original.isApproved ? "Approved" : "Pending"}
        </Badge>
      }
    },

    {
      accessorKey: "isFeature",
      header: "Feature Comment",
      cell: ({ row }) => {
        return <Badge
          className={
            row.original.isFeature
              ? "bg-green-500/10 text-green-600"
              : "bg-red-500/10 text-red-600"
          }
        >
          {row.original.isApproved ? "Is Feature" : "Not Feature"}
        </Badge>
      }
    },

       {
      header: "Rating",
      accessorKey: "rating",
      cell: ({ row }) => {
        return <p>{row.original?.rating} Star</p>
      }
    },


     {
      accessorKey: "comment",
      header: "Comment",
      cell: ({ row }) => {
        return <p className="max-w-70">{row.original?.comment}</p>
      }
    },

    {
      header: "Date",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        return <GetDateFormate date={row.original.createdAt} className="w-25" />
      }
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      enableSorting: false,
      cell: ({ row }) => <CellAction data={row.original}  />,
    },
  ];

