"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, TLoginInputs } from "@/components/validations/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "@/redux/service/auth";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/hooks";
import { setUser } from "@/redux/features/authSlice";
import { setLoginModalOpen } from "@/redux/features/uiSlice";
import React, { useState } from "react";
import { Phone, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);

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
      toast("Login successful", {
        description: `Welcome back, ${response.payload.name}!`,
      });
      dispatch(setUser({ user: response.payload }));
      dispatch(setLoginModalOpen({ isOpen: false }));

      if (response.payload.role === 'Admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }

    } catch (err:any) {
      console.error("Failed to login:", err);

      
      let errorMessage = "Something went wrong.";

      if (err?.data?.error) {
        errorMessage = err.data.error;
      } else if (err?.error) {
        errorMessage = err.error;
      } else if (err?.message) {
        errorMessage = err.message;
      }

       toast.error(errorMessage);
    }
  };

  const phoneError = form.formState.errors.phone;
  const passwordError = form.formState.errors.password;

  return (
    <React.Fragment>
      {/* Header */}
      <div className="mb-8">

        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Phone Field */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Phone Number
          </label>
          <div className="relative group">
            {/* Left Icon */}
            <div
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none transition-colors duration-200",
                phoneError
                  ? "text-destructive"
                  : "text-muted-foreground group-focus-within:text-primary"
              )}
            >
              <Phone className="w-4 h-4" />
            </div>

            <Input
              type="tel"
              {...form.register("phone")}
              placeholder="01xxxxxxxx"
              className={cn(
                "pl-10 h-11 transition-all duration-200",
                "border-border/60 focus:border-primary focus-visible:ring-1 focus-visible:ring-primary/30",
                phoneError &&
                "border-destructive focus:border-destructive focus-visible:ring-destructive/30"
              )}
            />
          </div>
          {phoneError && (
            <p className="text-xs text-destructive flex items-center gap-1 mt-1">
              <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
              {phoneError.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative group">
            {/* Left Icon */}
            <div
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none transition-colors duration-200",
                passwordError
                  ? "text-destructive"
                  : "text-muted-foreground group-focus-within:text-primary"
              )}
            >
              <Lock className="w-4 h-4" />
            </div>

            <Input
              type={showPassword ? "text" : "password"}
              {...form.register("password")}
              placeholder="••••••••"
              className={cn(
                "pl-10 pr-10 h-11 transition-all duration-200",
                "border-border/60 focus:border-primary focus-visible:ring-1 focus-visible:ring-primary/30",
                passwordError &&
                "border-destructive focus:border-destructive focus-visible:ring-destructive/30"
              )}
            />

            {/* Eye Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 flex items-center",
                "text-muted-foreground hover:text-foreground transition-colors duration-150",
                "focus:outline-none focus-visible:text-primary"
              )}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {passwordError && (
            <p className="text-xs text-destructive flex items-center gap-1 mt-1">
              <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
              {passwordError.message}
            </p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end">
          <button
            type="button"
            className="text-xs text-primary hover:underline underline-offset-2 transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11 font-semibold text-sm tracking-wide transition-all duration-200"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Signing in...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Sign In
            </span>
          )}
        </Button>
      </form>
    </React.Fragment>
  );
};

export default LoginForm;