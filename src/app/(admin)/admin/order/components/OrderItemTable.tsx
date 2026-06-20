import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { IOrder } from "@/redux/service/orders/type";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { PRODUCT_IMG } from "@/lib/default-import";
import { CURRENCY } from "@/lib/envSecret";
import { Card } from "@/components/ui/card";


type Props = {
  order: IOrder;
};
const OrderItemTable = ({ order }: Props) => {

  return (
    <>
      <Card className=" p-3  rounded-md shadow">
        <div className="flex pt-4 px-4 justify-between items-center">
          <div>
            <p className="text-base font-semibold text-accent-foreground">Products</p>
            <p className="text-sm font-medium text-muted-foreground">
              Your order items
            </p>
          </div>
          <div>
            <Button
              className="h-7.5 px-2 rounded"
              variant={"outline"}
              type="button"
            >
              Download Invoice
            </Button>
          </div>
        </div>
        <div className="px-4 pt-4  ">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-4xl uppercase font-extrabold">Invoice</p>
              <p className=" uppercase font-semibold">#{order?.invoiceNumber}</p>
            </div>
            <p className="text-muted-foreground">
              {" "}
              <span className=" font-semibold">Date:</span>{" "}
              {format(order?.createdAt, "MMM dd, yyyy")}{" "}
            </p>
            <div className="grid grid-cols-2 pb-4 gap-2">
              <div className="">
                <p className="text-lg font-bold text-accent-foreground">From</p>
                <p className="text-muted-foreground">CILISHOP</p>
                <p className="text-muted-foreground">
                  Bangla Bazar, Turag, Dhaka 10000
                </p>
                <p className="text-muted-foreground">
                  <span className="text-accent-foreground font-semibold">Contact:</span>
                  01728068200
                </p>
              </div>
              <div className="">
                <p className="text-lg font-bold text-accent-foreground text-right">
                  Bill To
                </p>
                <p className="text-muted-foreground text-base font-semibold text-right">
                  {order?.shippingAddress?.fullName}
                </p>
                <p className="text-muted-foreground text-right">
                  {order?.shippingAddress?.address}

                </p>
                <p className="text-muted-foreground text-right">
                  {order?.shippingAddress?.postalCode}

                </p>
                <p className="text-muted-foreground text-right">
                  <span className="text-accent-foreground font-semibold">Phone:</span>
                  {order?.shippingAddress?.phone}
                </p>
              </div>
            </div>
          </div>

          <Table
            className="bg-gray-200  border-separate  "
            style={{ border: "none" }}
          >
            <TableHeader className="bg-white ">
              <TableRow>
                <TableHead className="min-w-62.5 border-r border-gray-200">
                  Items
                </TableHead>
                <TableHead className="border-r border-gray-200">
                  Quantity
                </TableHead>
                <TableHead className="border-r border-gray-200">
                  Price
                </TableHead>
                <TableHead className="text-right border-r border-gray-200">
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white ">
              {order?.items?.map((item, i) => (
                <TableRow key={i} className="">
                  <TableCell
                    className={`pl-0 pr-2 font-medium py-0 border-r border-gray-200`}
                  >
                    <div className="flex items-center gap-2">
                      <div>
                        {
                          item?.productImage ? <div className="w-12.5 h-12.5 ">
                            <Image
                              src={
                                item?.productImage ? item?.productImage : PRODUCT_IMG
                              }
                              width={50}
                              height={50}
                              alt="Image"
                              className="w-12.5 h-12.5"
                            />
                          </div> : <div className="w-12.5 h-12.5 bg-slate-50">

                          </div>
                        }

                      </div>
                      <div>
                        <p className="text-gray-700">{item?.productName}</p>
                        <p className="text-xs text-gray-500">
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
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className=" py-0 border-r border-gray-200">
                    {item?.quantity}
                  </TableCell>
                  <TableCell className="py-0 border-r border-gray-200 text-right">
                    {CURRENCY}
                    {item?.salePrice}
                  </TableCell>

                  <TableCell className="py-0 text-right">
                    {CURRENCY}
                    {item?.salePrice * item?.quantity}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-white">
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="border-r py-1 border-gray-200"
                >
                  Sub Total
                </TableCell>
                <TableCell className="text-right py-1">
                  {CURRENCY}
                  {order?.pricing?.subtotal?.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="border-r py-1 border-gray-200"
                >
                  Tax
                </TableCell>
                <TableCell className="text-right py-1">
                  {CURRENCY}
                  {order?.pricing?.tax?.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="border-r py-1 border-gray-200"
                >
                  Shipping
                </TableCell>
                <TableCell className="text-right py-1">
                  {CURRENCY}
                  {order?.pricing?.shippingCharge?.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="border-r py-1 border-gray-200 font-bold"
                >
                  Total
                </TableCell>
                <TableCell className="text-right py-1 font-bold text-main">
                  {CURRENCY}
                  {order?.pricing?.total?.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          <div className="mt-5 pb-2">
            <p className="text-gray-600 ">
              <span className="text-gray-900 font-semibold">
                Payment Method:
              </span>
              {order?.payment?.method}
            </p>
            <p className="text-gray-600 ">
              <span className="text-gray-900 font-semibold">Note:</span>
              Thank you for your purchase
            </p>
          </div>
        </div>
      </Card>
    </>
  );
};

export default OrderItemTable;