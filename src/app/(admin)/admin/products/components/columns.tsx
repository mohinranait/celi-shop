import GetDateFormate from "@/components/shared/GetDateFormate";
import { Badge } from "@/components/ui/badge";

import { ColumnDef } from "@tanstack/react-table";
import { Image as LucidImage } from "lucide-react";
import Image from "next/image";
import CellAction from "./CellAction";
import { IProduct } from "@/redux/service/products/type";
import findProductImage from "@/hooks/useFindProductImage";
import { CURRENCY } from "@/lib/envSecret";
import { showTwoDecimals } from "@/lib/helpers";
import { getPriceRange, getSingleProductPrice } from "@/hooks/useGerPrice";


const tableColumns = ({ type = 'active' }: { type: "active" | "deleted" }) => {
  
  const columns: ColumnDef<IProduct>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const productData = row.original;
        const prodImage = findProductImage({ product: productData });
        return <div className="flex items-center gap-1">
          <div>
            {
              prodImage ?
                <Image width={64} height={64} alt="Product" src={prodImage} className="rounded-md w-10 h-10 " /> :
                <div className="bg-accent w-10 h-10 rounded-md flex items-center justify-center text-foreground"><LucidImage size={16} /></div>
            }
          </div>
          <p>{productData?.name}</p>
        </div>
      }
    },

     {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const productData = row.original;
         const singleProductPrice = getSingleProductPrice(productData);
          const productPrice = getPriceRange(productData);

        const singleProduct = productData.productType === 'single';;
        return singleProduct ? <span>{CURRENCY}{showTwoDecimals(singleProductPrice?.finalPrice || 0)}</span> : <span>{productPrice}</span>
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
      accessorKey: "isFeatured",
      header: "Featured",
      cell: ({ row }) => {
        return <Badge

          className={
            row.original.isFeatured
              ? "bg-green-500/10 text-green-600"
              : "bg-gray-500/10 text-black/60"
          }
        >
          {row.original.isFeatured ? "Featured" : "Not Featured"}
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