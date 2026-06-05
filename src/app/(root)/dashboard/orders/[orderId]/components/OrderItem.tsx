import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CURRENCY } from "@/lib/envSecret";
import {  IOrderItem } from "@/redux/service/orders/type";
import { Eye, MessageSquareText, RotateCcw } from "lucide-react";
import Image from "next/image";
import React from "react";

type Props = {
  item: IOrderItem;
};
const OrderItem = ({ item }: Props) => {

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Image
            src={item?.productImage || "/placeholder.svg"}
            alt={item.productName}
            width={64}
            height={64}
            className="w-16 h-16 object-cover rounded-md border"
          />
          <Badge
            className="absolute -top-2 -right-2 bg-main text-white text-xs px-2 py-1 rounded-full"
            variant="secondary"
          >
            Qty: {item.quantity}
          </Badge>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">{item.productName}</h3>
          <p className="text-lg font-bold text-main">
            {CURRENCY}
            {item.salePrice}
          </p>
          <p className="text-xs text-muted-foreground">
            Total: {CURRENCY}
            {(item.salePrice * item.quantity).toFixed(2)}
          </p>

          {item?.selectedVariants && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {Object.keys(
                item?.selectedVariants || {}
              ).map((key, index, array) => (
                <span
                  key={key}
                  className="capitalize"
                >
                  {key}:{" "}
                  {
                    item.selectedVariants &&
                    item.selectedVariants[key]
                  }

                  {index !== array.length - 1 &&
                    " • "}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>

      <div className="flex mt-3 sm:mt-0 items-center gap-2">
       
        <Button
          // onClick={() => viewProductByModal(item?.product)}
          type="button"
          title="View Item"
          variant="outline"
          size="sm"
        >
          <Eye className="h-4 w-4 mr-1" />
        </Button>
        <Button
          // onClick={() => {
          //   dispatch(
          //     setCommentModal({
          //       name: item?.name,
          //       pId: item?.product,
          //       image: item?.image,
          //     })
          //   );
          // }}
          title="Review"
          variant="outline"
          size="sm"
        >
          <MessageSquareText className="h-4 w-4 mr-1" />
        </Button>
      </div>
    </div>
  );
};

export default OrderItem;
