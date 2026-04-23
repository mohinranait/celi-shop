"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, TLoginInputs } from "@/validations/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "@/redux/service/auth";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/hooks";
import { setUser } from "@/redux/features/authSlice";
import { setLoginModalOpen } from "@/redux/features/uiSlice";
import React from "react";

const LoginForm = () => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const form = useForm<TLoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (data: TLoginInputs) => {
    try {
      const response = await login(data).unwrap();
      toast("Login successfull", {
        description: `Welcome back, ${response.payload.name}!`,
      });
      dispatch(setUser({ user: response.payload }));
      dispatch(setLoginModalOpen({ isOpen: false }));
    } catch (err) {
      console.error("Failed to login:", err);
    }
  };

  return (
    <React.Fragment>
      <h1 className="text-3xl font-bold text-foreground mb-6">Sign In</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Phone
          </label>
          <Input
            type="number"
            {...form.register("phone")}
            placeholder="01xxxxxxx"
          />
          {form.formState.errors.phone && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Password
          </label>
          <Input
            type="password"
            {...form.register("password")}
            placeholder="••••••••"
          />
          {form.formState.errors.password && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full">
          {isLoading ? "Loading..." : "Sign In"}
        </Button>
      </form>
    </React.Fragment>
  );
};

export default LoginForm;
