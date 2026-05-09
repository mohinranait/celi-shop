import { Badge } from "@/components/ui/badge";
import { TOrderStatus, TPaymentStatus } from "@/redux/service/orders/type";
import {
  Clock,
  CheckCircle,
  Settings,
  Truck,
  PackageCheck,
  XCircle,
  RotateCcw,
} from "lucide-react";



const paymentStatusConfig: Record<TPaymentStatus, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-100",
  },
  PAID: {
    label: "Paid",
    className: "bg-green-100 text-green-700 border-green-300 hover:bg-green-100",
  },
  FAILED: {
    label: "Failed",
    className: "bg-red-100 text-red-700 border-red-300 hover:bg-red-100",
  },
  REFUNDED: {
    label: "Refunded",
    className: "bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-100",
  },
};

type PaymentStatusProps = {
  status: TPaymentStatus;
};

// Payment status
export const PaymentStatusBadge = ({ status }: PaymentStatusProps) => {
  const config = paymentStatusConfig[status];

  return (
    <Badge variant="outline" className={`text-xs font-medium ${config.className}`}>
      {config.label}
    </Badge>
  );
};





const orderStatusConfig: Record <TOrderStatus, { label: string; className: string; icon: React.ReactNode }> = {
  PENDING: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-100",
    icon: <Clock className="w-3 h-3" />,
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-100",
    icon: <CheckCircle className="w-3 h-3" />,
  },
  PROCESSING: {
    label: "Processing",
    className: "bg-indigo-100 text-indigo-700 border-indigo-300 hover:bg-indigo-100",
    icon: <Settings className="w-3 h-3" />,
  },
  SHIPPED: {
    label: "Shipped",
    className: "bg-cyan-100 text-cyan-700 border-cyan-300 hover:bg-cyan-100",
    icon: <Truck className="w-3 h-3" />,
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-green-100 text-green-700 border-green-300 hover:bg-green-100",
    icon: <PackageCheck className="w-3 h-3" />,
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700 border-red-300 hover:bg-red-100",
    icon: <XCircle className="w-3 h-3" />,
  },
  RETURNED: {
    label: "Returned",
    className: "bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-100",
    icon: <RotateCcw className="w-3 h-3" />,
  },
};

type OrderStatus = {
  status: TOrderStatus;
};

export const OrderStatusBadge = ({ status }: OrderStatus) => {
  const config = orderStatusConfig[status];

  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1 text-xs font-medium w-fit ${config.className}`}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
};







