"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/hooks/hooks";
import { setLoginModalTab } from "@/redux/features/uiSlice";
import { useRegisterMutation } from "@/redux/service/auth";
import { registerSchema, TRegisterInputs } from "@/components/validations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Lock, LogIn, Phone, User } from "lucide-react";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const form = useForm<TRegisterInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (data: TRegisterInputs) => {
    try {
      await register(data).unwrap();

      toast("Register successfull", {
        description: "Monday, January 3rd at 6:00pm",
      });
      dispatch(setLoginModalTab({ tabValue: "login" }));
    } catch (err: any) {
      console.error("Failed to login:", err);
      const fetchError = err as { data?: { error?: string } };
      let errorMessage = fetchError.data?.error || "Something went wrong";

      // let errorMessage = "Something went wrong.";

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

  const nameError = form.formState.errors.name;
  const phoneError = form.formState.errors.phone;
  const passwordError = form.formState.errors.password;

  return (
    <React.Fragment>


      <div className="mb-8">

        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Sign UP
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create a new account to continue
        </p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">



          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Full Name
            </label>
            <div className="relative group">
              {/* Left Icon */}
              <div
                className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none transition-colors duration-200",
                  nameError
                    ? "text-destructive"
                    : "text-muted-foreground group-focus-within:text-primary"
                )}
              >
                <User className="w-4 h-4" />
              </div>

              <Input
                type="text"
                {...form.register("name")}
                placeholder="Name"
                className={cn(
                  "pl-10 h-11 transition-all duration-200",
                  "border-border/60 focus:border-primary focus-visible:ring-1 focus-visible:ring-primary/30",
                  nameError &&
                  "border-destructive focus:border-destructive focus-visible:ring-destructive/30"
                )}
              />
            </div>
            {nameError && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                {nameError.message}
              </p>
            )}
          </div>


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
        </div>



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
              Loading...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Sign Up
            </span>
          )}
        </Button>

      </form>
    </React.Fragment>
  );
};

export default RegisterForm;
