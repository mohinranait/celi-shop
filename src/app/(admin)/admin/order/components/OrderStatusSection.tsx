
import { TOrderStatus } from "@/redux/service/orders/type";
import React from "react";

type Props = {
  status: TOrderStatus;
};
const OrderStatusSection = ({ status = "PENDING" }: Props) => {
  const orderStatusArr = [
    {
      _id: "1",
      label: "PENDING",
      title: "Pending",
    },
    {
      _id: "2",
      label: "PROCESSING",
      title: "Processing",
    },
    {
      _id: "3",
      label: "SHIPPED",
      title: "Shipped",
    },
    {
      _id: "4",
      label: "DELIVERED",
      title: "Delivered",
    },
    {
      _id: "5",
      label: "CANCELLED",
      title: "Cancelled",
    },
    {
      _id: "6",
      label: "RETURNED",
      title: "Returned",
    },
  ];

  return (
    <>
      {orderStatusArr?.map((card, i) => {
        const index = orderStatusArr?.findIndex(
          (item) => item.label === status
        );
        return (
          <div
            key={i}
            className={`bg-background flex  rounded p-4 flex-col gap-2 items-center `}
          >
            <div
              className={`flex items-center justify-center w-9 h-9  rounded-full ${
                index >= i
                  ? "bg-accent-foreground text-accent"
                  : "bg-muted text-"
              } `}
            >
              <p className="text-lg font-semibold ">{i + 1}</p>
            </div>
            <div className="flex-1">
              <p
                className={`text-sm text-center font-medium ${
                  index >= i ? "text-accent-foreground" : "text-gray-500"
                }`}
              >
                {card?.title}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default OrderStatusSection;