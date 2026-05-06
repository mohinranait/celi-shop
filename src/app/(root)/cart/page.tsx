"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";

type CartItem = {
  id: number;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string; // এখানে আপনি URL দিতে পারবেন
};

const initialCart: CartItem[] = [
  {
    id: 1,
    name: "Nike Air Max 270",
    variant: "Size: 42 • Black",
    price: 8500,
    quantity: 1,
    image: "https://via.placeholder.com/80x80/000/fff?text=Nike",
  },
  {
    id: 2,
    name: "Cotton Oversized T-Shirt",
    variant: "Size: L • White",
    price: 800,
    quantity: 2,
    image: "https://via.placeholder.com/80x80/eee/000?text=T-Shirt",
  },
  {
    id: 3,
    name: "Laptop Backpack 30L",
    variant: "Navy Blue",
    price: 2200,
    quantity: 1,
    image: "https://via.placeholder.com/80x80/333/fff?text=Bag",
  },
];

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [coupon, setCoupon] = useState("");

  const updateQuantity = (id: number, newQty: number) => {
    if (newQty < 1) return;
    setCart(cart.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 60;
  const discount = 500;
  const total = subtotal + delivery - discount;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-slate-500 mb-6">Looks like you have not added anything yet.</p>
          <Link href="/shop">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
            <p className="text-slate-500 mt-1">{cart.length} items</p>
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
            {cart.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden border bg-slate-100 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-slate-500 mt-1">{item.variant}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="px-4 font-medium">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          ৳{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs text-slate-500">৳{item.price} each</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-medium">৳{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Delivery Charge</span>
                    <span>৳{delivery}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-৳{discount}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-xl font-semibold">
                  <span>Total</span>
                  <span>৳{total.toLocaleString("en-IN")}</span>
                </div>

                {/* Coupon Code */}
                <div>
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
                </div>

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