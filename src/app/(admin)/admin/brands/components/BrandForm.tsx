"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GlobalModal } from "@/components/shared/GlobalModal";
import { useCreateBrandMutation } from "@/redux/service/brand";
import { brandSchema, TBrandInput } from "@/components/validations/brands";
import { toast } from "sonner";

export default function BrandForm({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const [createBrand] = useCreateBrandMutation();

  const form = useForm<TBrandInput>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      slug: "",
      status: true,
    },
  });

  const { control } = form;
  const name = form.watch("name");

  //  auto slug (fixed with useEffect)
  useEffect(() => {
    if (name) {
      const slug = name.toLowerCase().replace(/\s+/g, "-");
      form.setValue("slug", slug);
    }
  }, [name, form]);

  //  submit handler
  const onSubmit = async (data: TBrandInput) => {
    console.log({data});
    
    try {
      const result = await createBrand(data).unwrap();
      console.log("Brand created:", result);

      toast.success("Brand created successfully!");
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create brand:", error);
      toast.error("Failed to create brand.");
    }
  };

  return (
    <GlobalModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Create Brand"
      description="Fill the form below to create a new brand"
      icon={<span>🚀</span>}
      footer={
        <div className="flex justify-end gap-2 w-full">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>

          {/*  trigger form submit */}
          <Button onClick={form.handleSubmit(onSubmit)}>
            Create Brand
          </Button>
        </div>
      }
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* Name */}
        <div>
          <Label>Brand Name</Label>
          <Input {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        {/* Slug */}
        <div>
          <Label>Slug</Label>
          <Input {...form.register("slug")} />
        </div>

        {/* Description */}
        <div>
          <Label>Description</Label>
          <Textarea {...form.register("description")} />
        </div>

        {/* Status */}
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <div className="flex items-center justify-between border p-3 rounded-lg">
              <p className="text-sm font-medium">Active Status</p>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </div>
          )}
        />
      </form>
    </GlobalModal>
  );
}