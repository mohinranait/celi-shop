"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, MapPin, CreditCard, ShieldCheck, Lock } from "lucide-react";

type CartItem = {
  id: number;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
};

const initialCart: CartItem[] = [
  {
    id: 1,
    name: "Nike Air Max 270",
    variant: "Size: 42 · Color: Black",
    price: 8500,
    quantity: 1,
    image: "👟",
  },
  {
    id: 2,
    name: "Cotton Oversized T-Shirt",
    variant: "Size: L · Color: White",
    price: 800,
    quantity: 2,
    image: "👕",
  },
  {
    id: 3,
    name: "Laptop Backpack 30L",
    variant: "Color: Navy Blue",
    price: 2200,
    quantity: 1,
    image: "🎒",
  },
  {
    id: 4,
    name: "Smart Watch Series 3",
    variant: "Strap: Black Silicone",
    price: 5800,
    quantity: 1,
    image: "⌚",
  },
];

export default function CheckoutPage() {
  const [cart] = useState<CartItem[]>(initialCart);
  const [zone, setZone] = useState<"inside" | "outside">("inside");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = zone === "inside" ? 60 : 120;
  const discount = 500;
  const total = subtotal + deliveryCharge - discount;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
        </div>

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
                    <Input placeholder="আপনার নাম লিখুন" className="mt-1" />
                  </div>
                  <div>
                    <Label>Phone Number *</Label>
                    <Input type="tel" placeholder="01XXXXXXXXX" className="mt-1" />
                  </div>
                </div>

                <div>
                  <Label>Email (optional)</Label>
                  <Input type="email" placeholder="email@example.com" className="mt-1" />
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-medium mb-3 block">Delivery Zone</Label>
                  <RadioGroup value={zone} onValueChange={(v) => setZone(v as "inside" | "outside")} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div
                      className={`border rounded-xl p-4 cursor-pointer transition-all ${
                        zone === "inside" ? "border-blue-600 bg-blue-50" : "border-border"
                      }`}
                      onClick={() => setZone("inside")}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="inside" id="inside" />
                        <div>
                          <p className="font-medium">Inside Dhaka</p>
                          <p className="text-sm text-muted-foreground">Delivery: ৳60</p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`border rounded-xl p-4 cursor-pointer transition-all ${
                        zone === "outside" ? "border-blue-600 bg-blue-50" : "border-border"
                      }`}
                      onClick={() => setZone("outside")}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="outside" id="outside" />
                        <div>
                          <p className="font-medium">Outside Dhaka</p>
                          <p className="text-sm text-muted-foreground">Delivery: ৳120</p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>District *</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="জেলা সিলেক্ট করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dhaka">Dhaka</SelectItem>
                      <SelectItem value="narayanganj">Narayanganj</SelectItem>
                      <SelectItem value="gazipur">Gazipur</SelectItem>
                      <SelectItem value="chittagong">Chittagong</SelectItem>
                      {/* আরও অপশন যোগ করতে পারবেন */}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Full Address *</Label>
                  <Textarea placeholder="বাড়ি নম্বর, রাস্তা, এলাকা, থানা..." className="mt-1 min-h-24" />
                </div>

                <div>
                  <Label>Order Note (optional)</Label>
                  <Textarea placeholder="বিশেষ কোনো নির্দেশনা থাকলে লিখুন..." className="mt-1" />
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
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { value: "cod", label: "Cash on Delivery", icon: "💵" },
                    { value: "bkash", label: "bKash", icon: "📱" },
                    { value: "nagad", label: "Nagad", icon: "📱" },
                    { value: "card", label: "Card Payment", icon: "💳" },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-all ${
                        paymentMethod === method.value ? "border-blue-600 bg-blue-50" : ""
                      }`}
                    >
                      <RadioGroupItem value={method.value} />
                      <span className="text-2xl">{method.icon}</span>
                      <span className="font-medium">{method.label}</span>
                    </label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Cart & Summary */}
          <div className="lg:col-span-2">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Your Cart
                  <span className="text-sm font-normal text-muted-foreground">({cart.length} items)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 py-3 border-b last:border-0">
                      <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-3xl shrink-0">
                        {item.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium leading-tight">{item.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">{item.variant}</p>
                        <p className="text-sm mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right font-semibold">
                        ৳{(item.price * item.quantity).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                {/* Order Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({cart.length} items)</span>
                    <span>৳{subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Charge</span>
                    <Badge variant={zone === "inside" ? "default" : "secondary"}>
                      ৳{deliveryCharge}
                    </Badge>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-green-600">-৳{discount}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>৳{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full mt-8 text-base font-semibold h-14"
                  onClick={() => alert("Order Placed Successfully! 🎉")}
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
      </div>
    </div>
  );
}