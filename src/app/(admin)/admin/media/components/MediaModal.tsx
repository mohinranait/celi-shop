"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useGetMediasQuery } from "@/redux/service/media";
import { IMedia } from "@/redux/service/media/type";
import { Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import UploadMedia from "./UploadMedia";
import Pagination from "@/components/shared/Pagination";

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
  const [pagination, setPagination] = useState({ page: 1, limit: 25 })
  const { data, isLoading } = useGetMediasQuery(`page=${pagination?.page}&limit=${pagination?.limit}`);
  const medias = data?.data?.medias || []
  const meta = data?.meta;

  const [selectedImages, setSelectedImages] = useState<IMedia[]>([]);
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");

  const onSelected = (image: IMedia) => {
    if (imageLimit === "single") {
      setSelectedImages([image]);
      return;
    }

    setSelectedImages((prev) => {
      const exists = prev.find((img) => img._id === image._id);
      if (exists) return prev.filter((img) => img._id !== image._id);
      return [...prev, image];
    });
  };

  const handleConfirm = () => {
    onSelect(selectedImages.map((img) => img.fileUrl));
    setOpen(false);
    setSelectedImages([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="lg:min-w-275 max-w-7xl h-[85vh] gap-0 flex flex-col p-0 overflow-hidden">

        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "library" | "upload")}
          className="flex flex-col flex-1 min-h-0"
        >
          <TabsList className="flex  mx-6 mt-2">
            <TabsTrigger value="library" className="cursor-pointer">Media Library</TabsTrigger>
            <TabsTrigger value="upload" className="cursor-pointer">Upload New Media</TabsTrigger>
          </TabsList>

          {/* ==================== LIBRARY TAB ==================== */}
          <TabsContent
            value="library"
            className="flex-1 flex flex-col min-h-0 overflow-hidden "
          >
            <div className="flex-1 overflow-y-auto px-2 lg:p-6 pt-2 custom-scroll">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-lg">Loading media files...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 lg:gap-4 pb-6">
                  {medias.map((item) => {
                    const isActive = selectedImages.some(
                      (img) => img._id === item._id
                    );

                    return (
                      <div
                        key={item._id}
                        onClick={() => onSelected(item)}
                        className={`relative rounded-xl bg-gray-100 dark:bg-gray-800 border transition-all cursor-pointer overflow-hidden group ${isActive
                            ? "ring-2 ring-primary border-primary"
                            : "hover:shadow-lg border-gray-200 dark:border-gray-700"
                          }`}
                      >
                        <div className="aspect-square relative">
                          <Image
                            src={item.fileUrl}
                            alt="media"
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Check Icon */}
                        <div
                          className={`absolute top-3 right-3 z-20 w-7 h-7 rounded-full border flex items-center justify-center transition-all ${isActive
                              ? "bg-primary text-white border-primary"
                              : "bg-white/80 border-white group-hover:opacity-100 opacity-0"
                            }`}
                        >
                          <Check size={16} />
                        </div>

                        {/* Info */}
                        <div className="p-3 bg-white dark:bg-gray-900 text-xs">
                          <p className="truncate">{item.extension?.toUpperCase()}</p>
                          <p className="text-gray-500">
                            {(item.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ==================== UPLOAD TAB ==================== */}
          <TabsContent
            value="upload"
            className="flex-1 overflow-auto p-6 pt-2"
          >
            <UploadMedia />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        {activeTab === "library" && (
          <div className="px-6  py-3 border-t flex justify-between items-center">
           <div>
             <Pagination
              hidePageInfo={true}
              page={meta?.page || 1}
              totalPages={meta?.totalPages || 1}
              onPageChange={(page) =>
                setPagination((prev) => ({
                  ...prev,
                  page,
                }))
              }
            />
           </div>

            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-5 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={selectedImages.length === 0}
                className="px-5 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}