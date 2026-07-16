import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { requestQuoteSchema, TRequestQuoteInput } from "@/components/validations/request-quote"
import { PRODUCT_IMG } from "@/lib/default-import"
import { useCreateQuoteMutation } from "@/redux/service/request-quote"
import { zodResolver } from "@hookform/resolvers/zod"
import { Repeat2 } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type Props = {
  title: string;
  image: string;
  productId: string;
}

const RequestQuote = ({ image, title, productId }: Props) => {
  const [open, setOpen] = useState(false);
  const [createQuoten] = useCreateQuoteMutation()
  const form = useForm<TRequestQuoteInput>({
    resolver: zodResolver(requestQuoteSchema),
    defaultValues: {
      request: {
        name: "",
        phone: "",
        whatsappNumber: "",
      },
      quantity: 1,
      location: {
        district: "",
        zipCode: "",
        address: "",
      },
      notes: "",
    },
  });


  useEffect(() => {
    form.setValue('productId', productId)
  }, [productId, form])


  const onSubmit = async (
    data: TRequestQuoteInput
  ) => {
    try {
      await createQuoten(data).unwrap();

      toast.success(
        "Quote request submitted successfully"
      );

      form.reset();
      setOpen(false);
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to submit request"
      );
    }
  };




  const nameError = form.formState.errors.request?.name;
  const phoneError = form.formState.errors.request?.phone;
  const quantityError = form.formState.errors.quantity;
  const addressError = form.formState.errors.location?.address;


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full">
        <Button
          variant="outline"
          className="w-full h-12 text-base font-semibold border-slate-300"
        >
          <Repeat2 className="w-5 h-5 mr-2" />
          Request Quote
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle>
            Request a Quote
          </DialogTitle>

          <DialogDescription>
            Submit your requirements and our team
            will contact you with pricing details.
          </DialogDescription>
        </DialogHeader>



        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]"
        >


          <div className="rounded-lg border p-4 bg-muted/30 flex items-center gap-2">
            <div className="w-12 h-12 rounded border border-border flex items-center justify-center">
              <Image src={image || `/${PRODUCT_IMG}`} width={40} height={40} alt={title} />
            </div>
            <div>
              <h3 className="font-semibold">
                {title}
              </h3>
            </div>
          </div>
          {/* Name */}
          <div>
            <Label className="mb-1" htmlFor="name">
              Your full name
            </Label>
            <Input
              id="name"
              placeholder="Your Name"
              {...form.register("request.name")}
            />
            {nameError && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                {nameError.message}
              </p>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <Label className="mb-1" htmlFor="pnum">
                Phone number
              </Label>
              <Input
                id="pnum"
                placeholder="Phone Number"
                {...form.register("request.phone")}
              />
              {phoneError && (
                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                  {phoneError.message}
                </p>
              )}
            </div>

            {/* Whatsapp */}
            <div>
              <Label className="mb-1" htmlFor="wnum">
                Whatsapp  Number (Optional)
              </Label>
              <Input
                id="wnum"
                placeholder="WhatsApp Number"
                {...form.register(
                  "request.whatsappNumber"
                )}
              />
            </div>
          </div>




          {/* District */}

          <div>
            <Label className="mb-1" htmlFor="district">
              District name (Optional)
            </Label>
            <Input
              id="district"
              placeholder="District"
              {...form.register(
                "location.district"
              )}
            />
          </div>


          <div className="grid lg:grid-cols-2 gap-4">
            {/* Zip Code */}
            <div>
              <Label className="mb-1" htmlFor="zip">
                Zip Code (Optional)
              </Label>
              <Input
                id="zip"
                placeholder="Zip Code"
                {...form.register(
                  "location.zipCode"
                )}
              />
            </div>

            {/* Quantity */}
            <div>
              <Label className="mb-1" htmlFor="qty">
                Quantity
              </Label>
              <Input
                id="qty"
                type="number"
                placeholder="Quantity"
                {...form.register("quantity")}
              />
              {quantityError && (
                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                  {quantityError.message}
                </p>
              )}
            </div>
          </div>




          {/* Address */}
          <div>
            <Label className="mb-1" htmlFor="address">
              Full Address
            </Label>
            <Input
              id="address"
              placeholder="Full Address"
              {...form.register(
                "location.address"
              )}
            />
            {addressError && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                {addressError.message}
              </p>
            )}
          </div>


          {/* Notes */}
          <Textarea
            placeholder="Additional Notes"
            {...form.register("notes")}
          />

          <Button
            type="submit"
            className="w-full"
          >
            Submit Quote Request
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default RequestQuote