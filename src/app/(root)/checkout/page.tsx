"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, MapPin, CreditCard, ShieldCheck, Lock } from "lucide-react";
import { useAppSelector } from "@/hooks/hooks";
import Image from "next/image";
import { CURRENCY } from "@/lib/envSecret";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, TCheckoutForm } from "@/components/validations/checkout";
import { useCreateOrderMutation } from "@/redux/service/orders";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useGetAppSettingQuery } from "@/redux/service/setting";

/* ------------------------- ZOD SCHEMA ------------------------- */




export default function CheckoutPage() {
  const router = useRouter()
  const { data: appSetting } = useGetAppSettingQuery();
  const [createOrder, { isLoading }] = useCreateOrderMutation()
  const { carts, subtotal, totalItems } = useAppSelector(state => state.cart)
  // const shippingThreshold = appSetting?.shipping?.freeShippingThreshold || 0;
  const [zone, setZone] = useState<{
    areaName: string;
    fee: number;
  } | null>(null);

  const deliveryCharge = zone ? zone?.fee : 0;
  const discount = 0;
  const total = subtotal + deliveryCharge - discount;

  const zones = useMemo(() => {
    return appSetting?.shipping?.shippingZones || [];
  }, [appSetting?.shipping?.shippingZones]);

  const paymentMethods = useMemo(() => {
    return appSetting?.paymentMethods || {};
  }, [appSetting])


  


  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TCheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      payment: {
        method: 'COD',
        status: "PENDING"
      },
    },
  });

  const paymentMethod = watch("payment.method");;


  const onSubmit = async (data: TCheckoutForm) => {
    const payload = {
      ...data,
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
                  </div>



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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(v) =>
                      setValue("payment.method", v as "COD" | "BKASH")
                    }
                    className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { value: "COD", label: "Cash on Delivery", icon: "cod.png" },
                      { value: "BKASH", label: "bKash", icon: "bkash.png" },
                    ].map((method) => (
                      <label
                        key={method.value}
                        className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === method.value ? "border-primary bg-muted" : ""
                          }`}
                      >
                        <RadioGroupItem value={method.value} />
                        <span className="text-2xl">
                          <Image src={`/${method?.icon}`} width={60} height={50} alt="Image" />
                        </span>
                        <span className="font-medium">{method.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Cart & Summary */}
            <div className="lg:col-span-2">
              <Card className="sticky top-40">
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
                      <Badge variant={'outline'}>
                        {CURRENCY}{deliveryCharge}
                      </Badge>
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

                  {paymentMethod === "BKASH" && (
                    <div className="mt-3">
                      <Label className="text-sm">
                        bKash Transaction ID *
                      </Label>

                      <Input
                        placeholder="Enter transaction ID (e.g. 9A3X5ZK...)"
                        {...register("payment.transactionId", {
                          required: "Transaction ID is required",
                        })}
                        className="mt-1 focus:border-pink-500"
                      />

                      <p className="text-red-500 text-sm">{errors.payment?.transactionId?.message}</p>

                      <p className="text-xs text-muted-foreground mt-1">
                        Make sure the ID is correct before placing order
                      </p>
                    </div>

                  )}

                  <Button

                    size="lg"
                    className="w-full mt-8 text-base font-semibold h-14"
                  // onClick={() => alert("Order Placed Successfully!")}
                  >
                    <ShieldCheck className="mr-2" />
                    Place Order
                  </Button>

                  <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    Secured & Encrypted Checkout
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}