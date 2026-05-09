import { Badge } from "@/components/ui/badge";
import { TPaymentStatus } from "@/redux/service/orders/type";



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

type Props = {
  status: TPaymentStatus;
};

export const PaymentStatusBadge = ({ status }: Props) => {
  const config = paymentStatusConfig[status];

  return (
    <Badge variant="outline" className={`text-xs font-medium ${config.className}`}>
      {config.label}
    </Badge>
  );
};

