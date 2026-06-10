"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, MapPin, } from "lucide-react";
import { useAppSelector } from "@/hooks/hooks";
import { CURRENCY } from "@/lib/envSecret";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, TCheckoutForm } from "@/components/validations/checkout";
import { useCreateOrderMutation } from "@/redux/service/orders";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useGetAppSettingQuery } from "@/redux/service/setting";
import RightBar from "./components/RightBar";
import PaymentMethod from "./components/PaymentMethod";
import { TPaymentMethod } from "@/redux/service/orders/type";
type TPaymentMethodType = {
  cod: boolean;
  bKash: {
    enabled: boolean;
    merchantNumber?: string;
  };
  nagad: {
    enabled: boolean;
    merchantNumber?: string;
  };
}


export type TMethodList = {
  value: TPaymentMethod,
  label: string,
  icon: string | null,
  number?: string | null;
}

export default function CheckoutPage() {
  const router = useRouter()
  const {user} = useAppSelector(state => state.auth)
  const { data: appSetting } = useGetAppSettingQuery();
  const [createOrder, { isLoading }] = useCreateOrderMutation()
  const { carts, } = useAppSelector(state => state.cart)
  const [zone, setZone] = useState<{
    areaName: string;
    fee: number;
  } | null>(null);


  const isShippingProduct = carts?.some(item => item.freeShipping === false)


  const paymentMethodss = useMemo(() => {
    const methods = appSetting?.paymentMethods as TPaymentMethodType;
    const list: TMethodList[] = [];

    if (methods?.cod) {
      list.push({
        value: "COD",
        label: "Cash on Delivery",
        icon: "cod.png",
      });
    }
    if (methods?.bKash?.enabled) {
      list.push({
        value: "BKASH",
        label: "bKash",
        icon: "bkash.png",
        number: methods.bKash.merchantNumber || "017XXXXXXXX",
      });
    }
    if (methods?.nagad?.enabled) {
      list.push({
        value: "NAGAD",
        label: "Nagad",
        icon: "Nagad-png.png",
        number: methods.nagad.merchantNumber || "019XXXXXXXX",
      });
    }


    return list;
  }, [appSetting?.paymentMethods]);



  let deliveryCharge = 0;

  if (isShippingProduct) {
    deliveryCharge = zone ? zone?.fee : 0;
  }


  const zones = useMemo(() => {
    return appSetting?.shipping?.shippingZones || [];
  }, [appSetting?.shipping?.shippingZones]);


  const form = useForm<TCheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      payment: {
        method: 'COD',
        status: "PENDING"
      },
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = form

  const paymentMethod = watch("payment.method");


  const onSubmit = async (data: TCheckoutForm) => {
    if (carts?.length === 0) {
      toast.warning("Your cart is empty");
      return;
    }
    const payload = {
      ...data,
      userId: user?._id || null,
      items: carts,
      pricing: {
        shippingCharge: deliveryCharge
      }
    }

    try {
      const { data } = await createOrder(payload).unwrap();
      toast.success("Order Placed Successfully!")
      router.push(`/order/success?oid=${data?.trackingNumber}`)
    } catch (error) {
      console.log(error);

    }
  };

  useEffect(() => {
    if (zones.length > 0 && !zone) {
      setZone(zones[0]);
    }
  }, [zones, zone]);


  const selectedMethod = useMemo(() => {
    if (!paymentMethod) return;
    return paymentMethodss?.find(item => item.value === paymentMethod)

  }, [paymentMethod])


  // console.log(getValues());
  // console.log(errors);



  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Side - Form */}
            <div className="lg:col-span-3 space-y-6">
              {/* Delivery Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Delivery Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name *</Label>
                      <Input {...register("shippingAddress.fullName")} placeholder="আপনার নাম লিখুন" className="mt-1" />
                      <p className="text-red-500 text-sm">{errors.shippingAddress?.fullName?.message}</p>
                    </div>
                    <div>
                      <Label>Phone Number *</Label>
                      <Input {...register("shippingAddress.phone")} type="tel" placeholder="01XXXXXXXXX" className="mt-1" />
                      <p className="text-red-500 text-sm">{errors.shippingAddress?.phone?.message}</p>
                    </div>
                  </div>


                  <Separator />

                  {
                    isShippingProduct ?
                      <div>
                        <Label className="text-base font-medium mb-3 block">Delivery Zone</Label>
                        <RadioGroup value={zone?.areaName} onValueChange={(v) => {
                          const findZone = zones?.find(ite => ite.areaName === v)
                          setZone(findZone || null);

                        }} className="grid grid-cols-1 md:grid-cols-2 gap-3">

                          {zones?.map((zon, index) => (
                            <div
                              key={index}
                              className={`border rounded-xl p-4 cursor-pointer transition-all hover:bg-muted/50
                ${zone?.areaName === zon.areaName
                                  ? "border-primary bg-primary/5 shadow-sm"
                                  : "border-border"
                                }`}
                            >
                              <div className="flex items-start gap-3">
                                <RadioGroupItem
                                  value={zon.areaName}
                                  id={`zone-${index}`}
                                  className="mt-1"
                                />
                                <Label
                                  htmlFor={`zone-${index}`}
                                  className="flex flex-col cursor-pointer items-start flex-1"
                                >
                                  <p className="font-medium text-left">{zon.areaName}</p>



                                  <p className="text-sm font-semibold text-primary mt-1">
                                    Delivery Fee: {CURRENCY}{zon.fee}
                                  </p>
                                </Label>
                              </div>
                            </div>
                          ))}



                        </RadioGroup>
                      </div> :
                      <div className="p-4 rounded-md bg-muted border border-border">Free Delivery</div>
                  }



                  <div>
                    <Label>Full Address *</Label>
                    <Textarea {...register("shippingAddress.address")} placeholder="বাড়ি নম্বর, রাস্তা, এলাকা, থানা..." className="mt-1 min-h-24" />
                    <p className="text-red-500 text-sm">{errors.shippingAddress?.address?.message}</p>
                  </div>

                  <div>
                    <Label>Order Note (optional)</Label>
                    <Textarea {...register("customerNote")} placeholder="বিশেষ কোনো নির্দেশনা থাকলে লিখুন..." className="mt-1" />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <PaymentMethod paymentMethod={paymentMethod} paymentMethodss={paymentMethodss} callBack={(value) => setValue("payment.method", value as "COD" | "BKASH")} />
            </div>

            {/* Right Side - Cart & Summary */}
            <div className="lg:col-span-2">
              <RightBar deliveryCharge={deliveryCharge} selectedMethod={selectedMethod} form={form} isLoading={isLoading} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}