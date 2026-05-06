"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  ArrowLeft,
  Plus,
  Trash2,
  RefreshCw,
  ImagePlus,
  X,
  Package,
  Tag,
  Layers,
  Settings2,
  ChevronDown,
  ChevronUp,
  Info,
  Loader2,
  Sparkles,
} from "lucide-react";
import MediaModal from "../../../media/components/MediaModal";
import { useGetBrandsQuery } from "@/redux/service/brand";
import { useGetCategoriesQuery } from "@/redux/service/categories";
import { useCreateProductMutation } from "@/redux/service/products";
import { productSchema, TProductFormType } from "@/components/validations/product";




const useGetAttributesQuery = () => ({
  data: [
    { _id: "a1", name: "Color", values: ["Red", "Green", "Blue", "Black", "White"] },
    { _id: "a2", name: "Size", values: ["XS", "S", "M", "L", "XL", "XXL"] },
    { _id: "a3", name: "Material", values: ["Cotton", "Polyester", "Leather", "Wool"] },
  ],
  isLoading: false,
});
// ---------------------------------------------------------------------------


interface IAttributeConfig {
  attributeId: string;
  name: string;
  selectedValues: string[];
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectionCard({
  icon,
  title,
  description,
  children,
  collapsible = false,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  collapsible?: boolean;
}) {
  const [open, setOpen] = useState(true);
  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardHeader
        className={`pb-3 ${collapsible ? "cursor-pointer select-none" : ""}`}
        onClick={collapsible ? () => setOpen(!open) : undefined}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-slate-100 text-slate-600">
              {icon}
            </span>
            <div>
              <CardTitle className="text-sm font-semibold text-slate-800">
                {title}
              </CardTitle>
              {description && (
                <p className="text-xs text-slate-500 mt-0.5">{description}</p>
              )}
            </div>
          </div>
          {collapsible && (
            <span className="text-slate-400">
              {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          )}
        </div>
      </CardHeader>
      {open && (
        <CardContent className="pt-0 space-y-4">{children}</CardContent>
      )}
    </Card>
  );
}

function FormField({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Label className="text-xs font-medium text-slate-700">
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </Label>
        {hint && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={12} className="text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{hint}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {children}
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function AddProductForm() {
  const router = useRouter();

  const [createProduct, { isLoading: createLoading }] = useCreateProductMutation()

  // RTK Query hooks
  const { data: getBrands, isLoading: brandsLoading } = useGetBrandsQuery(``);
  const brands = getBrands?.data
  const { data: getCategories, isLoading: categoriesLoading } =
    useGetCategoriesQuery(``);
  const categories = getCategories?.data;
  const { data: attributes = [], isLoading: attributesLoading } =
    useGetAttributesQuery();

  // Local state
  const [mediaOpen, setMediaOpen] = useState(false);
  const [selectedConfigs, setSelectedConfigs] = useState<IAttributeConfig[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);

  // React Hook Form
  const form = useForm<TProductFormType & { productType: "single" | "variant" }>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      status: true,
      category: "",
      productType: "single",
      variations: [],
    },
  });

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = form;

  const { fields, replace, remove } = useFieldArray({
    control,
    name: "variations",
  });

  // Auto-generate slug
  const watchedName = watch("name");
  const productType = watch("productType");
  console.log(form.getValues());

  useEffect(() => {
    if (watchedName) {
      setValue("slug", watchedName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
    }
  }, [watchedName, setValue]);

  // ---------------------------------------------------------------------------
  // Attribute config handlers
  // ---------------------------------------------------------------------------
  const addAttributeRow = () => {
    setSelectedConfigs([...selectedConfigs, { attributeId: "", name: "", selectedValues: [] }]);
  };

  const removeAttributeRow = (idx: number) => {
    setSelectedConfigs(selectedConfigs.filter((_, i) => i !== idx));
  };

  const updateAttributeType = (idx: number, attrId: string) => {
    const attr = attributes.find((a: {_id:string}) => a._id === attrId);
    const newConfigs = [...selectedConfigs];
    newConfigs[idx] = { attributeId: attrId, name: attr?.name ?? "", selectedValues: [] };
    setSelectedConfigs(newConfigs);
  };

  const toggleAttributeValue = (idx: number, value: string) => {
    const newConfigs = [...selectedConfigs];
    const current = newConfigs[idx].selectedValues;
    newConfigs[idx].selectedValues = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setSelectedConfigs(newConfigs);
  };

  // ---------------------------------------------------------------------------
  // Generate variations (cartesian product)
  // ---------------------------------------------------------------------------
  const generateVariations = () => {
    const lists = selectedConfigs
      .map((c) => c.selectedValues)
      .filter((l) => l.length > 0);

    if (lists.length === 0) {
      toast.error("Please select at least one attribute value.");
      return;
    }

    const cartesian = lists.reduce<string[][]>(
      (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
      [[]]
    );

    replace(
      cartesian.map((combo) => ({
        name: combo.join(" / "),
        price: 0,
        offerPriceFixed: 0,
        offerPriceParcent: 0,
        costPrice: 0,
        lowStockAlert: 1,
        sku: `SKU-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
        stock: 0,
      }))
    );

    toast.success(`${cartesian.length} variation(s) generated!`);
  };

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------
  const onSubmit = async (data: TProductFormType) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        images: productImages,
        selectedAttributes: selectedConfigs,
      };

      console.log({ payload });


      await createProduct(payload)


      // const res = await fetch("/api/admin/products", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });

      // if (res.ok) {
      //   toast.success("Product published successfully!");
      //   router.back();
      // } else {
      //   toast.error("Failed to save product.");
      // }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen ">
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-20  px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-slate-500 hover:text-slate-800 gap-1.5 text-xs"
          >
            <ArrowLeft size={14} /> Back
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <div>
            <h1 className="text-sm font-semibold text-slate-800 leading-none">
              Add New Product
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in the details to publish your product
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          
          <Button
            size="sm"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="h-8 text-xs gap-1.5 bg-slate-900 hover:bg-slate-700"
          >
            {isSubmitting ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Sparkles size={13} />
            )}
            Publish Product
          </Button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-[1fr_320px] gap-6 items-start">
        {/* ── Left column ── */}
        <div className="space-y-5">
          {/* Basic Info */}
          <SectionCard
            icon={<Package size={15} />}
            title="Product Information"
            description="Basic details about your product"
          >
            <FormField label="Product Name" required error={errors.name?.message}>
              <Input
                {...register("name")}
                placeholder="e.g. Classic Running Shoe"
                className="h-9 text-sm"
              />
            </FormField>

            <FormField
              label="Slug"
              hint="Auto-generated from product name. You can edit it."
            >
              <div className="flex items-center">
                <span className="px-3 h-9 flex items-center border border-r-0 rounded-l-md bg-slate-50 text-xs text-slate-500 border-slate-200">
                  /products/
                </span>
                <Input
                  {...register("slug")}
                  placeholder="classic-running-shoe"
                  className="h-9 text-sm rounded-l-none"
                />
              </div>
            </FormField>

            <FormField label="Description">
              <Textarea
                {...register("description")}
                placeholder="Describe your product..."
                className="text-sm min-h-[100px] resize-none"
              />
            </FormField>
          </SectionCard>

          {/* Images */}
          <SectionCard
            icon={<ImagePlus size={15} />}
            title="Product Images"
            description="Select images from your media library"
          >
            <div className="flex flex-wrap gap-3">
              {productImages.map((url, i) => (
                <div
                  key={i}
                  className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 group"
                >
                  <Image src={url} alt="product" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setProductImages(productImages.filter((_, j) => j !== i))}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setMediaOpen(true)}
                className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-600"
              >
                <Plus size={18} />
                <span className="text-[10px] font-medium">Add Image</span>
              </button>
            </div>

            {productImages.length === 0 && (
              <p className="text-xs text-slate-400">
                {`No images selected. Click "Add Image" to open the media library.`}
              </p>
            )}
          </SectionCard>



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


          {productType === "single" && (
            <div className="border p-5 rounded-xl space-y-4">
              <h2 className="font-bold text-lg">Pricing & Stock</h2>

              <Input type="number" placeholder="Price" {...register("price")} />
              <Input type="number" placeholder="Discount Price" {...register("discountPrice")} />
              <Input type="number" placeholder="Discount Parcent" {...register("discountParcent")} />
              <Input type="number" placeholder="Stock" {...register("stock")} />
            </div>
          )}

          {/* Attributes & Variations */}
          <SectionCard
            icon={<Settings2 size={15} />}
            title="Attributes & Variations"
            description="Define product variants like size, color, etc."
          >
            {/* Attribute rows */}
            <div className="space-y-3">
              {selectedConfigs.map((config, idx) => {
                const attr = attributes.find((a) => a._id === config.attributeId);
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Label className="text-xs text-slate-600 mb-1.5 block">
                          Attribute Type
                        </Label>
                        <Select
                          value={config.attributeId}
                          onValueChange={(val) => updateAttributeType(idx, val)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select attribute..." />
                          </SelectTrigger>
                          <SelectContent>
                            {attributes.map((a) => (
                              <SelectItem key={a._id} value={a._id}>
                                {a.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttributeRow(idx)}
                        className="mt-5 p-1.5 rounded-md text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {attr && (
                      <div>
                        <Label className="text-xs text-slate-600 mb-2 block">
                          Select Values
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {attr.values.map((val: string) => {
                            const active = config.selectedValues.includes(val);
                            return (
                              <button
                                key={val}
                                type="button"
                                onClick={() => toggleAttributeValue(idx, val)}
                                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${active
                                  ? "bg-slate-900 text-white border-slate-900"
                                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                                  }`}
                              >
                                {val}
                              </button>
                            );
                          })}
                        </div>
                        {config.selectedValues.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {config.selectedValues.map((v) => (
                              <Badge
                                key={v}
                                variant="secondary"
                                className="text-[10px] h-5"
                              >
                                {v}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAttributeRow}
                className="text-xs gap-1.5 flex-1"
              >
                <Plus size={13} /> Add Attribute
              </Button>
              {selectedConfigs.length > 0 && (
                <Button
                  type="button"
                  size="sm"
                  onClick={generateVariations}
                  className="text-xs gap-1.5 flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <RefreshCw size={13} /> Generate Variations
                </Button>
              )}
            </div>

            {/* Variation list */}
            {productType === "variant" && fields.length > 0 && (
              <div className="mt-2 space-y-2">
                <Separator />
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-700">
                    Variations ({fields.length})
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Set price, SKU, and stock for each
                  </p>
                </div>

                {/* Header */}
                <div className="grid grid-cols-12 gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
                  <span className="col-span-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                    Variant
                  </span>
                  <span className="col-span-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                    Price
                  </span>
                  <span className="col-span-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                    SKU
                  </span>
                  <span className="col-span-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                    Stock
                  </span>
                  <span className="col-span-1" />
                </div>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-12 gap-2 items-center px-3 py-2.5 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors bg-white"
                  >
                    <div className="col-span-4 flex items-center gap-2">
                      <div className="w-1.5 h-6 rounded-full bg-indigo-400/60" />
                      <span className="text-xs font-medium text-slate-700 truncate">
                        {field.name}
                      </span>
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...register(`variations.${index}.price`)}
                        className="h-7 text-xs"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        placeholder="SKU-XXXX"
                        {...register(`variations.${index}.sku`)}
                        className="h-7 text-xs"
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        type="number"
                        placeholder="0"
                        {...register(`variations.${index}.stock`)}
                        className="h-7 text-xs"
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-5 sticky top-16">
          {/* Organization */}
          <SectionCard
            icon={<Layers size={15} />}
            title="Organization"
            description="Brand & category"
          >
            <FormField label="Brand">
              <Controller
                control={control}
                name="brand"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(e) => {
                      console.log({ e });

                      field.onChange(e)
                    }}
                    disabled={brandsLoading}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Select brand..." />
                    </SelectTrigger>
                    <SelectContent>
                      {brands?.map((b) => (
                        <SelectItem key={b._id} value={b._id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField label="Category">
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={categoriesLoading}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </SectionCard>

          {/* Product Tags */}
          <SectionCard
            icon={<Tag size={15} />}
            title="Tags"
            description="Optional product tags"
            collapsible
          >
            <Input
              placeholder="tag1, tag2, tag3"
              className="h-9 text-sm"
            />
            <p className="text-[10px] text-slate-400">Separate tags with commas</p>
          </SectionCard>

          {/* Quick Summary */}
          <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-3">
            <p className="text-xs font-semibold text-slate-700">Quick Summary</p>
            <div className="space-y-2">
              {[
                {
                  label: "Attributes",
                  value: `${selectedConfigs.filter((c) => c.name).length} selected`,
                },
                { label: "Variations", value: `${fields.length} generated` },
                { label: "Images", value: `${productImages.length} uploaded` },
              ].map((item) => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-xs text-slate-500">{item.label}</span>
                  <span className="text-xs font-medium text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>
            <Separator />
            <Button
              size="sm"
              className="w-full text-xs gap-1.5 bg-slate-900 hover:bg-slate-700"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Sparkles size={13} />
              )}
              {isSubmitting ? "Publishing..." : "Publish Product"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs"
              type="button"
              onClick={() => {
                // setValue("status", "draft");
                handleSubmit(onSubmit)();
              }}
              disabled={isSubmitting}
            >
              Save as Draft
            </Button>
          </div>
        </div>
      </div>

      {/* ── Media Modal ── */}
      <MediaModal
        open={mediaOpen}
        setOpen={setMediaOpen}
        onSelect={(urls: string[]) => {
          setProductImages((prev) => [...prev, ...urls]);
        }}
      />
    </div>
  );
}