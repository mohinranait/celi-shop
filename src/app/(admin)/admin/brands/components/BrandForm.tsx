"use client";

import { useEffect, useState } from "react";
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
import MediaModal from "../../media/components/MediaModal";
import ImageSelector from "./ImageSelector";
import { LucideImage, Image as LucidImage, Plus, X } from "lucide-react";
import Image from "next/image";

export default function BrandForm({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  // const [logo, setLogo] = useState<string[]>([]);
  // const [banner, setBanner] = useState<string[]>([]);

  const [mediaOpen, setMediaOpen] = useState(false);
  const [activeField, setActiveField] = useState<"logo" | "banner" | null>(null);

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
  const logo = form.watch('logo')
   const banner = form.watch('banner')

  //  auto slug (fixed with useEffect)
  useEffect(() => {
    if (name) {
      const slug = name.toLowerCase().replace(/\s+/g, "-");
      form.setValue("slug", slug);
    }
  }, [name, form]);

  //  submit handler
  const onSubmit = async (data: TBrandInput) => {
    console.log({ data });

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
        <div className="space-y-1">
          <Label>Brand Name</Label>
          <Input {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        {/* Slug */}
        <div className="space-y-1">
          <Label>Slug</Label>
          <Input {...form.register("slug")} />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <Label>Description</Label>
          <Textarea {...form.register("description")} />
        </div>


       <div className="space-y-1">
        <Label>Logo (Optional)</Label>
         <div className="flex gap-3">

          {
            logo && <span
              className="w-24 h-24 rounded-md border-2 border-dashed  
             flex flex-col items-center justify-center gap-1 
              transition-all relative"
            >
              <Image width={100} height={100} alt="Image" src={logo} />
              <button className="text-[10px] w-5 h-5 rounded-full flex items-center justify-center border text-gray-500 absolute top-1 right-1"><X size={14} /></button>
            </span>
          }


          <Button
            type="button"
            variant={'outline'}
            onClick={() => {
              setMediaOpen(true);
              setActiveField('logo')
            }}
            className="w-24 h-24 rounded-md border-2 border-dashed  
             flex flex-col items-center justify-center gap-1 
              transition-all"
          >
            <Plus className="w-5 h-5 text-gray-500" />
            <span className="text-[10px] text-gray-500">Upload</span>
          </Button>

        </div>
       </div>

        <div className="space-y-1">
        <Label>Banner (Optional)</Label>
         <div className="flex gap-3">

          {
            banner && <span
              className="w-24 h-24 rounded-md border-2 border-dashed  
             flex flex-col items-center justify-center gap-1 
              transition-all relative"
            >
              <Image width={100} height={100} alt="Image" src={banner} />
              <button className="text-[10px] w-5 h-5 rounded-full flex items-center justify-center border text-gray-500 absolute top-1 right-1"><X size={14} /></button>
            </span>
          }


          <Button
            type="button"
            variant={'outline'}
            onClick={() => {
              setMediaOpen(true);
              setActiveField('banner')
            }}
            className="w-24 h-24 rounded-md border-2 border-dashed  
             flex flex-col items-center justify-center gap-1 
              transition-all"
          >
            <Plus className="w-5 h-5 text-gray-500" />
            <span className="text-[10px] text-gray-500">Upload</span>
          </Button>

        </div>
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

      <MediaModal
        open={mediaOpen}
        setOpen={setMediaOpen}
        onSelect={(url) => {
          if (activeField === "logo") {
            form.setValue('logo', url[0])
          };
          if (activeField === "banner") {
            form.setValue('banner', url[0])
          };

        }}
      />
    </GlobalModal>
  );
}