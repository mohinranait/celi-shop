"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, PlusCircle, RefreshCw } from "lucide-react"
import { toast } from "sonner"
export interface IAttributeConfig {
  name: string;
  selectedValues: string[];
}

export interface IVariation {
  name: string;
  price: number;
  sku: string;
  stock: number;
  images?: string[];
}

export interface IProduct {
  _id?: string;
  name: string;
  description?: string;
  selectedAttributes: IAttributeConfig[];
  variations: IVariation[];
  category?: string;
  brand?: string;
  status: 'draft' | 'active' | 'out-of-stock';
}


// --- Fake Attributes Data ---
const availableAttributes = [
  { id: "1", name: "Color", values: ["Red", "Green", "Blue", "Black"] },
  { id: "2", name: "Size", values: ["S", "M", "L", "XL"] },
  { id: "3", name: "Weight", values: ["500g", "1kg", "2kg"] },
];

export default function AdvancedVariationForm() {
  const [selectedConfigs, setSelectedConfigs] = useState<IAttributeConfig[]>([]);

  const { register, control, handleSubmit, reset } = useForm<IProduct>({
    defaultValues: { name: "", variations: [], status: 'draft' }
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "variations"
  });

  const addAttributeRow = () => {
    setSelectedConfigs([...selectedConfigs, { name: "", selectedValues: [] }]);
  };

  const updateConfig = (index: number, name: string, values: string[]) => {
    const newConfigs = [...selectedConfigs];
    newConfigs[index] = { name, selectedValues: values };
    setSelectedConfigs(newConfigs);
  };

  const generateVariations = () => {
    const lists = selectedConfigs.map(c => c.selectedValues).filter(l => l.length > 0);
    if (lists.length === 0) return;

    const result = lists.reduce((a: string[][], b: string[]) => {
      return a.flatMap((d) => b.map((e) => [...d, e]));
    }, [[]] as string[][]);

    const formattedVariations = result.map((combination) => {
      const name = Array.isArray(combination) ? combination.join(" / ") : combination;
      return {
        name,
        price: 0,
        sku: `SKU-${Math.random().toString(36).slice(7).toUpperCase()}`,
        stock: 0
      };
    });

    replace(formattedVariations);
  };



  const onSubmit = async (data: IProduct) => {
    const finalData = { ...data, selectedAttributes: selectedConfigs };

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (res.ok) {
        toast.success("Product saved successfully!");
        reset();
        setSelectedConfigs([]);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 space-y-8">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label>Product Name</Label>
            <Input {...register("name")} placeholder="Main Product Name" />
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <Label className="text-lg font-bold">Select Attributes</Label>
              <Button type="button" variant="secondary" size="sm" onClick={addAttributeRow}>
                <PlusCircle className="w-4 h-4 mr-2" /> Add Attribute
              </Button>
            </div>

            {/* অ্যাট্রিবিউট সিলেকশন সেকশন */}
            {selectedConfigs.map((config, idx) => (
              <div key={idx} className="flex gap-4 mb-3 items-end bg-slate-50 p-3 rounded-md">
                <div className="flex-1">
                  <Label>Attribute</Label>
                  <Select onValueChange={(val) => updateConfig(idx, val, [])}>
                    <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                    <SelectContent>
                      {availableAttributes.map(attr => (
                        <SelectItem key={attr.id} value={attr.name}>{attr.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-[2]">
                  <Label>Values (Comma separated for now)</Label>
                  <Input
                    placeholder="Red, Green, Blue"
                    onChange={(e) => updateConfig(idx, config.name, e.target.value.split(",").map(v => v.trim()))}
                  />
                </div>

                <Button variant="destructive" size="icon" onClick={() => setSelectedConfigs(selectedConfigs.filter((_, i) => i !== idx))}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            {selectedConfigs.length > 0 && (
              <Button type="button" className="w-full mt-4" variant="outline" onClick={generateVariations}>
                <RefreshCw className="w-4 h-4 mr-2" /> Generate All Variations
              </Button>
            )}
          </div>

          {/* জেনারেটেড ভ্যারিয়েশন লিস্ট */}
          {fields.length > 0 && (
            <div className="border-t pt-6 space-y-4">
              <Label className="text-lg font-bold">Variations List</Label>
              <div className="grid grid-cols-1 gap-3">
                {fields.map((field, index) => {
                  console.log(field);

                  return (
                    <div key={field.id} className="grid grid-cols-12 gap-3 items-center border p-3 rounded-lg shadow-sm">
                      <div className="col-span-4 font-medium text-sm">{field.name}</div>
                      <div className="col-span-3">
                        <Input type="number" placeholder="Price" {...register(`variations.${index}.price` as const)} />
                      </div>
                      <div className="col-span-4">
                        <Input placeholder="SKU" {...register(`variations.${index}.sku` as const)} />
                      </div>
                      <div className="col-span-1">
                        <Button variant="ghost" size="sm" onClick={() => remove(index)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Publish Product</Button>
    </form>
  )
}
