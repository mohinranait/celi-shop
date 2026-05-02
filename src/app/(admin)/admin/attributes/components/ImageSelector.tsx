"use client";

import React from "react";
import { Plus } from "lucide-react";

export type MediaImage = {
  id: string;
  url: string;
  alt?: string;
};

type Props = {
  images: MediaImage[]; // selected images
  onChange: (images: MediaImage[]) => void;

  multiple?: boolean; // single or multiple mode
  mediaLibrary: MediaImage[]; // available images from DB/media library
};

const ImageSelector = ({
  images = [],
  onChange,
  multiple = true,
  mediaLibrary,
}: Props) => {
  const [open, setOpen] = React.useState(false);

  const isSelected = (id: string) => images.some((img) => img.id === id);

  const handleSelect = (img: MediaImage) => {
    if (!multiple) {
      onChange([img]);
      setOpen(false);
      return;
    }

    if (isSelected(img.id)) {
      onChange(images.filter((i) => i.id !== img.id));
    } else {
      onChange([...images, img]);
    }
  };

  const handleRemove = (id: string) => {
    onChange(images.filter((img) => img.id !== id));
  };

  return (
    <div className="flex gap-4">
      {/* LEFT: Selected Images */}
      <div className="flex flex-wrap gap-3 border p-3 rounded-md w-full min-h-[120px]">
        {images.map((img) => (
          <div key={img.id} className="relative w-20 h-20">
            <img
              src={img.url}
              alt={img.alt || "image"}
              className="w-full h-full object-cover rounded-md border"
            />
            <button
              type="button"
              onClick={() => handleRemove(img.id)}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* RIGHT: Add Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-20 h-20 border rounded-md flex items-center justify-center hover:bg-gray-100"
      >
        <Plus size={24} />
      </button>

      {/* SIMPLE MEDIA MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md w-[500px] max-h-[400px] overflow-auto">
            <div className="grid grid-cols-4 gap-3">
              {mediaLibrary.map((img) => {
                const active = isSelected(img.id);

                return (
                  <div
                    key={img.id}
                    onClick={() => handleSelect(img)}
                    className={`cursor-pointer border rounded-md overflow-hidden ${
                      active ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    <img
                      src={img.url}
                      className="w-full h-20 object-cover"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 border rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSelector;