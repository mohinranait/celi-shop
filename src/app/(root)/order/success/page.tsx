'use client';
import { CheckCircle, Truck, MapPin, CreditCard, ShoppingBag, Receipt, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import { useGetOrderByTrackingNumberQuery } from "@/redux/service/orders";
import Image from "next/image";
import { PRODUCT_IMG } from "@/lib/default-import";
import { CURRENCY } from "@/lib/envSecret";
import { format } from "date-fns";
import DeliveryTracker from "./components/DeliveryTracker";
import { PaymentStatusBadge } from "@/components/shared/render-status";


export default function OrderSuccessPage() {
  const params = useSearchParams();
  const invoiceId = params.get('oid')
  const { data } = useGetOrderByTrackingNumberQuery(invoiceId!, { skip: !invoiceId });

  const order = data?.data;
  const items = order?.items || [];

  if (!order) return;

  if (!invoiceId) return;


  return (
    <div className="min-h-screen  py-10 px-4">
      <div className="max-w-xl mx-auto space-y-4">

        {/* Hero */}
        <Card className="text-center shadow-sm">
          <CardContent className="pt-10 pb-8 px-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-semibold text-accent-foreground mb-1">Order confirmed!</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ধন্যবাদ! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।<br />
              শীঘ্রই ডেলিভারি পৌঁছে যাবে।
            </p>
            <Badge variant="secondary" className="mt-4 gap-1.5 px-3 py-1 text-xs">
              <Receipt className="w-3 h-3" />
              Order #{order?.trackingNumber}
            </Badge>
          </CardContent>
        </Card>

        {/* Delivery Tracker */}
        <DeliveryTracker order={order} />

        {/* Order Items + Summary */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
              Order items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {items?.map((item) => (
                <div key={item._id}>
                  <div className="flex items-center gap-3 py-3">
                    <div className="w-11 h-11 rounded-lg bg-muted border border-border flex items-center justify-center text-xl shrink-0">
                      <Image src={item?.productImage || PRODUCT_IMG} width={60} height={60} alt={item?.productName || ''} className="rounded-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-accent-foreground truncate">{item?.productName}</p>
                      {item?.selectedVariants && (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {Object.keys(
                            item?.selectedVariants || {}
                          ).map((key, index, array) => (
                            <span
                              key={key}
                              className="capitalize"
                            >
                              {key}:{" "}
                              {
                                item.selectedVariants &&
                                item.selectedVariants[key]
                              }

                              {index !== array.length - 1 &&
                                " • "}
                            </span>
                          ))}
                        </p>
                      )}
                    </div>
                    <p className="text-sm font-medium text-accent-foreground whitespace-nowrap">
                      {CURRENCY} {item.salePrice.toLocaleString()}
                    </p>
                  </div>

                </div>
              ))}
            </div>

            <Separator className="my-3" />

            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{CURRENCY} {order?.pricing?.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                {
                  order?.pricing?.shippingCharge && order?.pricing?.shippingCharge > 0 ?
                    <span className="font-medium text-muted-foreground">{order?.pricing?.shippingCharge}</span> :
                    <span className="font-medium text-green-600">Free</span>
                }
              </div>
              {
                order?.pricing?.tax && order?.pricing?.tax > 0 ?
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Tag className="w-3 h-3" />Tax
                    </span>
                    <span className="font-medium text-amber-600"> {CURRENCY} {order?.pricing?.tax.toLocaleString()}</span>
                  </div> : null
              }
              {
                order?.pricing?.discount && order?.pricing?.discount > 0 ?
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Discount (SAVE10)
                    </span>
                    <span className="font-medium text-amber-600">– {CURRENCY} {order?.pricing?.discount.toLocaleString()}</span>
                  </div> : null
              }
            </div>

            <Separator className="my-3" />

            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-accent-foreground">Total </span>
              <span className="text-lg font-semibold text-accent-foreground">{CURRENCY} {order?.pricing?.total.toLocaleString()}</span>
            </div>

           
          </CardContent>
        </Card>

        {/* Delivery Address */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
              Delivery address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 items-start">
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-accent-foreground">{order?.shippingAddress?.fullName}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">
                  {order?.shippingAddress?.address}<br />
                  {order?.shippingAddress?.phone}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Info Grid */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-gray-400 font-medium">
              Order info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Order date", value: order?.createdAt && format(order?.createdAt, 'MMM dd,yyyy') },
                { label: "Delivery type", value: "Standard (3–5 days)" },
                { label: "Payment", value: order?.payment?.method === 'BKASH' ? "bKash" : order?.payment?.method },
                order?.payment?.method === 'BKASH'
                  ? { label: "Payment Status", value: <PaymentStatusBadge status={order?.payment?.status} /> }
                  : null,
              ]?.filter(Boolean)?.map((info) => (
                  <div key={info?.label} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-gray-400 mb-1">{info?.label}</p>
                    <p className="text-sm font-medium text-gray-900">{info?.value}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <Button className="w-full gap-2" size="lg">
            <Truck className="w-4 h-4" />
            Track my order
          </Button>
          <Button variant="outline" className="w-full gap-2" size="lg">
            <ShoppingBag className="w-4 h-4" />
            Continue shopping
          </Button>
        </div>

      </div>
    </div>
  );
}