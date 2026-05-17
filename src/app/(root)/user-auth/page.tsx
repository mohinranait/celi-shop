"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "../components/login-form";
import RegisterForm from "../components/register-form";

const UserAuthPage = () => {
  return (
    <div className=" bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
      

        {/* Main Card */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
          <CardContent className="p-8">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 h-auto! bg-muted/50">
                <TabsTrigger 
                  value="login" 
                  className="text-base font-semibold data-[state=active]:shadow data-[state=active]:bg-primary data-[state=active]:text-white  bg-muted h-10 "
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="text-base font-semibold data-[state=active]:shadow data-[state=active]:bg-primary data-[state=active]:text-white  bg-muted h-10 "
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="mt-0">
                <LoginForm />
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="mt-0">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer Text */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default UserAuthPage;