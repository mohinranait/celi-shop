"use client";

import {  useEffect, useState } from "react";


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Camera,

  Shield,

} from "lucide-react";


import {  useAppSelector } from "@/hooks/hooks";
import { useGetUserByIdQuery } from "@/redux/service/users";
import ProfileForm from "./components/ProfileForm";

export default function UpdateProfile() {
    const { user } = useAppSelector((state) => state.auth);

   const { data, isLoading:getUserLoading } = useGetUserByIdQuery(user?._id as string, {
      skip: !user?._id,
    });

    const findUser = data?.data;

    if(getUserLoading)return <div>Loading...</div> ;
    if(!findUser) return;




  return (
    <div className="flex-1 space-y-4 px-4 md:px-8 ">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">
            Manage your personal information and settings
          </p>
        </div>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Profile Picture & Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Profile picture</CardTitle>
                <CardDescription>Update your profile picture.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      {/* <AvatarImage src={user?.profile} alt="Profile" /> */}
                      <AvatarFallback className="text-lg">
                        {user?.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium">
                      {user?.name} 
                    </h3>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <Badge variant="outline" className="mt-1">
                      Verifyed
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information Form */}
            <ProfileForm findUser={findUser} />
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Change your password regularly to ensure the security of your
                  account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* <ChangePassword /> */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-factor authentication</CardTitle>
                <CardDescription>
                  Enable 2FA for extra security.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">SMS Verification</h4>
                    <p className="text-sm text-muted-foreground">
                      Send code to phone number
                    </p>
                  </div>
                  <Badge variant="outline">Inactive</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Email Verification</h4>
                    <p className="text-sm text-muted-foreground">
                      Send code to email
                    </p>
                  </div>
                  <Badge>Active</Badge>
                </div>

                <Button variant="outline" className="w-full">
                  Set up 2FA
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification settings</CardTitle>
              <CardDescription>
                Select what type of notifications you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Order update</h4>
                    <p className="text-sm text-muted-foreground">
                      Notification of order status changes
                    </p>
                  </div>
                  <Badge>Active</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Promotional offer</h4>
                    <p className="text-sm text-muted-foreground">
                      Notifications of special discounts and offers
                    </p>
                  </div>
                  <Badge variant="outline">Inactive</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Newsletter</h4>
                    <p className="text-sm text-muted-foreground">
                      Weekly newsletters and updates
                    </p>
                  </div>
                  <Badge>Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
