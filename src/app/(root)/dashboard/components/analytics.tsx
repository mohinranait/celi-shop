'use client';
import {
  Package,
  ShoppingCart,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetDashboardAnalyticsQuery } from "@/redux/client/dashboard";
import { CURRENCY } from "@/lib/envSecret";


const Analytics = () => {
  const { data: getAnalaytics } = useGetDashboardAnalyticsQuery(``)
  const analaytics = getAnalaytics?.data;

  const stats = [
    {
      title: "Total Orders",
      value: analaytics?.totalOrders || 0,
      description: "+20.1% last month",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Shopping",
      value: `${CURRENCY} ${analaytics?.totalShopping}`,
      description: "+15% last month",
      icon: CreditCard,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pending Orders",
      value: analaytics?.ordersByStatus.PENDING || 0,
      description: "Processing is in progress.",
      icon: ShoppingCart,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Savings",
      value: analaytics?.totalSaving || 0,
      description: "From discount",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
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
  )
}

export default Analytics