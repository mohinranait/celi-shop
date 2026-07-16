"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { removeToCart, updateCartQuantity } from "@/redux/features/cartSlice";
import { CURRENCY } from "@/lib/envSecret";
// nothing


export default function CartPage() {
  const { carts, subtotal, totalItems } = useAppSelector(state => state.cart)
  const dispatch = useAppDispatch()
  const [coupon, setCoupon] = useState("");


  const discount = 0;
  const total = subtotal  - discount;

  if (carts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Looks like you have not added anything yet.</p>
          <Link href="/shop">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
            <p className="text-muted-foreground mt-1">{totalItems} items</p>
          </div>
          <Link href="/checkout">
            <Button size="lg" className="gap-2">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {carts.map((item, idx) => (
              <Card key={idx} className="p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden border bg-slate-100 shrink-0">
                    {
                      item?.productImage &&
                      <Image
                        src={`${item?.productImage}`}
                        alt={item?.productName}
                        className="w-full h-full object-cover"
                        width={100}
                        height={100}
                      />
                    }
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-base">{item.productName}</h3>
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
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => dispatch(removeToCart({ productId: item?.productId, sku: item?.sku }))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center overflow-hidden rounded-md border">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-9  rounded-md  rounded-r-none"
                          onClick={() =>
                            dispatch(
                              updateCartQuantity({
                                productId: item.productId,
                                sku: item.sku,
                                quantity: item.quantity - 1,
                              })
                            )
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <span className="flex h-8 min-w-9 items-center justify-center border-x text-sm font-medium">
                          {item.quantity}
                        </span>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-9 rounded-md  rounded-l-none"
                          onClick={() =>
                            dispatch(
                              updateCartQuantity({
                                productId: item.productId,
                                sku: item.sku,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          {CURRENCY}{(item.salePrice ).toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs text-muted-foreground">Total: {CURRENCY}{item.salePrice * item.quantity }</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky py-5 top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{CURRENCY}{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                 
                  {/* <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{CURRENCY}{discount}</span>
                  </div> */}
                </div>

                <Separator />

                <div className="flex justify-between text-xl font-semibold">
                  <span>Total</span>
                  <span>{CURRENCY}{total.toLocaleString("en-IN")}</span>
                </div>

                {/* Coupon Code */}
                {/* <div>
                  <Label htmlFor="coupon">Have a coupon code?</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="coupon"
                      placeholder="Enter code"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                    />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div> */}

                <Button asChild size="lg" className="w-full text-base h-14">
                  <Link href="/checkout">
                    Proceed to Checkout
                  </Link>
                </Button>

                <p className="text-center text-xs text-slate-500">
                  Taxes and shipping calculated at checkout
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}