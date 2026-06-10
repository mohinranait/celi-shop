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
    description: "Your order has been placed",
  },
  {
    key: "PROCESSING",
    label: "Processing",
    icon: Package,
    description: "We're preparing your order",
  },
  {
    key: "SHIPPED",
    label: "Shipped",
    icon: Truck,
    description: "Your order is on the way",
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    icon: CheckCircle,
    description: "Order delivered successfully",
  },
  {
    key: "CANCELLED",
    label: "Cancelled",
    icon: X,
    description: "Order delivery cancel",
  },
  {
    key: "RETURNED",
    label: "Returned",
    icon: Repeat2,
    description: "Return your order",
  },
  {
    key: "CONFIRMED",
    label: "CONFIRMED",
    icon: Repeat2,
    description: "Return your order",
  },
];


type Props = {
  orderStatus: TOrderStatus
}

const Progress = ({ orderStatus }: Props) => {
  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex((step) => step.key === status);
  };

  const currentStatusIndex = getStatusIndex(orderStatus as TOrderStatus);

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
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            return (
              <div
                key={step.key}
                className="flex flex-col items-center text-center"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${isCompleted
                    ? isCurrent
                      ? "bg-blue-600 text-white"
                      : "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-400"
                    }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h4
                  className={`font-medium lowercase text-sm ${isCompleted ? "text-gray-900" : "text-gray-400"
                    }`}
                >
                  {step.key}
                </h4>
                <p
                  className={`text-xs mt-1 ${isCompleted ? "text-gray-600" : "text-gray-400"
                    }`}
                >
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default Progress