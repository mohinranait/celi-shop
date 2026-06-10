"use client";
import {
  Calendar,
  Eye,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Card,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useGetClientOrdersQuery } from "@/redux/service/orders";
import Pagination from "@/components/shared/Pagination";
import { useState } from "react";
import Analytics from "./components/Analytics";
import { statusStyles } from "@/components/shared/renderStatus";


export default function MyOrders() {

  const [pagination, setPagination] = useState({ page: 1, limit: 15 })
  const { data: getData } = useGetClientOrdersQuery(`page=${pagination?.page}&limit=${pagination?.limit}`)
  const orders = getData?.data;
  const meta = getData?.meta;

  return (
    <div className=" mx-auto px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">Manage your orders</p>
        </div>
        <Button disabled className="flex items-center gap-2">Tracking Order</Button>
      </div>

      <Analytics />

      {orders && orders.map((order, orderIndex) => (
        <Card key={orderIndex} className="w-full gap-0 p-0  bg-white">
          <CardHeader className="pb-4 py-3 px-3 bg-slate-100 rounded-t-md">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex flex-wrap items-start gap-4">
                <div>
                  <p className="uppercase text-xs text-gray-500 ">
                    Place Order
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">
                      {" "}
                      {format(
                        new Date(order.createdAt),
                        "dd MMM yyyy, hh:mm a"
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="uppercase text-xs text-gray-500 ">
                    Total Amount
                  </p>
                  <div className=" font-semibold">${order.pricing?.total}</div>
                </div>
                <div>
                  <p className="uppercase text-xs text-gray-500 ">
                    Order Status
                  </p>
                  <span
                    className={cn(
                      "inline-block text-xs font-semibold px-3 py-0.5 rounded-full border",
                      statusStyles[order.orderStatus]
                    )}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/dashboard/orders/${order?._id}`}>
                  <Button type="button" variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </Link>

              </div>
            </div>
            <Separator />
            <div className="flex flex-wrap pt-2 justify-between items-center">
              <p className="text-gray-500 text-sm uppercase">
                Invoice ID: {order?.invoiceNumber}
              </p>
              <p className="text-gray-500 text-sm uppercase">
                Tracking: {order?.invoiceNumber}
              </p>
            </div>
          </CardHeader>


          <CardFooter className="py-2 justify-between  px-3 ">

            {order?.payment?.method === "COD" &&
              order?.payment.status !== "PAID" && (
                <div className="flex items-center gap-2 ">
                  <Button variant="outline" type="button" size="sm">
                    <Banknote className="h-4 w-4 " />
                    Payment
                  </Button>
                </div>
              )}
            <div>{order?.totalItems} items</div>
          </CardFooter>
        </Card>
      ))}

      <div>
        <Pagination
          page={meta?.page || 1}
          totalPages={meta?.totalPages || 1}
          onPageChange={(page) =>
            setPagination((prev) => ({
              ...prev,
              page,
            }))
          }
        />
      </div>
    </div>
  );
}
