"use client";
import Image from "next/image";
import {
  MapPin,
  Phone,
  MessageCircle,
  User,
  Package,
  FileText,
  Calendar,
} from "lucide-react";

import { GlobalModal } from "@/components/shared/GlobalModal";;
import { Bandage, } from "lucide-react";

import { IRequestQuote } from "@/redux/service/request-quote/type";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  previousData?: IRequestQuote;
}
export default function ViewQuotation({
  isOpen,
  setIsOpen,
  previousData
}: Props) {



  return (
    <GlobalModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Quotation Details"
      description="View customer quotation request information"
      icon={<Bandage />}
      maxHeight="max-w-5xl"
      className="lg:min-w-2xl"
      footer={<></>}
    >
      {!previousData ? null : (
        <div className="space-y-6">
          {/* Product Information */}
          <div className="border rounded-xl p-5">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Product Information
            </h3>

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative w-28 h-28 rounded-lg overflow-hidden border">
                <Image
                  src={previousData.productId.gallery?.[0]}
                  alt={previousData.productId.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-lg">
                  {previousData.productId.name}
                </h4>

                <p className="text-sm text-muted-foreground">
                  Slug: {previousData.productId.slug}
                </p>

                <p className="font-semibold text-primary mt-2">
                  ৳ {previousData.productId.price}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {previousData.productId.selectedAttributes?.map((attr) => (
                    <div
                      key={attr._id}
                      className="px-3 py-1 rounded-full bg-muted text-xs"
                    >
                      <span className="font-medium">
                        {attr.name}:
                      </span>{" "}
                      {attr.selectedValues.join(", ")}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="border rounded-xl p-5">
            <h3 className="font-semibold text-lg mb-4">
              Customer Information
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Name
                  </p>
                  <p className="font-medium">
                    {previousData.request.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Phone
                  </p>
                  <p className="font-medium">
                    {previousData.request.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    WhatsApp
                  </p>
                  <p className="font-medium">
                    {previousData.request.whatsappNumber ||
                      "Not Provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Quantity
                  </p>
                  <p className="font-medium">
                    {previousData.quantity}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="border rounded-xl p-5">
            <h3 className="font-semibold text-lg mb-4">
              Shipping Address
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  District
                </p>
                <p className="font-medium">
                  {previousData.location.district}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Zip Code
                </p>
                <p className="font-medium">
                  {previousData.location.zipCode}
                </p>
              </div>

              <div className="md:col-span-2 flex gap-3">
                <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />

                <div>
                  <p className="text-xs text-muted-foreground">
                    Address
                  </p>

                  <p className="font-medium">
                    {previousData.location.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="border rounded-xl p-5">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Customer Notes
            </h3>

            <p className="text-sm leading-relaxed">
              {previousData.notes || "No notes provided"}
            </p>
          </div>

          {/* Created Date */}
          <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {new Date(
              previousData.createdAt
            ).toLocaleString()}
          </div>
        </div>
      )}
    </GlobalModal>
  );
}