"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { TProductFormType } from "@/components/validations/product";

import { cn } from "@/lib/utils";

import {
  AlertCircle,
  ImagePlus,
  Trash2,
  X,
} from "lucide-react";

import Image from "next/image";

import { useCallback, useState } from "react";

import {
  FieldArrayWithId,
  UseFieldArrayRemove,
  UseFormReturn,
} from "react-hook-form";
import MediaModal from "../../../media/components/MediaModal";


type VariationFieldType = FieldArrayWithId<
  TProductFormType,
  "variations",
  "id"
>;

type Props = {
  form: UseFormReturn<TProductFormType>;
  remove: UseFieldArrayRemove;
  fields: VariationFieldType[];
};

const VariantTable = ({
  form,
  remove,
  fields,
}: Props) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const [mediaOpen, setMediaOpen] = useState(false);
  const [activeVariantIndex, setActiveVariantIndex] =
    useState<number | null>(null);

  const updateDiscountFromFixed = useCallback(
    (index: number, discountAmount: number) => {
      const price =
        Number(watch(`variations.${index}.price`)) || 0;

      if (price > 0) {
        const percent = (discountAmount / price) * 100;

        setValue(
          `variations.${index}.offerPriceParcent`,
          Number(percent.toFixed(2))
        );
      }
    },
    [watch, setValue]
  );

  const updateDiscountFromPercent = useCallback(
    (index: number, percent: number) => {
      const price =
        Number(watch(`variations.${index}.price`)) || 0;

      if (price > 0) {
        const discountAmount = (price * percent) / 100;

        setValue(
          `variations.${index}.offerPriceFixed`,
          Number(discountAmount.toFixed(2))
        );
      }
    },
    [watch, setValue]
  );

  const updatePercentFromPrice = useCallback(
    (index: number, newPrice: number) => {
      const fixedDiscount =
        Number(
          watch(`variations.${index}.offerPriceFixed`)
        ) || 0;

      if (newPrice > 0 && fixedDiscount > 0) {
        const percent =
          (fixedDiscount / newPrice) * 100;

        setValue(
          `variations.${index}.offerPriceParcent`,
          Number(percent.toFixed(2))
        );
      }
    },
    [watch, setValue]
  );

  const getFieldError = (
    index: number,
    field: string
  ) => {
    return errors.variations?.[index]?.[
      field as keyof typeof errors.variations[number]
    ];
  };

  return (
    <>
      <div className="border rounded-lg overflow-hidden ">
        <Table>
          <TableHeader>
            <TableRow className="">
              <TableHead className="w-[22%] font-semibold">
                Variant
              </TableHead>

              <TableHead className="w-[15%] font-semibold">
                Price
              </TableHead>

              <TableHead className="w-[15%] font-semibold">
                Discount
              </TableHead>

              <TableHead className="w-[15%] font-semibold">
                Discount(%)
              </TableHead>

              <TableHead className="w-[15%] font-semibold">
                SKU
              </TableHead>

              <TableHead className="w-[10%] font-semibold text-center">
                Stock
              </TableHead>

              <TableHead className="w-[10%] font-semibold text-center">
                Alert
              </TableHead>

              <TableHead className="w-[10%] text-right font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {fields.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8"
                >
                  <div className="text-sm text-muted-foreground">
                    No variations added yet.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              fields.map((field, index) => {
                const variantImage =
                  watch(`variations.${index}.images`)?.[0];

                return (
                  <TableRow
                    key={field.id}
                    className=" transition-colors"
                  >
                    {/* Variant Name + Image */}
                    <TableCell>
                      <div className="flex gap-3 items-center">
                        {/* Image Upload */}
                        <div className="shrink-0">
                          {variantImage ? (
                            <div className="relative w-14 h-14 rounded-md overflow-hidden border">
                              <Image
                                src={variantImage}
                                alt="Variant"
                                fill
                                className="object-cover"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  setValue(
                                    `variations.${index}.images`,
                                    []
                                  )
                                }
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white border flex items-center justify-center"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              className="w-14 h-14 border-dashed"
                              onClick={() => {
                                setActiveVariantIndex(index);
                                setMediaOpen(true);
                              }}
                            >
                              <ImagePlus size={18} />
                            </Button>
                          )}
                        </div>

                        {/* Name */}
                        <div className="space-y-1 flex-1">
                          <Input
                            placeholder="e.g. Red / XL"
                            {...register(
                              `variations.${index}.name`
                            )}
                            readOnly
                            disabled
                            className={cn(
                              "h-8 text-sm",
                              getFieldError(
                                index,
                                "name"
                              ) && "border-red-500"
                            )}
                          />

                          {getFieldError(index, "name") && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle size={12} />
                              {
                                getFieldError(
                                  index,
                                  "name"
                                )
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Price */}
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        step="1"
                        {...register(
                          `variations.${index}.price`,
                          {
                            onChange: (e) => {
                              let val =
                                Number(e.target.value) ||
                                0;

                              if (val < 0) val = 0;

                              setValue(
                                `variations.${index}.price`,
                                val
                              );

                              updatePercentFromPrice(
                                index,
                                val
                              );
                            },
                          }
                        )}
                      />
                    </TableCell>

                    {/* Discount Fixed */}
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        step="1"
                        placeholder="0.00"
                        {...register(
                          `variations.${index}.offerPriceFixed`,
                          {
                            onChange: (e) => {
                              let val =
                                Number(e.target.value) ||
                                0;

                              if (val < 0) val = 0;

                              setValue(
                                `variations.${index}.offerPriceFixed`,
                                val
                              );

                              updateDiscountFromFixed(
                                index,
                                val
                              );
                            },
                          }
                        )}
                        className="h-8 text-sm"
                      />
                    </TableCell>

                    {/* Discount Percent */}
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step="1"
                        placeholder="0"
                        {...register(
                          `variations.${index}.offerPriceParcent`,
                          {
                            onChange: (e) => {
                              let val =
                                Number(e.target.value) ||
                                0;

                              if (val < 0) val = 0;

                              if (val > 100)
                                val = 100;

                              setValue(
                                `variations.${index}.offerPriceParcent`,
                                val
                              );

                              updateDiscountFromPercent(
                                index,
                                val
                              );
                            },
                          }
                        )}
                        className="h-8 text-sm"
                      />
                    </TableCell>

                    {/* SKU */}
                    <TableCell>
                      <Input
                        placeholder="SKU-001"
                        {...register(
                          `variations.${index}.sku`
                        )}
                        className="h-8 text-sm"
                      />
                    </TableCell>

                    {/* Stock */}
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        placeholder="0"
                        {...register(
                          `variations.${index}.stock`
                        )}
                        className="h-8 text-sm text-center"
                      />
                    </TableCell>

                    {/* Alert */}
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        placeholder="5"
                        {...register(
                          `variations.${index}.lowStockAlert`
                        )}
                        className="h-8 text-sm text-center"
                      />
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
                              onClick={() =>
                                remove(index)
                              }
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </TooltipTrigger>

                          <TooltipContent>
                            Delete variation
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Media Modal */}
      <MediaModal
        open={mediaOpen}
        setOpen={setMediaOpen}
        onSelect={(urls) => {
          if (activeVariantIndex !== null) {
            setValue(
              `variations.${activeVariantIndex}.images`,
              [urls[0]]
            );
          }
        }}
      />
    </>
  );
};

export default VariantTable;