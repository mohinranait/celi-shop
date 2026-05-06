"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";

import { Plus, Trash2, ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
// import MediaModal from "../../media/components/MediaModal";

type ProductFormType = {
  name: string;
  slug: string;
  description?: string;

  productType: "single" | "variant";

  basePrice?: number;
  comparePrice?: number;
  stock?: number;

  thumbnail?: string;
  gallery: string[];

  selectedAttributes: {
    name: string;
    selectedValues: string[];
  }[];

  variations: {
    name: string;
    price: number;
    sku: string;
    stock: number;
  }[];

  status: "draft" | "active" | "out-of-stock";
};

export default function ProductForm() {
  const [mediaOpen, setMediaOpen] = useState(false);
  const [activeField, setActiveField] = useState<"thumbnail" | "gallery" | null>(null);

  const [selectedConfigs, setSelectedConfigs] = useState<any[]>([]);

  const form = useForm<ProductFormType>({
    defaultValues: {
      gallery: [],
      variations: [],
      productType: "single",
      status: "draft"
    }
  });

  const { control, register, handleSubmit, watch, setValue } = form;

  const productType = watch("productType");
  const name = watch("name");
  const gallery = watch("gallery");
  const thumbnail = watch("thumbnail");

  const { fields, replace, remove } = useFieldArray({
    control,
    name: "variations"
  });

  // 🔥 auto slug
  useEffect(() => {
    if (name) {
      const slug = name.toLowerCase().replace(/\s+/g, "-");
      setValue("slug", slug);
    }
  }, [name]);

  // 🔥 generate variations
  const generateVariations = () => {
    const lists = selectedConfigs.map(c => c.selectedValues);

    const result = lists.reduce((a: any[], b: any[]) => {
      return a.flatMap(d => b.map(e => [...d, e]));
    }, [[]]);

    const formatted = result.map((combo: string[]) => ({
      name: combo.join(" / "),
      price: 0,
      sku: "SKU-" + Math.random().toString(36).slice(7).toUpperCase(),
      stock: 0
    }));

    replace(formatted);
  };

  const onSubmit = async (data: ProductFormType) => {
    const finalData = {
      ...data,
      selectedAttributes: selectedConfigs
    };

    console.log(finalData);

    toast.success("Product Ready 🚀");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* BASIC INFO */}
        <div className="border p-5 rounded-xl space-y-4">
          <h2 className="font-bold text-lg">Basic Info</h2>

          <Input placeholder="Product Name" {...register("name")} />
          <Input placeholder="Slug" {...register("slug")} />
          <Textarea placeholder="Description" {...register("description")} />
        </div>

        {/* PRODUCT TYPE */}
        <div className="border p-5 rounded-xl space-y-4">
          <h2 className="font-bold text-lg">Product Type</h2>

          <Controller
            control={control}
            name="productType"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Product</SelectItem>
                  <SelectItem value="variant">Variant Product</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* MEDIA */}
        <div className="border p-5 rounded-xl space-y-4">
          <h2 className="font-bold text-lg">Media</h2>

          <div className="flex gap-3 flex-wrap">

            {/* thumbnail */}
            {thumbnail && (
              <div className="relative w-24 h-24">
                <Image src={thumbnail} alt="" fill className="rounded-md" />
                <button
                  onClick={() => setValue("thumbnail", "")}
                  className="absolute top-1 right-1 bg-white p-1 rounded-full"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setMediaOpen(true);
                setActiveField("thumbnail");
              }}
            >
              <ImagePlus /> Thumbnail
            </Button>

            {/* gallery */}
            {gallery?.map((img, i) => (
              <div key={i} className="relative w-24 h-24">
                <Image src={img} alt="" fill className="rounded-md" />
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setMediaOpen(true);
                setActiveField("gallery");
              }}
            >
              <Plus /> Gallery
            </Button>
          </div>
        </div>

        {/* SINGLE PRODUCT */}
        {productType === "single" && (
          <div className="border p-5 rounded-xl space-y-4">
            <h2 className="font-bold text-lg">Pricing & Stock</h2>

            <Input type="number" placeholder="Price" {...register("basePrice")} />
            <Input type="number" placeholder="Compare Price" {...register("comparePrice")} />
            <Input type="number" placeholder="Stock" {...register("stock")} />
          </div>
        )}

        {/* VARIANT */}
        {productType === "variant" && (
          <div className="border p-5 rounded-xl space-y-4">
            <h2 className="font-bold text-lg">Variations</h2>

            <Button type="button" onClick={generateVariations}>
              Generate Variations
            </Button>

            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-4 gap-3">
                <Input value={field.name} readOnly />
                <Input type="number" placeholder="Price" {...register(`variations.${index}.price`)} />
                <Input placeholder="SKU" {...register(`variations.${index}.sku`)} />
                <Button onClick={() => remove(index)} variant="destructive">
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* STATUS */}
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <div className="flex justify-between border p-4 rounded-lg">
              <span>Status Active</span>
              <Switch checked={field.value === "active"} onCheckedChange={(v) => field.onChange(v ? "active" : "draft")} />
            </div>
          )}
        />

        <Button type="submit" className="w-full">
          Save Product
        </Button>

      </form>

      {/* MEDIA MODAL */}
      {/* <MediaModal
        open={mediaOpen}
        setOpen={setMediaOpen}
        onSelect={(urls) => {
          if (activeField === "thumbnail") {
            setValue("thumbnail", urls[0]);
          }

          if (activeField === "gallery") {
            setValue("gallery", [...gallery, ...urls]);
          }
        }}
      /> */}
    </div>
  );
}