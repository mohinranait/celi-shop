'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {  useGetClientOrdersQuery } from "@/redux/service/orders";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CURRENCY } from "@/lib/envSecret";
import Link from "next/link";
import { Eye, ShoppingCart } from "lucide-react";
import { statusStyles } from "@/components/shared/renderStatus";

const Orders = () => {
  const { data: getData } = useGetClientOrdersQuery(`page=1&limit=10`)
  const orders = getData?.data;

  return (
     <div className="">
        {/* Recent Orders */}
        <Card className="">
          <CardHeader>
            <CardTitle>Recent orders</CardTitle>
            <CardDescription>List of your recent orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders?.slice(0, 3)?.map((order, index) => (
                <div
                  key={index}
                  className="flex md:items-center flex-col md:flex-row justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium uppercase leading-none">
                      #{order.invoiceNumber}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(order.createdAt),
                        "dd MMM yyyy, hh:mm a"
                      )}{" "}
                      • {order?.items?.length} Items
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={cn(
                        "inline-block text-xs font-semibold px-3 rounded-full border",
                        statusStyles[order.orderStatus]
                      )}
                    >
                      {order.orderStatus}
                    </span>
                    <span className="font-medium">
                      {CURRENCY}
                      {order.pricing?.total}
                    </span>
                    <Link href={`/dashboard/orders/${order?._id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/dashboard/orders">
                <Button variant="outline" className="w-full">
                  See all orders
                  <ShoppingCart className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

      
      </div>
  )
}

export default Orders