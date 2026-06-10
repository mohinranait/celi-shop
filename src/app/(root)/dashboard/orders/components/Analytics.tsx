"use client";
import {

  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ShoppingCart,
} from "lucide-react";

import { Card, CardContent } from '@/components/ui/card'
import { useGetDashboardAnalyticsQuery } from "@/redux/client/dashboard";

const Analytics = () => {
  const { data: getAnalaytics } = useGetDashboardAnalyticsQuery(``)
  const analaytics = getAnalaytics?.data;

  const orderStats = [
    {
      id: "total",
      label: "Total Orders",
      count: analaytics?.totalOrders || 0,
      icon: <ShoppingCart className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "pending",
      label: "Pending Orders",
      count: analaytics?.ordersByStatus?.PENDING || 0,
      icon: <Clock className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      status: "Pending",
    },
    {
      id: "processing",
      label: "Processing Orders",
      count: analaytics?.ordersByStatus?.PROCESSING || 0,
      icon: <Package className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      status: "Processing",
    },
    {
      id: "shipped",
      label: "Shipped Orders",
      count: analaytics?.ordersByStatus?.SHIPPED || 0,
      icon: <Truck className="h-5 w-5" />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      status: "Shipped",
    },
    {
      id: "delivered",
      label: "Delivered Orders",
      count: analaytics?.ordersByStatus?.DELIVERED || 0,
      icon: <CheckCircle className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
      status: "Delivered",
    },
    {
      id: "cancelled",
      label: "Cancelled Orders",
      count: analaytics?.ordersByStatus?.CANCELLED || 0,
      icon: <XCircle className="h-5 w-5" />,
      color: "text-red-600",
      bgColor: "bg-red-50",
      status: "Cancelled",
    },
  ];

  return (
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
  )
}

export default Analytics