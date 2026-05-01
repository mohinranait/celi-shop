"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useGetMediasQuery } from "@/redux/service/media";
import { IMedia } from "@/redux/service/media/type";
import { Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  onSelect: (urls: string[]) => void;
  imageLimit?: "single" | "multiple";
};

export default function MediaModal({
  open,
  setOpen,
  onSelect,
  imageLimit = "single",
}: Props) {
  const { data, isLoading } = useGetMediasQuery("");

  const medias = data?.data?.medias || [];

  const [selectedImages, setSelectedImages] = useState<IMedia[]>([]);

  const onSelected = (image: IMedia) => {
    if (imageLimit === "single") {
      setSelectedImages([image]);
      return;
    }

    setSelectedImages((prev) => {
      const exists = prev.find((img) => img._id === image._id);

      if (exists) {
        return prev.filter((img) => img._id !== image._id);
      }

      return [...prev, image];
    });
  };

  const handleConfirm = () => {
    onSelect(selectedImages.map((img) => img.fileUrl));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-6xl max-w-7xl h-[calc(100vh-200px)] flex flex-col">

        {/* HEADER (fixed) */}
        <DialogHeader className="border-b pb-3">
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-1 mt-4">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-5 gap-3">
              {medias.map((item) => {
                const active = selectedImages.find(
                  (img) => img._id === item._id
                );

                return (
                  <div
                    key={item._id}
                    onClick={() => onSelected(item)}
                    className={`relative rounded-lg bg-gray-100 dark:bg-gray-800 border transition cursor-pointer ${
                      active
                        ? "ring-2 ring-primary"
                        : "hover:shadow-md border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {/* CHECK ICON */}
                   
                    <div
                      className={`w-6 h-6 rounded border z-20 absolute top-2 right-2 flex items-center justify-center ${
                        active ? "bg-primary text-white" : "bg-white/70"
                      }`}
                    >
                      <Check size={14} />
                    </div>

                    {/* IMAGE */}
                    <div className="aspect-square relative">
                      {item.fileUrl ? (
                        <Image
                          src={item.fileUrl}
                          alt="image"
                          fill
                          className="object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xs text-gray-500">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>

                    {/* FOOTER */}
                    <div className="p-2 bg-white dark:bg-gray-900 rounded-b-lg">
                      <p className="text-xs truncate">
                        Extension: {item.extension}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(item.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER (fixed) */}
        <DialogFooter className="border-t pt-3 flex justify-between">
          <p className="text-sm text-gray-500">
            {selectedImages.length} selected
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setOpen(false)}
              className="px-3 py-1 border rounded"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirm}
              className="px-3 py-1 bg-primary text-white rounded"
            >
              Apply
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}