"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GlobalModal } from "@/components/shared/GlobalModal";
import { toast } from "sonner";
import MediaModal from "../../media/components/MediaModal";
import { Bandage, Loader, Plus, X } from "lucide-react";
import Image from "next/image";
import { ISlider, TSliderType } from "@/redux/service/sliders/type";
import { sliderSchema, TSliderInput } from "@/components/validations/slider";
import { useCreateSliderMutation, useUpdateSliderMutation } from "@/redux/service/sliders";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  previousData?: ISlider;
}
export default function SliderForm({
  isOpen,
  setIsOpen,
  previousData
}: Props) {

  const [mediaOpen, setMediaOpen] = useState(false);
  const [activeField, setActiveField] = useState<"image" | null>(null);

  const [createSlider, { isLoading: createLoading }] = useCreateSliderMutation();
  const [updateSlider, { isLoading: updateLoading }] = useUpdateSliderMutation()

  const form = useForm<TSliderInput>({
    resolver: zodResolver(sliderSchema),
    defaultValues: {},
  });

  const { control } = form;
  const image = form.watch('image')



  //  submit handler
  const onSubmit = async (data: TSliderInput) => {

    try {
      if (previousData?._id) {
        await updateSlider({ payload: data, id: previousData?._id }).unwrap();
      } else {

        await createSlider(data).unwrap();
      }

      toast.success("Successfully");
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create slider:", error);
      toast.error("Failed to create slider.");
    }
  };

  const isDisable = createLoading || updateLoading;


  useEffect(() => {
    if (previousData) {
      form.reset({
        title: previousData.title || "",
        status: previousData.status ?? true,
        description: previousData.description || "",
        image: previousData.image || "",
        buttonName: previousData?.buttonName,
        link: previousData?.link || '',
        order: previousData?.order || 100,
        sliderType: previousData?.sliderType || 'withoutImage',

      });
    } else {
      form.reset({
        title: "",
        status: true,
        description: "",
        image: "",
        buttonName: "",
        link: "",
        order: 0,
        sliderType: 'withoutImage'
      });
    }
  }, [previousData, form]);

  return (
    <GlobalModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title={previousData ? "Update Slider information" : "Create Slider"}
      description="Fill the form below to create a new slider"
      icon={<Bandage />}
      maxHeight="max-w-5xl"
      className="min-w-2xl"
      footer={
        <div className="flex justify-end gap-2 w-full">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDisable}>
            Cancel
          </Button>

          {/*  trigger form submit */}
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isDisable}>
            {
              isDisable &&
              <Loader className="animate-spin" />
            }
            {
              !!previousData ? "Update Slider" : "Create Slider"
            }
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
          <Label>Slider Title <span className="text-red-500">*</span> </Label>
          <Input {...form.register("title")} />
          {form.formState.errors.title && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>


        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label>Button Name <span className="text-red-500">*</span></Label>
            <Input {...form.register("buttonName")} />
          </div>

          <div className="space-y-1">
            <Label>Order  <span className="text-red-500">*</span></Label>
            <Input {...form.register("order")} />
          </div>
          <div className="space-y-1">
            <Label>Order  <span className="text-red-500">*</span></Label>
            <Select
              onValueChange={(value) => form.setValue("sliderType", value as TSliderType)}
              {...form.register("sliderType")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Slider Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={`withImage`} className="cursor-pointer">
                  Image with content
                </SelectItem>
                <SelectItem value={'directImage'} className="cursor-pointer ">
                  Only image
                </SelectItem>
                <SelectItem value={'withoutImage'} className="cursor-pointer ">
                  Only Content
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>

        <div className="space-y-1">
          <Label>Button Link <span className="text-red-500">*</span></Label>
          <Input {...form.register("link")} />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <Label>Description</Label>
          <Textarea {...form.register("description")} />
        </div>


        <div className="space-y-1">
          <Label>Image (Optional)</Label>
          <div className="flex gap-3">

            {
              image && <span
                className="w-24 h-24 rounded-md border-2 border-dashed  
             flex flex-col items-center justify-center gap-1 
              transition-all relative"
              >
                <Image width={100} height={100} alt="Image" src={image} />
                <button className="text-[10px] w-5 h-5 rounded-full flex items-center justify-center border text-gray-500 absolute top-1 right-1"><X size={14} /></button>
              </span>
            }


            <Button
              type="button"
              variant={'outline'}
              onClick={() => {
                setMediaOpen(true);
                setActiveField('image')
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
          if (activeField === "image") {
            form.setValue('image', url[0])
          };


        }}
      />
    </GlobalModal>
  );
}