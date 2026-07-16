import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CURRENCY } from "@/lib/envSecret";
import { useDashboardAnalyticsQuery } from "@/redux/service/dashboard";

import {
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
} from "lucide-react";

const Analytics = () => {
    const {data:dashboard} = useDashboardAnalyticsQuery(``)
  const analytics = dashboard?.data;

  const stats = [
    {
      title: "Total Sales",
      value: `${analytics?.totalSales || 0} ${CURRENCY} `,
      change: "",
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: analytics?.totalOrders || 0,
      change: "",
      icon: ShoppingCart,
    },
    {
      title: "Avg Order",
      value: `${analytics?.averageOrderValue || 0} ${CURRENCY}`,
      change: "",
      icon: Package,
    },
    {
      title: "Total Products",
      value: analytics?.totalProducts || 0,
      change: "",
      icon: TrendingUp,
    },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.title} className="py-5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>

              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold">
                {stat.value}
              </div>

              {/* <p className="text-xs text-green-600 mt-1">
                {stat.change} from last month
              </p> */}
            </CardContent>
          </Card>
        );
      })}
    </div>
  )
}

export default Analytics