import {
  Package,
  Truck,
  CheckCircle,
  Clock,

  X,
  Repeat2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TOrderStatus } from "@/redux/service/orders/type";

const statusSteps = [
  {
    key: "PENDING",
    label: "Order Placed",
    icon: Clock,
  },
  {
    key: "PROCESSING",
    label: "Processing",
    icon: Package,
  },
  {
    key: "SHIPPED",
    label: "Shipped",
    icon: Truck,
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    icon: CheckCircle,
  },
  {
    key: "CANCELLED",
    label: "Cancelled",
    icon: X,
  },
  {
    key: "RETURNED",
    label: "Returned",
    icon: Repeat2,
  },

];


type Props = {
  orderStatus: TOrderStatus
}

const Progress = ({ orderStatus }: Props) => {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Order Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {statusSteps.map((step, index) => {
            const Icon = step.icon;
            const currnIndex = statusSteps?.findIndex(
              (item) => item.key === orderStatus
            );
            return (
              <div
                key={step.key}
                className="flex flex-col items-center text-center"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${currnIndex >= index

                    ? "bg-primary text-white"
                    : "bg-slate-50 text-slate-300"

                    }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h4
                  className={`font-medium  text-sm ${currnIndex >= index ? "text-gray-900" : "text-gray-200"
                    }`}
                >
                  {step.label}
                </h4>

              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default Progress