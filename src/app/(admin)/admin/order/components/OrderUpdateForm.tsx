
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import handleErrors, { ErrorResponse } from "@/lib/handle-error";
import { useUpdateOrderByIdAdminMutation } from "@/redux/service/orders";

import { IOrder, TOrderStatus, TPaymentStatus } from "@/redux/service/orders/type";

import { useState } from "react";
import { toast } from "sonner";


export type IOrderUpdaeView = {
  orderStatus: TOrderStatus;
  payment: {
    status: TPaymentStatus
  }
}

type TOrderUpdateFormProps = {
  order?: IOrder;
};
const OrderUpdateForm = ({ order }: TOrderUpdateFormProps) => {
  const [updateOrder] = useUpdateOrderByIdAdminMutation()


  const [form, setForm] = useState<IOrderUpdaeView>({
    orderStatus: order?.orderStatus as TOrderStatus,
    payment: {
      status: order?.payment?.status as TPaymentStatus,
    }
  });




  // Update order by ID
  const handleUpdateOrder = async () => {

    try {
      if (!order?._id) return;
      await updateOrder({ payload: form, id: order?._id }).unwrap()

      // setForm({
      //   orderStatus: order?.orderStatus as TOrderStatus,
      //   payment: {
      //     status: order?.payment?.status as TPaymentStatus,
      //   }
      // });

      toast.success("Order Updated");

    } catch (error) {
      console.log(error);
        handleErrors( error as ErrorResponse)
    }
  };

  return (
    <form className="p-4 bg-white rounded-md shadow">
      <div className="flex pb-3 justify-between items-center">
        <div>
          <p className="text-base font-semibold text-black">Manage Order</p>
          <p className="text-sm font-medium text-gray-500">
            Manage order status
          </p>
        </div>
        <Button type="button" onClick={handleUpdateOrder} size={"sm"}>
          Update Order
        </Button>
      </div>
      <div className=" bg-gray-100 p-2 space-y-2 rounded gap-2 ">
        <div className="flex items-cener">
          <label
            htmlFor="OrderStatus"
            className="min-w-27.5 inline-block text-gray-600 text-sm"
          >
            Order Status
          </label>

          <Select
            key={form?.orderStatus}
            value={form?.orderStatus}
            onValueChange={(e: TOrderStatus) =>
              setForm((prev) => ({
                ...prev,
                orderStatus: e as TOrderStatus,
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Order Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="RETURNED">Returned</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-cener">
          <label
            htmlFor="OrderStatus"
            className="min-w-27.5 inline-block text-gray-600 text-sm"
          >
            Payment Status
          </label>

          <Select
            key={form?.payment.status}
            value={form?.payment.status}
            onValueChange={(e: TPaymentStatus) =>
              setForm((prev) => ({
                ...prev!,
                payment:{
                  status: e
                }
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Un Paid</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </form>
  );
};

export default OrderUpdateForm;