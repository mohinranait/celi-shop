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
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge"; // Shadcn Badge
import { Bandage, Loader, X } from "lucide-react";

import { IAttribute } from "@/redux/service/attributes/type";
import { attributeSchema, TAttributeInput } from "@/components/validations/attributes";
import { useCreateAttributeMutation, useUpdateAttributeMutation } from "@/redux/service/attributes";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  previousData?: IAttribute;
}

export default function AttributeForm({ isOpen, setIsOpen, previousData }: Props) {
  const [createAttribute, { isLoading: createLoading }] = useCreateAttributeMutation();
  const [updateAttribute, { isLoading: updateLoading }] = useUpdateAttributeMutation();

  // ভ্যালু ইনপুট দেওয়ার জন্য লোকাল স্টেট
  const [valueInput, setValueInput] = useState("");

  const form = useForm<TAttributeInput>({
    resolver: zodResolver(attributeSchema),
    defaultValues: {
      name: "",
      displayName: "",
      description: "",
      status: true,
      values: [],
    },
  });

  const { control, watch, setValue, formState: { errors } } = form;
  const currentValues = watch("values") || [];

  // ১. নতুন ভ্যালু অ্যাড করার লজিক (Enter বা Comma চাপলে)
  const handleValueAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
      e.preventDefault();
      const val = valueInput.trim().replace(",", "");
      if (val && !currentValues.includes(val)) {
        setValue("values", [...currentValues, val], { shouldValidate: true });
        setValueInput("");
      }
    }
  };

  // ২. ভ্যালু রিমুভ করার লজিক
  const removeValue = (valToRemove: string) => {
    setValue("values", currentValues.filter(v => v !== valToRemove), { shouldValidate: true });
  };

  const onSubmit = async (data: TAttributeInput) => {
    try {
      if (previousData?._id) {
        await updateAttribute({ payload: data, id: previousData?._id }).unwrap();
      } else {
        await createAttribute(data).unwrap();
      }
      toast.success("Successfully saved!");
      form.reset();
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to save attribute.");
    }
  };

  useEffect(() => {
    if (previousData) {
      form.reset({
        name: previousData.name,
        displayName: previousData.displayName,
        description: previousData.description || "",
        status: previousData.status,
        values: previousData.values || [],
      });
    }
  }, [previousData, form, isOpen]);

  const isDisable = createLoading || updateLoading;

  return (
    <GlobalModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title={previousData ? "Update Attribute" : "Create Attribute"}
      description="Define product attributes like Color, Size, etc."
      icon={<Bandage />}
      maxHeight="max-w-5xl"
      className="min-w-2xl"
      footer={
        <div className="flex justify-end gap-2 w-full">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDisable}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isDisable}>
            {isDisable && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            {previousData ? "Update Attribute" : "Create Attribute"}
          </Button>
        </div>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Internal Name */}
          <div className="space-y-1">
            <Label>Attribute Name (Internal) <span className="text-red-500">*</span></Label>
            <Input {...form.register("name")} placeholder="e.g. product_color" />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>

          {/* Display Name */}
          <div className="space-y-1">
            <Label>Display Name <span className="text-red-500">*</span></Label>
            <Input {...form.register("displayName")} placeholder="e.g. Select Color" />
            {errors.displayName && <p className="text-red-500 text-xs">{errors.displayName.message}</p>}
          </div>
        </div>

        {/* Values Input (Tag System) */}
        <div className="space-y-2">
          <Label>Attribute Values <span className="text-red-500">*</span></Label>
          <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-background focus-within:ring-1 focus-within:ring-ring">
            {currentValues.map((val, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                {val}
                <span onClick={() => removeValue(val)}>
                  <X className="w-3 h-3 cursor-pointer hover:text-red-500"  />
                </span>
              </Badge>
            ))}
            <input
              className="flex-1 bg-transparent outline-none text-sm min-w-[120px]"
              placeholder="Type value and press Enter..."
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              onKeyDown={handleValueAdd}
            />
          </div>
          {errors.values && <p className="text-red-500 text-xs">{errors.values.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1">
          <Label>Description</Label>
          <Textarea {...form.register("description")} placeholder="Short description about this attribute" />
        </div>

        {/* Status Switch */}
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <div className="flex items-center justify-between border p-3 rounded-lg bg-slate-50/50">
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-xs text-muted-foreground">Enable or disable this attribute</p>
              </div>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </div>
          )}
        />
      </form>
    </GlobalModal>
  );
}
