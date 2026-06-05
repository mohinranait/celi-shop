"use client";
import {
  Calendar,
  MoreHorizontal,
  Eye,
  Archive,
  Download,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ShoppingCart,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useGetAdminOrdersQuery } from "@/redux/service/orders";
import { TOrderStatus } from "@/redux/service/orders/type";
const statusStyles: Record<TOrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  PROCESSING: "bg-blue-100 text-blue-800 border-blue-300",
  SHIPPED: "bg-purple-100 text-purple-800 border-purple-300",
  DELIVERED: "bg-green-100 text-green-800 border-green-300",
  CANCELLED: "bg-red-100 text-red-800 border-red-300",
  RETURNED: "bg-sky-100 text-sky-800 border-sky-300",
  CONFIRMED: "bg-sky-100 text-sky-800 border-sky-300",
};

export default function MyOrders() {
  // const [orders, setOrders] = useState<TOrder[]>([]);
   const {data:getData} = useGetAdminOrdersQuery(`page=1&limit=10&isDelete=false`)
  const orders = getData?.data;

  // const pendingOrders = orders?.filter((order) => order.status === "Pending");
  // const processingOrders = orders?.filter(
  //   (order) => order.status === "Processing"
  // );
  // const shippedOrders = orders?.filter((order) => order.status === "Shipped");
  // const deliveredOrders = orders?.filter(
  //   (order) => order.status === "Delivered"
  // );
  // const cancelledOrders = orders?.filter(
  //   (order) => order.status === "Cancelled"
  // );

  const orderStats = [
    {
      id: "total",
      label: "Total Orders",
      count: 0,
      icon: <ShoppingCart className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "pending",
      label: "Pending Orders",
      count:  0,
      icon: <Clock className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      status: "Pending",
    },
    {
      id: "processing",
      label: "Processing Orders",
      count:  0,
      icon: <Package className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      status: "Processing",
    },
    {
      id: "shipped",
      label: "Shipped Orders",
      count:  0,
      icon: <Truck className="h-5 w-5" />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      status: "Shipped",
    },
    {
      id: "delivered",
      label: "Delivered Orders",
      count:  0,
      icon: <CheckCircle className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
      status: "Delivered",
    },
    {
      id: "cancelled",
      label: "Cancelled Orders",
      count: 0,
      icon: <XCircle className="h-5 w-5" />,
      color: "text-red-600",
      bgColor: "bg-red-50",
      status: "Cancelled",
    },
  ];

  // const getAllOrders = async () => {
  //   try {
  //     const response = await getAllOrdersByAuthUser();
  //     console.log({ response });
  //     setOrders(response?.payload?.orders || []);
  //   } catch (error) {
  //     console.error("Error fetching orders:", error);
  //   }
  // };

  // useEffect(() => {
  //   if (typeof window === "undefined") return;
  //   getAllOrders();
  // }, []);

  return (
    <div className=" mx-auto px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">Manage your orders</p>
        </div>
        <Button className="flex items-center gap-2">Tracking Order</Button>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
        {orderStats?.map((order, index) => (
          <Card
            key={index}
            className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center space-x-3">
                  <div className={`p-2 rounded-lg ${order.bgColor}`}>
                    <div className={order.color}>{order.icon}</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {order.label}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">
                    {order.count}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
                <Button variant="outline" size="sm">
                  Invoice
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Download Invoice
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Archive className="h-4 w-4 mr-2" />
                      Archive Order
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <Separator />
            <div className="flex flex-wrap justify-between items-center">
              <p className="text-gray-500 text-sm uppercase">
                Invoice ID: {order?.invoiceNumber}
              </p>
              <p className="text-gray-500 text-sm uppercase">
                Tracking: {order?.invoiceNumber}
              </p>
            </div>
          </CardHeader>

          
          <CardFooter className="py-2 justify-between  px-3 ">
            <div className="flex items-center gap-2 ">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 " />
                Download Invoice
              </Button>
            </div>
            {order?.payment?.method === "COD" &&
              order?.payment.status !== "PAID" && (
                <div className="flex items-center gap-2 ">
                  <Button variant="outline" size="sm">
                    <Banknote className="h-4 w-4 " />
                    Payment
                  </Button>
                </div>
              )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
