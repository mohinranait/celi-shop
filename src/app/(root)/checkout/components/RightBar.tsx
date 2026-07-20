import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/hooks/hooks";
import { CURRENCY } from "@/lib/envSecret";
import { Lock, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { TMethodList } from "../page";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TCheckoutForm } from "@/components/validations/checkout";
type Props = {
  deliveryCharge: number;
  selectedMethod: TMethodList | undefined;
  isLoading: boolean
  form: UseFormReturn<TCheckoutForm>;

}
const RightBar = ({ deliveryCharge, selectedMethod, form, isLoading }: Props) => {
  const { register, formState: { errors }, } = form
  const { carts, totalItems, subtotal, } = useAppSelector(state => state.cart)
  const discount = 0;
  const total = subtotal + deliveryCharge - discount;
  return (
    <Card className="sticky py-5 top-24">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Your Cart
          <span className="text-sm font-normal text-muted-foreground">({totalItems} items)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {carts.map((item, idx) => (
            <div key={idx} className="flex gap-4 py-3 border-b last:border-0">
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-3xl shrink-0">
                {
                  item?.productImage &&
                  <Image
                    src={`${item?.productImage}`}
                    alt={item?.productName}
                    className="w-full h-full object-cover rounded-md"
                    width={60}
                    height={60}
                  />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium leading-tight">{item.productName}</p>
                {
                  item?.selectedVariants &&
                  <p className="mt-1 text-xs text-muted-foreground">
                    {
                      Object.keys(item?.selectedVariants || {}).map((key, index, array) => (
                        <span key={key} className="capitalize">
                          {key}: {item.selectedVariants && item.selectedVariants[key]}
                          {index !== array.length - 1 && " • "}
                        </span>
                      ))
                    }

                  </p>
                }
                <p className="text-sm mt-1">Qty: {item.quantity}</p>
              </div>
              <div className="text-right font-semibold">
                {CURRENCY}{(item.salePrice * item.quantity).toLocaleString("en-IN")}
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        {/* Order Summary */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
            <span>{CURRENCY}{subtotal.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery Charge</span>
            {
              deliveryCharge === 0 ? "Free" :
                <Badge variant={'outline'}>
                  {CURRENCY}{deliveryCharge}
                </Badge>
            }
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Discount</span>
            <span className="text-green-600">-৳{discount.toFixed(2)}</span>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>{CURRENCY}{total.toLocaleString("en-IN")}</span>
          </div>
        </div>


        {(selectedMethod?.value === "BKASH" || selectedMethod?.value === "NAGAD") && selectedMethod?.number && (
          <div className="mt-6 p-4 bg-muted/50 rounded-xl border">
            <p className="text-sm font-medium mb-2">
              {selectedMethod?.label} Number: <span className="font-semibold text-primary">{selectedMethod?.number}</span>
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              এই নাম্বারে টাকা পাঠিয়ে Transaction ID টি নিচে দিন
            </p>

            <Label className="text-sm">
              {selectedMethod?.label} Transaction ID *
            </Label>
            <Input
              placeholder="Transaction ID লিখুন"
              {...register("payment.transactionId")}
              className="mt-1"
            />
            <p className="text-red-500 text-sm mt-1">
              {errors.payment?.transactionId?.message}
            </p>
          </div>
        )}


        <Button
          disabled={isLoading}
          size="lg"
          className="w-full mt-8 text-base font-semibold h-14"
        >
          <ShieldCheck className="mr-2" />
          {
            isLoading ? "Order Loading..." : "Place Order"
          }

        </Button>

        <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          Secured & Encrypted Checkout
        </p>
      </CardContent>
    </Card>
  )
}

export default RightBar