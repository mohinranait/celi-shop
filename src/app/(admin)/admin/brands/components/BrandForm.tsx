"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GlobalModal } from "@/components/shared/GlobalModal";

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  status: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function BrandForm({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,

    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      status: true,
    },
  });

  const name = watch("name");

  // auto slug
  if (name) {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    setValue("slug", slug, { shouldValidate: true });
  }

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (

    <GlobalModal
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Create Project"
        description="Fill the form below to create a new project"
        icon={<span>🚀</span>}

        footer={<div className="flex justify-end gap-2  w-full">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={() => handleSubmit(onSubmit)}>Create Brand</Button>
        </div>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Name */}
        <div>
          <Label>Brand Name</Label>
          <Input {...register("name")} />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <Label>Slug</Label>
          <Input {...register("slug")} />
        </div>

        {/* Description */}
        <div>
          <Label>Description</Label>
          <Textarea {...register("description")} />
        </div>

        {/* Status (Controlled Component) */}
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <div className="flex items-center justify-between border p-3 rounded-lg">
              <div>
                <p className="text-sm font-medium">Active Status</p>
              </div>

              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </div>
          )}
        />

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
            
    </GlobalModal>
   
  );
}