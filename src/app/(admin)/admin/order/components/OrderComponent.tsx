"use client";
import {  Home, Undo2, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetOrderByIdAdminQuery } from "@/redux/service/orders";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shared/render-status";
import { CURRENCY } from "@/lib/envSecret";
import OrderStatusSection from "./OrderStatusSection";
import OrderItemTable from "./OrderItemTable";
import { Card } from "@/components/ui/card";
import OrderUpdateForm from "./OrderUpdateForm";


type Props = {
  orderId: string;
};

const OrderComponent = ({ orderId }: Props) => {

  const id = orderId;
  const { data } = useGetOrderByIdAdminQuery(id, { skip: !id })
  const searchParams = useSearchParams();
  const pageMode = searchParams.get("mode");

  const order = data?.data;


  const router = useRouter();

  if (!order) return;

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-3">
        <div className="flex gap-2 items-start">
          <button
            onClick={() => {
              router.back();
            }}
            className="p-1 border-gray-400 border rounded bg-gray-100 "
          >
            <Undo2 />
          </button>
          <div>
            <p className="text-2xl font-semibold text-black uppercase">
              #{order?.invoiceNumber}
            </p>
            <p className="text-sm text-gray-500 font-medium">
              Order Date -{" "}
              {order &&
                format(new Date(order.createdAt), "MMM dd, yyyy hh:mm a")}
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <Button
            size={"sm"}
            variant={"outline"}
            className="bg-red-50 hover:bg-red-50 border border-red-500 text-red-500 hover:text-red-500"
          >
            Delete Order
          </Button>
          <Button
            size={"sm"}
            variant={"outline"}
            className="bg-gray-50 hover:bg-gray-50 border border-black text-black hover:text-black"
          >
            Track Order
          </Button>
          <Link href={`/admin/order/${id}?mode=edit`}>
            <Button type="button" size={"sm"}>
              Edit Order
            </Button>
          </Link>
        </div>
      </div>
      <Card className="p-0">
        <div className="flex flex-wrap  rounded-md shadow">
          <div className="p-4  ">
            <p className="text-gray-600 text-sm ">Order Status</p>
            <p className="text-center">
              <OrderStatusBadge status={order?.orderStatus} />
            </p>
          </div>
          <div className="p-4  ">
            <p className="text-gray-600 text-sm "> Payment Status</p>
            <p className="text-center">
              {" "}
              <PaymentStatusBadge status={order?.payment?.status} />

            </p>
          </div>
          <div className="p-4  ">
            <p className="text-gray-600 text-sm "> Total Amount</p>
            <p className="text-center text-green-600 font-semibold">
              {CURRENCY}
              {order?.pricing?.total}
            </p>
          </div>
          <div className="p-4  ">
            <p className="text-gray-600 text-sm "> Payment Method</p>
            <p className="text-center">{order?.payment?.method}</p>
          </div>

          <div className="p-4  ">
            <p className="text-gray-600 text-sm ">PickUp Point</p>
            <p className="text-center">
              {order?.shippingAddress?.address}
            </p>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 gap-3  lg:grid-cols-3">
        <div className="space-y-3 col-span-2">
          <Card className="p-4 gap-0 rounded-md shadow">
            <div className="flex pb-3 justify-between items-center">
              <div>
                <p className="text-base font-semibold text-accent-foreground">Progress</p>
                <p className="text-sm font-medium text-muted-foreground">
                  Current order status
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-5 bg-muted p-2 rounded gap-2 ">
              {<OrderStatusSection status={order?.orderStatus} />}
            </div>
          </Card>
          <OrderItemTable order={order} />
        </div>
        <div className="col-span-1 space-y-3">
          {pageMode === "edit" && (
            <OrderUpdateForm order={order} />
          )}
          <div className="p-4 bg-white  rounded-md shadow">
            <div className="flex pb-3 justify-between items-center">
              <div>
                <p className="text-base font-semibold text-black">Payment</p>
                <p className="text-sm font-medium text-gray-500">
                  Final payment information
                </p>
              </div>
            </div>
            <div className="bg-gray-100 p-4 space-y-2 rounded-md">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-500">Subtotal</p>
                <p className="text-sm font-semibold text-black">
                  {CURRENCY}
                  {order?.pricing?.subtotal?.toFixed(2)}
                </p>
              </div>
              {order?.pricing?.tax && order?.pricing?.tax > 0 ? (
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-500">Tax</p>
                  <p className="text-sm font-semibold text-black">
                    {CURRENCY}
                    {order?.pricing?.tax?.toFixed(2)}
                  </p>
                </div>
              ) : null}

              {order?.pricing?.shippingCharge > 0 && (
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-500">Shipping</p>
                  <p className="text-sm font-semibold text-black">
                    {CURRENCY}
                    {order?.pricing?.tax?.toFixed(2)}
                  </p>
                </div>
              )}

              <span className="h-px w-full bg-gray-300 inline-block"></span>
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-black">Total</p>
                <p className="text-sm font-semibold text-black">
                  {CURRENCY}
                  {order?.pricing?.total?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white  rounded-md shadow">
            <div className="flex pb-3 justify-between items-center">
              <div>
                <p className="text-base font-semibold text-black">Customer</p>
                <p className="text-sm font-medium text-gray-500">
                  Customer information
                </p>
              </div>
            </div>
            <div className="bg-gray-100 p-2 space-y-3 rounded-md">
              <div className="flex p-3 rounded bg-white items-start gap-2">
                <div>
                  <Home size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">
                    Shipping Address
                  </p>

                  <ul className="list-disc mt-1 space-y-1 list-inside text-sm text-gray-500">
                    <li>
                      {order?.shippingAddress?.fullName}{" "}
                    </li>
                    <li>{order?.shippingAddress?.address}</li>
                    <li>{order?.shippingAddress?.postalCode}</li>
                  </ul>

                </div>
              </div>
              <div className="flex p-3 rounded bg-white items-start gap-2">
                <div>
                  <Home size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">
                    Biling Address
                  </p>
                  <ul className="list-disc mt-1 space-y-1 list-inside text-sm text-gray-500">
                    <li>Same as shipping address</li>
                  </ul>
                </div>
              </div>
              <div className="flex p-3 rounded bg-white items-start gap-2">
                <div>
                  <User size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">
                    General Information
                  </p>
                  <ul className="list-disc mt-1 space-y-1 list-inside text-sm text-gray-500">
                    <li>user@gmail.com</li>
                    <li>+54215411</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderComponent;