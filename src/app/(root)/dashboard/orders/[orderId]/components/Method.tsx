import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IPayment } from "@/redux/service/orders/type";
import { CreditCard } from "lucide-react";

const paymentMethods = {
  COD: {
    label: "Cash on Delivery",
    color: "from-green-500 to-emerald-400",
  },
  BKASH: {
    label: "bKash",
    color: "from-pink-500 to-rose-400",
  },
  NAGAD: {
    label: "Nagad",
    color: "from-orange-500 to-red-500",
  },
  CARD: {
    label: "Credit/Debit Card",
    color: "from-blue-500 to-cyan-400",
  },
  STRIPE: {
    label: "Stripe",
    color: "from-indigo-500 to-purple-500",
  },
};


type Props = {
  payment: IPayment
}

const Method = ({ payment }: Props) => {
  const paymentInfo =
    paymentMethods[
    payment.method as keyof typeof paymentMethods
    ] ?? {
      label: "Unknown",
      color: "from-gray-400 to-gray-500",
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-5 bg-linear-to-r ${paymentInfo.color} rounded`}
          />

          <div>
            <p className="text-sm font-medium">
              {paymentInfo.label}
            </p>

            <p className="text-xs text-muted-foreground">
              {payment.method}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Method