"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle,  Send } from "lucide-react";
import { toast } from "sonner";
import { ContactFormData, contactFormSchema } from "@/components/validations/contact";
import { useCreateContactMutation } from "@/redux/service/contacts";
import handleErrors, { ErrorResponse } from "@/lib/handle-error";



const ContactForm = () => {
  const [createContact, {isLoading}] = useCreateContactMutation()
  

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
  });

  const message = watch("message", "");

  const onSubmit = async (data: ContactFormData) => {
    try {
      await createContact(data).unwrap()
      toast.success("Message sent successfully!");
      reset();

    } catch (error) {
      console.error(error);
       handleErrors( error as ErrorResponse)
    } 
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      <div>
        <Label>Full Name *</Label>
        <Input {...register("fullName")} />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1 flex gap-1">
            <AlertCircle size={16} />
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">

        <div>
          <Label>Email *</Label>
          <Input type="email" {...register("email")} />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Label>Phone</Label>
          <Input type="tel" {...register("phone")} />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>

      </div>


      <div className="grid md:grid-cols-2 gap-4">

        <div>
          <Label>Order Number</Label>
          <Input
            placeholder="Example #ORD12345"
            {...register("orderNumber")}
          />
        </div>

        <div>
          <Label>Subject *</Label>
          <Input
            placeholder="Product inquiry"
            {...register("subject")}
          />

          {errors.subject && (
            <p className="text-red-500 text-sm mt-1">
              {errors.subject.message}
            </p>
          )}
        </div>

      </div>


      <div>

        <div className="flex justify-between mb-2">
          <Label>Message *</Label>

          <span className="text-sm text-muted-foreground">
            {message.length}/1000
          </span>
        </div>


        <Textarea
          rows={6}
          placeholder="Write your message..."
          {...register("message")}
        />

        {errors.message && (
          <p className="text-red-500 text-sm mt-1">
            {errors.message.message}
          </p>
        )}

      </div>


      <Button
        className="w-full"
        size="lg"
        disabled={isLoading }
      >
        {
          isLoading ? "Sending..." : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </>
          )
        }
      </Button>

    </form>
  );
};

export default ContactForm;