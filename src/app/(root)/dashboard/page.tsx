"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Package,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  Eye,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CURRENCY } from "@/lib/envSecret";
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

export default function Dashboard() {
  // const [orders, setOrders] = useState<TOrder[]>([]);
  const {data:getData} = useGetAdminOrdersQuery(`page=1&limit=10&isDelete=false`)
const orders = getData?.data;
  // const totalCosts = orders?.reduce((accu, cur) => accu + cur.totalAmount, 0);
  // const pendingOrders = orders?.filter((order) => order.status === "Pending");

  const stats = [
    {
      title: "Total Orders",
      value: orders?.length || 0,
      description: "+20.1% last month",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total cost",
      value: `${CURRENCY} 10`,
      description: "+15% last month",
      icon: CreditCard,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pending Orders",
      value:  0,
      description: "Processing is in progress.",
      icon: ShoppingCart,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Savings",
      value: "$0.00",
      description: "From discount",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
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
    <div className="flex-1 space-y-4 px-4 md:px-4 ">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span className="text-sm text-muted-foreground">
            Today - {format(new Date(), "MMM dd, yyyy")}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Orders */}
        <Card className="lg:col-span-4">
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
                        "inline-block text-xs font-semibold px-3 py-[2px] rounded-full border",
                        statusStyles[order.orderStatus]
                      )}
                    >
                      {order.orderStatus}
                    </span>
                    <span className="font-medium">
                      {CURRENCY}
                      {order.pricing?.total}
                    </span>
                    <Link href={`/dashboard/orders/${order?.invoiceNumber}`}>
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

        {/* Quick Actions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>দ্রুত অ্যাকশন</CardTitle>
            <CardDescription>সাধারণ কাজগুলো দ্রুত করুন</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <Package className="mr-2 h-4 w-4" />
              অর্ডার ট্র্যাক করুন
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CreditCard className="mr-2 h-4 w-4" />
              পেমেন্ট হিস্টরি
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <ShoppingCart className="mr-2 h-4 w-4" />
              নতুন অর্ডার করুন
            </Button>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">সাপোর্ট</h4>
              <p className="text-sm text-muted-foreground mb-2">
                কোন সমস্যা? আমাদের সাথে যোগাযোগ করুন
              </p>
              <Button variant="outline" size="sm" className="w-full">
                সাপোর্ট টিমের সাথে চ্যাট
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
