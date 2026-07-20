"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GlobalModal } from "@/components/shared/GlobalModal";

import { toast } from "sonner";
import { Bandage, Loader, } from "lucide-react";

import { IComment } from "@/redux/service/comments/type";
import { commentSchema, TCommentFormData } from "@/components/validations/comment";
import { useUpdateCommentMutation } from "@/redux/service/comments";
import handleErrors, { ErrorResponse } from "@/lib/handle-error";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  previousData?: IComment;
}
export default function CommentForm({
  isOpen,
  setIsOpen,
  previousData
}: Props) {



  const [updateComment, { isLoading: updateLoading }] = useUpdateCommentMutation()

  const form = useForm<TCommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {},
  });

  const { control } = form;


  //  submit handler
  const onSubmit = async (data: TCommentFormData) => {

    try {
      if (previousData?._id) {
        await updateComment({ payload: data, id: previousData?._id }).unwrap();
      } else {
      }

      toast.success("Successfully");
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create brand:", error);
       handleErrors( error as ErrorResponse)
    }
  };

  const isDisable = updateLoading;


  useEffect(() => {
    if (previousData) {
      form.reset({
        productId: previousData.productId?._id || "",
        userId: previousData.userId?._id.toString() || "",
        comment: previousData.comment || "",
        isApproved: previousData.isApproved ?? true,
        isFeature: previousData.isFeature ?? false,
        rating: previousData.rating || 0,
      });
    }
  }, [previousData, form]);

  return (
    <GlobalModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title={"Update comment information"}
      description="Fill the form below to update comment"
      icon={<Bandage />}
      maxHeight="max-w-5xl"
      className="lg:min-w-125"
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
              !!previousData ? "Update Brand" : "Create Brand"
            }
          </Button>
        </div>
      }
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >


        {/* Description */}
        <div className="space-y-1">
          <Label>Comment</Label>
          <Textarea {...form.register("comment")} />
        </div>




        {/* Status */}
        <Controller
          control={control}
          name="isApproved"
          render={({ field }) => (
            <div className="flex items-center justify-between border p-3 rounded-lg">
              <div>
               <p className="text-sm font-medium">Active Status </p>
               <p className="text-xs font-normal">This commnet will be show product details page</p>
             </div>
              <Switch
                checked={field.value === true}
                onCheckedChange={field.onChange}
              />
            </div>
          )}
        />


        <Controller
          control={control}
          name="isFeature"
          render={({ field }) => (
            <div className="flex items-center justify-between border p-3 rounded-lg">
             <div>
               <p className="text-sm font-medium">Feature Comment </p>
               <p className="text-xs font-normal">This comment will be show home page review slider</p>
             </div>
              <Switch
                checked={field.value === true}
                onCheckedChange={field.onChange}
              />
            </div>
          )}
        />
      </form>


    </GlobalModal>
  );
}