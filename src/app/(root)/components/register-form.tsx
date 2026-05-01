"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/hooks/hooks";
import { setLoginModalTab } from "@/redux/features/uiSlice";
import { useRegisterMutation } from "@/redux/service/auth";
import { registerSchema, TRegisterInputs } from "@/components/validations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const RegisterForm = () => {
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
    } catch (err) {
      console.error("Failed to login:", err);
      const fetchError = err as { data?: { error?: string } };
      const errorMessage = fetchError.data?.error || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  return (
    <React.Fragment>
      <h1 className="text-3xl font-bold text-foreground mb-6">Sign Up</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <div>
                <label htmlFor="form-name">Name</label>
                <Input
                  {...field}
                  id="form-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Login button not working on mobile"
                  autoComplete="off"
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <div>
                <label htmlFor="form-phone">Phone</label>
                <Input
                  {...field}
                  id="form-phone"
                  aria-invalid={fieldState.invalid}
                  placeholder="Login button not working on mobile"
                  autoComplete="off"
                />
                {form.formState.errors.phone && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <div>
                <label htmlFor="form-password">Password</label>
                <Input
                  {...field}
                  id="form-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Login button not working on mobile"
                  autoComplete="off"
                />
                {form.formState.errors.password && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Loading..." : "Sing Up"}
        </Button>
      </form>
    </React.Fragment>
  );
};

export default RegisterForm;
