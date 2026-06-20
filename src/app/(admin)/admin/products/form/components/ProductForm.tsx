"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";


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
  VectorSquare,
} from "lucide-react";
import MediaModal from "../../../media/components/MediaModal";
import { useGetBrandsQuery } from "@/redux/service/brand";
import { useGetCategoriesQuery } from "@/redux/service/categories";
import { useCreateProductMutation, useGetProductByIdQuery, useUpdateProductMutation } from "@/redux/service/products";
import { productSchema, TProductFormType } from "@/components/validations/product";
import SectionCard from "./SectionCard";
import { FormField } from "./FormField";

import SingleProduct from "./single-product";
import VariantTable from "./variant-table";
import { useGetAttributesQuery } from "@/redux/service/attributes";
import { Card } from "@/components/ui/card";
import { ProductFormSkeleton } from "./skeletion";
import { Switch } from "@/components/ui/switch";
import NestedCategorySelector from "./NextedCategorySelector";
import QuillEditor from "@/components/shared/QuilEditor";



interface IAttributeConfig {
  attributeId: string;
  name: string;
  selectedValues: string[];
}



// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function AddProductForm() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('pid');



  const router = useRouter();

  const [createProduct, { isLoading: createLoading }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updateLoading }] = useUpdateProductMutation()
  const { data: getSingleProduct, isLoading: productLoading } = useGetProductByIdQuery(productId!, {
    skip: !productId,
  });
  const product = getSingleProduct?.data;


  // RTK Query hooks
  const { data: getBrands, isLoading: brandsLoading } = useGetBrandsQuery(``);
  const brands = getBrands?.data
  const { data: getCategories, isLoading: categoriesLoading } =
    useGetCategoriesQuery(``);
  const categories = getCategories?.data;
  const { data: getAttributes, isLoading: attributesLoading } =
    useGetAttributesQuery(``);

  const attributes = getAttributes?.data;

  // Local state
  const [mediaOpen, setMediaOpen] = useState(false);
  const [selectedConfigs, setSelectedConfigs] = useState<IAttributeConfig[]>([]);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string>('')

  // React Hook Form
  const form = useForm<TProductFormType>({
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


  // console.log({errors});


  // Auto-generate slug
  const watchedName = watch("name");
  const productType = watch("productType");

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
    const attr = attributes?.find((a: { _id: string }) => a._id === attrId);
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

    try {
      const payload = {
        ...data,
        gallery: productImages,
        selectedAttributes: selectedConfigs,
      };

      // console.log({ payload });

      let url = '';

      if (product) {
        const { data } = await updateProduct({ id: product?._id, payload })
        url = data?.data?._id as string;
      } else {
        const { data } = await createProduct(payload);
        url = data?.data?._id as string;
      }



      router.push(`/admin/products/form?pid=${url}`);
      toast.success("Successfully!");
    } catch {
      toast.error("Something went wrong.");
    } 
  };


  // console.log({ errors });



  // const variations = watch("variations");

  // useEffect(() => {
  //   variations?.forEach((item, index: number) => {
  //     const price = Number(item.price) || 0;
  //     const fixed = Number(item.offerPriceFixed);
  //     const percent = Number(item.offerPriceParcent);

  //     // FIXED → PERCENT
  //     if (fixed >= 0 && price > 0 && fixed <= price) {
  //       const calculatedPercent = ((price - fixed) / price) * 100;

  //       console.log({calculatedPercent});
        

  //       setValue(
  //         `variations.${index}.offerPriceParcent`,
  //         Number(calculatedPercent.toFixed(2))
  //       );
  //     }

  //     // PERCENT → FIXED
  //     if (percent >= 0 && price > 0 && percent <= 100) {
  //       const calculatedFixed = price - (price * percent) / 100;

  //       setValue(
  //         `variations.${index}.offerPriceFixed`,
  //         Number(calculatedFixed.toFixed(2))
  //       );
  //     }
  //   });
  // }, [variations, setValue]);

  const currentTags = watch("tags") || [];

  useEffect(() => {
    if (!product) return;
    form.reset({
      ...form.getValues(),
      ...product,
    })

    setSelectedConfigs(product.selectedAttributes)
    setProductImages(product?.gallery)

  }, [product, form])



  const handleValueTags = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
      e.preventDefault();
      const val = tags.trim().replace(",", "");
      if (val && !currentTags.includes(val)) {
        setValue("tags", [...currentTags, val], { shouldValidate: true });
        setTags("");
      }
    }
  };


  // Remove value
  const removeValue = (valToRemove: string) => {
    setValue("tags", currentTags.filter(v => v !== valToRemove), { shouldValidate: true });
  };



  if (productLoading) return <ProductFormSkeleton />

  return (
    <div className="min-h-screen ">
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-20  lg:px-6 py-3 lg:flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-accent-foreground gap-1.5 text-xs"
          >
            <ArrowLeft size={14} /> Back
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <div>
            <h1 className="text-sm font-semibold text-accent-foreground leading-none">
              Add New Product
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Fill in the details to publish your product
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">

          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={ createLoading || updateLoading }
            className="h-8 text-xs gap-1.5 "
          >
            {(createLoading || updateLoading) ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Sparkles size={13} />
            )}
            Publish Product
          </Button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto lg:px-6 py-8 grid lg:grid-cols-[1fr_320px] gap-6 items-start">
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
                <span className="px-3 h-9 flex items-center border border-r-0 rounded-l-md bg-muted text-xs text-muted-foreground border-border">
                  /products/
                </span>
                <Input
                  {...register("slug")}
                  placeholder="classic-running-shoe"
                  className="h-9 text-sm rounded-l-none"
                />
              </div>
            </FormField>




            <div className="flex gap-2 items-center">
              <FormField
                label="feature"
                hint="Its will appear in the featured section on the homepage."
              >
                <div className="flex items-center">
                  <Switch
                    checked={form.watch("isFeatured") === true}
                    onCheckedChange={(value) => form.setValue("isFeatured", value, { shouldValidate: true })}
                  />
                </div>
              </FormField>
              <FormField
                label="Free Delivery"
                hint="If enabled, this product will be marked as eligible for free delivery."
              >
                <div className="flex items-center">
                  <Switch
                    checked={form.watch("shipping.isFreeShipping") === true }
                    onCheckedChange={(value) => form.setValue("shipping.isFreeShipping", value, { shouldValidate: true })}
                  />
                </div>
              </FormField>
              <FormField
                label="Status"
                hint="Product will be visible to customers."
              >
                <div className="flex items-center">
                  <Switch
                    checked={form.watch("status") === true }
                    onCheckedChange={(value) => form.setValue("status", value, { shouldValidate: true })}
                  />
                </div>
              </FormField>
            </div>

            <FormField label="Short Description">
              <Textarea
                {...register("shortDescription")}
                placeholder="Short description your product..."
                className="text-sm min-h-25 resize-none"
              />
            </FormField>



          </SectionCard>




          <div className="space-y-1">
            <Label>Select Category</Label>

            {
              categories?.length &&
              <NestedCategorySelector
                categories={categories || []}
                value={watch("category")}
                onChange={(id) => setValue("category", id, { shouldValidate: true })}
                error={errors.category?.message}
              />
            }
          </div>

          {/* Images */}
          <SectionCard
            icon={<ImagePlus size={15} />}
            title="Product Images & Video"
            description="Select images from your media library"
          >
            <div className="space-y-6">
              <div>
                <div className="flex flex-wrap gap-3">
                  {productImages.map((url, i) => (
                    <div
                      key={i}
                      className="relative w-24 h-24 rounded-lg overflow-hidden border border-border group"
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
                    className="w-24 h-24 rounded-lg border-2 border-dashed border-border   transition-all flex flex-col items-center justify-center gap-1 text-accent-foreground "
                  >
                    <Plus size={18} />
                    <span className="text-[10px] font-medium">Add Image</span>
                  </button>
                </div>

                {productImages.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    {`No images selected. Click "Add Image" to open the media library.`}
                  </p>
                )}
              </div>
              <FormField label="Product Video URL (Optional)" >
                <Input
                  {...register("videoUrl")}
                  placeholder="Youtube Video URL"
                  className="h-9 text-sm"
                />
              </FormField>
            </div>
          </SectionCard>



          <SectionCard
            icon={<VectorSquare size={15} />}
            title="Product Type"
            description="Define product variants like single, variant"
          >

            <Controller
              control={control}
              name="productType"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <SelectTrigger className="min-w-56">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Product</SelectItem>
                    <SelectItem value="variant">Variant Product</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </SectionCard>


          {productType === "single" && <SingleProduct form={form} />}

          {/* Attributes & Variations */}
          <SectionCard
            icon={<Settings2 size={15} />}
            title="Attributes & Variations"
            description="Define product variants like size, color, etc."
          >
            {/* Attribute rows */}
            <div className="space-y-3">
              {selectedConfigs.map((config, idx) => {
                const attr = attributes?.find((a) => a._id === config.attributeId);
                return (
                  <div
                    key={idx}
                    className="border border-border rounded-xl p-4 bg-muted space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground mb-1.5 block">
                          Attribute Type
                        </Label>
                        <Select
                          value={config.attributeId}
                          onValueChange={(val) => updateAttributeType(idx, val)}
                        >
                          <SelectTrigger className="h-8 min-w-sm ">
                            <SelectValue placeholder="Select attribute..." />
                          </SelectTrigger>
                          <SelectContent>
                            {attributes?.map((a) => (
                              <SelectItem key={a._id} value={a._id}>
                                {a.displayName}
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
                        <Label className="text-xs text-muted-foreground mb-2 block">
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
                                className={`px-3 py-1 rounded-full  text-xs font-medium border transition-all ${active
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
                                variant="outline"
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

                onClick={addAttributeRow}
                className="text-xs gap-1.5 flex-1"
              >
                <Plus size={13} /> Add Attribute
              </Button>
              {productType === "variant" && (
                <Button
                  type="button"

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
                  <p className="text-xs font-semibold text-muted-foreground">
                    Variations ({fields.length})
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Set price, SKU, and stock for each
                  </p>
                </div>

                {/* Header */}
                <VariantTable form={form} remove={remove} fields={fields} />
              </div>
            )}
          </SectionCard>



          <SectionCard
            icon={<Package size={15} />}
            title="Product Description"
            description="Write details about your product"
          >

            <FormField label="Description">
              
              <div className="border border-gray-200 rounded-lg ">
                <QuillEditor
                  value={form.watch("description") || ""}
                  callBack={(value) =>
                    form.setValue("description", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                />
              </div>
            </FormField>



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
                      // console.log({ e });

                      field.onChange(e)
                    }}
                    disabled={brandsLoading}
                  >
                    <SelectTrigger className="h-9 text-sm w-full">
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
                  <div>

                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={categoriesLoading}
                    >
                      <SelectTrigger className="h-9 text-sm w-full">
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
                    {
                      errors.category &&
                      <p className="text-xs text-red-500">{errors?.category?.message}</p>
                    }
                  </div>
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
            <div className="flex gap-1 flex-wrap">
              {currentTags.map((val, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                  {val}
                  <span onClick={() => removeValue(val)}>
                    <X className="w-3 h-3 cursor-pointer hover:text-red-500" />
                  </span>
                </Badge>
              ))}
            </div>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              onKeyDown={handleValueTags}
              placeholder="Seperate with comma"
              className="h-9 text-sm"
            />
            <p className="text-[10px] text-slate-400">Separate tags with commas</p>
          </SectionCard>

          {/* Quick Summary */}
          <Card className="rounded-xl border border-border p-4 space-y-3">
            <p className="text-xs font-semibold ">Quick Summary</p>
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
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className="text-xs font-medium text-muted-foreground">{item.value}</span>
                </div>
              ))}
            </div>
            <Separator />
            <Button
              className="w-full text-xs gap-1.5 "
              onClick={handleSubmit(onSubmit)}
              disabled={createLoading || updateLoading}
            >
              {(createLoading || updateLoading) ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Sparkles size={13} />
              )}
              {(createLoading || updateLoading) ? "Publishing..." : "Publish Product"}
            </Button>
            <Button
              variant="outline"
              className="w-full text-xs"
              type="button"
              
              onClick={() => {
                // setValue("status", "draft");
                handleSubmit(onSubmit)();
              }}
              disabled={createLoading || updateLoading}
            >
              Save as Draft
            </Button>
          </Card>
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