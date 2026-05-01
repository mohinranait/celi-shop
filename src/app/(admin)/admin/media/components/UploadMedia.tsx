"use client";
import React, { useState } from "react";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { useCreateMediaMutation } from "@/redux/service/media";

const UploadMedia = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [createMedia] = useCreateMediaMutation();

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];

    //  validation
    if (!file.type.startsWith("image/")) {
      toast.error("Only image allowed");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      await createMedia(formData).unwrap();
      toast.success("Uploaded successfully");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <label className="group relative w-full cursor-pointer">
      <div className="w-full h-[150px] rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center transition-all duration-300 group-hover:border-blue-500 group-hover:bg-blue-50">

        <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-blue-600 transition">
          {isLoading ? (
            <>
              <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
              <p className="text-sm">Uploading...</p>
            </>
          ) : (
            <>
              <UploadCloud size={36} className="opacity-80" />
              <p className="text-sm font-medium">
                Click to upload
              </p>
              <span className="text-xs text-slate-400">
                PNG, JPG up to 2MB
              </span>
            </>
          )}
        </div>
      </div>

      <input
        type="file"
        hidden
        onChange={handleFileChange}
        disabled={isLoading}
      />
    </label>
  );
};

export default UploadMedia;