"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


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
  Loader2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import MediaModal from "../../../media/components/MediaModal";
import { useGetBrandsQuery } from "@/redux/service/brand";
import { useGetCategoriesQuery } from "@/redux/service/categories";
import { useCreateProductMutation } from "@/redux/service/products";
import { productSchema, TProductFormType } from "@/components/validations/product";
import SectionCard from "./SectionCard";
import { FormField } from "./FormField";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";




const useGetAttributesQuery = () => ({
  data: [
    { _id: "a1", name: "Color", values: ["Red", "Green", "Blue", "Black", "White"] },
    { _id: "a2", name: "Size", values: ["XS", "S", "M", "L", "XL", "XXL"] },
    { _id: "a3", name: "Material", values: ["Cotton", "Polyester", "Leather", "Wool"] },
  ],
  isLoading: false,
});


interface IAttributeConfig {
  attributeId: string;
  name: string;
  selectedValues: string[];
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

  // const errors = form.formState.errors.variations;
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
    const attr = attributes.find((a: { _id: string }) => a._id === attrId);
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

      router.back();
      toast.success("Product published successfully!");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const getFieldError = (index: number, field: string) => {
    return errors.variations?.[index]?.[field as keyof typeof errors.variations[number]];
  };

  const variations = watch("variations");

  useEffect(() => {
    variations?.forEach((item, index: number) => {
      const price = Number(item.price) || 0;
      const fixed = Number(item.offerPriceFixed);
      const percent = Number(item.offerPriceParcent);

      // FIXED → PERCENT
      if (fixed >= 0 && price > 0 && fixed <= price) {
        const calculatedPercent = ((price - fixed) / price) * 100;

        setValue(
          `variations.${index}.offerPriceParcent`,
          Number(calculatedPercent.toFixed(2))
        );
      }

      // PERCENT → FIXED
      if (percent >= 0 && price > 0 && percent <= 100) {
        const calculatedFixed = price - (price * percent) / 100;

        setValue(
          `variations.${index}.offerPriceFixed`,
          Number(calculatedFixed.toFixed(2))
        );
      }
    });
  }, [variations, setValue]);



  const updateDiscountFromFixed = useCallback((index: number, discountAmount: number) => {
    const price = Number(watch(`variations.${index}.price`)) || 0;
    if (price > 0) {
      const percent = (discountAmount / price) * 100;
      setValue(`variations.${index}.offerPriceParcent`, Number(percent.toFixed(2)));
    }
  }, [watch, setValue]);

  const updateDiscountFromPercent = useCallback((index: number, percent: number) => {
    const price = Number(watch(`variations.${index}.price`)) || 0;
    if (price > 0) {
      const discountAmount = (price * percent) / 100;
      setValue(`variations.${index}.offerPriceFixed`, Number(discountAmount.toFixed(2)));
    }
  }, [watch, setValue]);

  const updatePercentFromPrice = useCallback((index: number, newPrice: number) => {
    const fixedDiscount = Number(watch(`variations.${index}.offerPriceFixed`)) || 0;
    if (newPrice > 0 && fixedDiscount > 0) {
      const percent = (fixedDiscount / newPrice) * 100;
      setValue(`variations.${index}.offerPriceParcent`, Number(percent.toFixed(2)));
    }
  }, [watch, setValue]);


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
                className="text-sm min-h-25 resize-none"
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
                <div className="border rounded-lg overflow-hidden bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 hover:bg-slate-50">
                        <TableHead className="w-[20%] font-semibold">Variant Name</TableHead>
                        <TableHead className="w-[15%] font-semibold">Price</TableHead>
                        <TableHead className="w-[15%] font-semibold">Discount </TableHead>
                        <TableHead className="w-[15%] font-semibold">Discount(%) </TableHead>
                        <TableHead className="w-[15%] font-semibold">SKU</TableHead>
                        <TableHead className="w-[12%] font-semibold text-center">Stock</TableHead>
                        <TableHead className="w-[12%] font-semibold text-center">Alert</TableHead>
                        <TableHead className="w-[11%] text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <div className="text-sm text-muted-foreground">
                              {` No variations added yet. Click "Add Variation" to get started.`}
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        fields.map((field, index) => (
                          <TableRow
                            key={field.id}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            {/* Variant Name */}
                            <TableCell>
                              <div className="flex gap-1 items-center ">
                                <div>
                                  <div className="w-8 h-8 rounded-md bg-muted"></div>
                                </div>
                                <div className="space-y-1">
                                  <Input
                                    placeholder="e.g., Red Size M"
                                    {...control.register(`variations.${index}.name`)}
                                    readOnly
                                    disabled
                                    className={cn(
                                      "h-8 text-sm",
                                      getFieldError(index, "name") && "border-red-500"
                                    )}
                                  />
                                  {getFieldError(index, "name") && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                      <AlertCircle size={12} />
                                      {getFieldError(index, "name")}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              <Input
                                type="number"
                                step="1"
                                min="0"
                                {...register(`variations.${index}.price`, {
                                  onChange: (e) => {
                                    const val = Number(e.target.value) || 0;
                                    setValue(`variations.${index}.price`, val);
                                    updatePercentFromPrice(index, val);
                                  },
                                })}
                              />
                            </TableCell>

                            <TableCell>
                              <Input
                                type="number"
                                step="1"
                                min="0"
                                placeholder="0.00"
                                {...register(`variations.${index}.offerPriceFixed`, {
                                  onChange: (e) => {
                                    const val = Number(e.target.value) || 0;
                                    setValue(`variations.${index}.offerPriceFixed`, val);
                                    updateDiscountFromFixed(index, val);
                                  },
                                })}
                                className="h-8 text-sm"
                              />
                            </TableCell>

                            {/* Discount Percentage */}
                            <TableCell>
                              <Input
                                type="number"
                                step="1"
                                min="0"
                                max="100"
                                placeholder="0.00"
                                {...register(`variations.${index}.offerPriceParcent`, {
                                  onChange: (e) => {
                                    let val = Number(e.target.value) || 0;
                                    if (val > 100) val = 100;
                                    setValue(`variations.${index}.offerPriceParcent`, val);
                                    updateDiscountFromPercent(index, val);
                                  },
                                })}
                                className="h-8 text-sm"
                              />
                            </TableCell>



                            {/* SKU */}
                            <TableCell>
                              <div className="space-y-1">
                                <Input
                                  placeholder="SKU-001"
                                  {...control.register(`variations.${index}.sku`)}
                                  className={cn(
                                    "h-8 text-sm",
                                    getFieldError(index, "sku") && "border-red-500"
                                  )}
                                />
                                {getFieldError(index, "sku") && (
                                  <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle size={12} />
                                    {getFieldError(index, "sku")}
                                  </p>
                                )}
                              </div>
                            </TableCell>

                            {/* Stock */}
                            <TableCell>
                              <div className="space-y-1">
                                <Input
                                  type="number"
                                  inputMode="numeric"
                                  step="1"
                                  min="0"
                                  placeholder="0"
                                  {...control.register(`variations.${index}.stock`)}
                                  className={cn(
                                    "h-8 text-sm text-center",
                                    getFieldError(index, "stock") && "border-red-500"
                                  )}
                                />
                                {getFieldError(index, "stock") && (
                                  <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle size={12} />
                                    {getFieldError(index, "stock")}
                                  </p>
                                )}
                              </div>
                            </TableCell>

                            {/* Low Stock Alert */}
                            <TableCell>
                              <div className="space-y-1">
                                <Input
                                  type="number"
                                  inputMode="numeric"
                                  step="1"
                                  min="0"
                                  placeholder="5"
                                  {...control.register(`variations.${index}.lowStockAlert`)}
                                  className={cn(
                                    "h-8 text-sm text-center",
                                    getFieldError(index, "lowStockAlert") && "border-red-500"
                                  )}
                                />
                                {getFieldError(index, "lowStockAlert") && (
                                  <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle size={12} />
                                    {getFieldError(index, "lowStockAlert")}
                                  </p>
                                )}
                              </div>
                            </TableCell>

                            {/* Actions */}
                            <TableCell className="text-right">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => remove(index)}
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Delete variation</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
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