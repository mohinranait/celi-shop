"use client";
import { useState } from "react";
import {
  Download,
  Package,

  MapPin,
  Calendar,
  Hash,
  FileText,

  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useGetOrderByIdAdminQuery } from "@/redux/service/orders";
import { cn } from "@/lib/utils";
import { CURRENCY } from "@/lib/envSecret";
import OrderItem from "./OrderItem";
import { statusStyles } from "@/components/shared/renderStatus";
import { formateDownloadInvoice } from "./download-invoice";
import Progress from "./Progress";
import Method from "./Method";





type Props = {
  orderId: string;
};
export default function OrderDetailsComponent({ orderId }: Props) {
  const id = orderId;
  const { data } = useGetOrderByIdAdminQuery(id, { skip: !id })
  const order = data?.data;

  const router = useRouter();

  const [isDownloading, setIsDownloading] = useState(false);


  const formatCurrency = (amount: number) => `${CURRENCY}${amount.toFixed(2)}`;

  const address = order?.shippingAddress;


  if (!order) return;

  const downloadInvoicePDF = async () => {
    setIsDownloading(true);
    try {
      await formateDownloadInvoice(order)
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };




  return (
    <div className="min-h-screen">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8  space-y-4">
        {/* header */}
        <div className="">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.back()}
                type="button"
                size={"icon"}
                variant={"outline"}
              >
                <ArrowLeft />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Order Details</h1>
                <p className="text-sm text-gray-500 uppercase">
                  Order #{order?.invoiceNumber}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "inline-block text-xs font-semibold px-3 py-0.5 rounded-full border",
                  statusStyles[order?.orderStatus]
                )}
              >
                {order.orderStatus}
              </span>
              {/* <Button
                onClick={downloadInvoicePDF}
                disabled={isDownloading}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? "Generating PDF..." : "Download Invoice"}
              </Button> */}
            </div>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Order Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium">
                    {format(new Date(order?.createdAt), "dd MMM yyyy, hh:mm a")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Hash className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Invoice Number</p>
                  <p className="font-medium uppercase">INV-{order?.invoiceNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Tracking Number</p>
                  <p className="font-medium uppercase">TRK-{order?.invoiceNumber}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-y-4 xl:gap-4">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Order Progress */}
            <Progress orderStatus={order?.orderStatus} />
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order?.items.map((item, index) => (
                    <OrderItem key={index} item={item} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Sidebar */}
          <div className="grid sm:grid-cols-2 gap-4 xl:grid-cols-1 ">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span> {formatCurrency(order?.pricing?.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span>{formatCurrency(order?.pricing?.shippingCharge)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>{formatCurrency(order?.pricing?.tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span className="text-main">
                    {formatCurrency(order?.pricing?.total)}
                  </span>
                </div>
              </CardContent>
            </Card>
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>

                <div className="space-y-2">
                  <p className="font-medium">
                    {address?.fullName}
                  </p>

                  <p className="text-sm text-gray-600">
                    Phone: {address?.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    Address: {address?.address}, {address?.postalCode}
                  </p>

                </div>

              </CardContent>
            </Card>
            {/* Payment Method */}
            <Method payment={order?.payment} />

          </div>
        </div>
      </div>
    </div>
  );
}
