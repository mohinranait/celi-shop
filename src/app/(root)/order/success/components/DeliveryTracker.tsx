import { IOrder } from '@/redux/service/orders/type';
import { addDays, format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, LockKeyhole } from 'lucide-react';

type TStep = {
  label: string;
  state: string;
}
const steps: TStep[] = [
  { label: "Confirmed", state: "done" },
  { label: "Processing", state: "active" },
  { label: "Shipped", state: "pending" },
  { label: "Delivered", state: "pending" },
];



function StepDot({ state }: { state: TStep['state'] }) {
  const base = "w-6 h-6 rounded-full flex items-center justify-center z-10 border";
  if (state === "done")
    return (
      <div className={`${base} bg-green-100 border-green-400`}>
        <CheckCircle className="w-3.5 h-3.5 text-green-600" />
      </div>
    );
  if (state === "active")
    return (
      <div className={`${base} bg-blue-100 border-blue-400`}>
        <span className="w-2 h-2 rounded-full bg-blue-500 block" />
      </div>
    );
  return <div className={`${base} bg-muted border-border`} ><LockKeyhole className="w-3.5 h-3.5 text-muted-foreground" /></div>;
}

type Props = {
  order: IOrder
}
const DeliveryTracker = ({ order }: Props) => {
  const formattedDate = format(
    addDays(order?.createdAt, 3),
    "MMM dd, yyyy"
  );
  const orderDate = format(order?.createdAt,
    "MMM dd"
  );
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
          Delivery tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start relative">
          {steps.map((step, i) => (
            <div key={step.label} className="flex-1 flex flex-col items-center relative">
              {i < steps.length - 1 && (
                <div
                  className={`absolute top-3 left-1/2 w-full h-px ${step.state === "done" ? "bg-green-300" : "bg-gray-200"
                    }`}
                />
              )}
              <StepDot state={step.state} />
              <span
                className={`mt-2 text-[11px] text-center leading-tight ${step.state === "active" ? "text-blue-600 font-medium" : "text-gray-400"
                  }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Estimated delivery:{" "}
          <span className="font-medium text-gray-700">{orderDate} –  {formattedDate}</span>
        </p>
      </CardContent>
    </Card>
  )
}

export default DeliveryTracker