"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User, Package, Star, Settings, LogOut, Edit3, Eye
} from "lucide-react";

type Order = {
  id: string;
  date: string;
  status: "Delivered" | "Processing" | "Cancelled" | "Shipped";
  total: number;
  items: number;
};

const orders: Order[] = [
  { id: "ORD-78492", date: "2026-05-02", status: "Delivered", total: 12500, items: 3 },
  { id: "ORD-78491", date: "2026-04-28", status: "Shipped", total: 8900, items: 2 },
  { id: "ORD-78490", date: "2026-04-15", status: "Delivered", total: 2450, items: 1 },
];

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-72">
            <Card>
              <CardContent className="pt-8">
                <div className="flex flex-col items-center text-center mb-8">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>ME</AvatarFallback>
                  </Avatar>
                  <h2 className="font-semibold text-xl">Md. Ebrahim</h2>
                  <p className="text-sm text-slate-500">ebrahim@gmail.com</p>
                </div>

                <nav className="space-y-1">
                  {[
                    { id: "profile", label: "My Profile", icon: User },
                    { id: "orders", label: "Order History", icon: Package },
                    { id: "reviews", label: "My Reviews", icon: Star },
                    { id: "settings", label: "Settings", icon: Settings },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeTab === item.id
                          ? "bg-slate-900 text-white"
                          : "hover:bg-slate-100"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  ))}

                  <Separator className="my-4" />

                  <Button
                    variant="destructive"
                    className="w-full gap-2"
                    onClick={() => alert("Logged out successfully")}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" /> Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Full Name</Label>
                      <Input defaultValue="Md. Ebrahim" className="mt-2" />
                    </div>
                    <div>
                      <Label>Phone Number</Label>
                      <Input defaultValue="01XXXXXXXXX" className="mt-2" />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Address</Label>
                      <Textarea defaultValue="Mirpur-10, Dhaka, Bangladesh" className="mt-2" />
                    </div>
                  </div>

                  <Button className="gap-2">
                    <Edit3 className="w-4 h-4" /> Save Changes
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-5 border rounded-2xl hover:bg-slate-50 transition">
                          <div>
                            <p className="font-semibold">{order.id}</p>
                            <p className="text-sm text-slate-500">{order.date}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-slate-500">Items</p>
                            <p className="font-medium">{order.items}</p>
                          </div>
                          <div>
                            <Badge
                              variant={order.status === "Delivered" ? "default" : "secondary"}
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">৳{order.total.toLocaleString()}</p>
                          </div>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Eye className="w-4 h-4" /> View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <Card>
                <CardHeader>
                  <CardTitle>My Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border rounded-2xl p-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">Nike Air Max 270</p>
                          <p className="text-sm text-slate-500">Reviewed on 2026-04-20</p>
                        </div>
                        <div className="flex text-yellow-500">★★★★☆</div>
                      </div>
                      <p className="mt-3 text-slate-600">
                        Very comfortable and stylish. Delivery was fast.
                      </p>
                      <Button variant="outline" size="sm" className="mt-4">
                        Edit Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                {/* Update Profile */}
                <Card>
                  <CardHeader>
                    <CardTitle>Update Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Full Name</Label>
                        <Input defaultValue="Md. Ebrahim" />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input type="email" defaultValue="ebrahim@gmail.com" />
                      </div>
                    </div>
                    <Button>Update Profile</Button>
                  </CardContent>
                </Card>

                {/* Change Password */}
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div>
                      <Label>Current Password</Label>
                      <Input type="password" />
                    </div>
                    <div>
                      <Label>New Password</Label>
                      <Input type="password" />
                    </div>
                    <div>
                      <Label>Confirm New Password</Label>
                      <Input type="password" />
                    </div>
                    <Button>Update Password</Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}