"use client";

import { useEffect, useRef, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  useGetSiteContentQuery,
  useUpdateSiteContentMutation,
} from "@/redux/service/site-content";
import MediaModal from "../../media/components/MediaModal";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";


export default function CompanyForm() {
  const [mediaOpen, setMediaOpen] = useState(false);

  const { data, isLoading } = useGetSiteContentQuery("");

  const [updateSiteData, { isLoading: updateLoading }] =
    useUpdateSiteContentMutation();

  const isInitilize = useRef(false)


  const [formData, setFormData] = useState({
    title: "",
    heading: "",
    description1: "",
    description2: "",
    image: {
      url: "",
      alt: "",
    },
    buttonText: "",
    buttonLink: "",
  });


  useEffect(() => {
    const company = data?.data?.companyIntroduction;
    if (company && !isInitilize.current) {
      setFormData({
        title: company.title || "",
        heading: company.heading || "",
        description1: company.description1 || "",
        description2: company.description2 || "",
        image: {
          url: company.image?.url || "",
          alt: company.image?.alt || "",
        },
        buttonText: company.buttonText || "",
        buttonLink: company.buttonLink || "",
      })
    }
  }, [data])


  // Normal input change
  const handleChange = (
    field: string,
    value: string
  ) => {

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  // Image fields change
  const handleImageChange = (
    field: "url" | "alt",
    value: string
  ) => {

    setFormData((prev) => ({
      ...prev,
      image: {
        ...prev.image,
        [field]: value,
      },
    }));
  };


  // Save data
  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    const payload = {
      companyIntroduction: formData,
    };


    try {

      const res = await updateSiteData(payload).unwrap();

      console.log("Saved:", res);

    } catch (error) {

      console.error(error);

    }

  };


  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          Loading...
        </CardContent>
      </Card>
    );
  }


  return (

    <Card>

      <CardHeader>
        <CardTitle>
          Company Introduction
        </CardTitle>
      </CardHeader>


      <CardContent>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >


          {/* Section Title */}
          <Input
            placeholder="Section Title"
            value={formData.title}
            onChange={(e) =>
              handleChange(
                "title",
                e.target.value
              )
            }
          />


          {/* Heading */}
          <Input
            placeholder="Heading"
            value={formData.heading}
            onChange={(e) =>
              handleChange(
                "heading",
                e.target.value
              )
            }
          />


          {/* Description 1 */}
          <Textarea
            placeholder="Description 1"
            value={formData.description1}
            onChange={(e) =>
              handleChange(
                "description1",
                e.target.value
              )
            }
          />


          {/* Description 2 */}
          <Textarea
            placeholder="Description 2"
            value={formData.description2}
            onChange={(e) =>
              handleChange(
                "description2",
                e.target.value
              )
            }
          />





          <div className="space-y-1">
            <Label>Image</Label>
            <div className="flex gap-3">

              {
                formData.image.url && <span
                  className="w-24 h-24 rounded-md border-2 border-dashed  
                       flex flex-col items-center justify-center gap-1 
                        transition-all relative"
                >
                  <Image width={100} height={100} alt="Image" src={formData.image.url} />
                  <button className="text-[10px] w-5 h-5 rounded-full flex items-center justify-center border text-gray-500 absolute top-1 right-1"><X size={14} /></button>
                </span>
              }


              <Button
                type="button"
                variant={'outline'}
                onClick={() => {
                  setMediaOpen(true);

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


          {/* Image Alt */}
          <Input
            placeholder="Image Alt Text"
            value={formData.image.alt}
            onChange={(e) =>
              handleImageChange(
                "alt",
                e.target.value
              )
            }
          />


          {/* Button */}
          <div className="grid md:grid-cols-2 gap-4">

            <Input
              placeholder="Button Text"
              value={formData.buttonText}
              onChange={(e) =>
                handleChange(
                  "buttonText",
                  e.target.value
                )
              }
            />


            <Input
              placeholder="Button Link"
              value={formData.buttonLink}
              onChange={(e) =>
                handleChange(
                  "buttonLink",
                  e.target.value
                )
              }
            />

          </div>


          {/* Submit */}
          <Button
            type="submit"
            disabled={updateLoading}
          >
            {
              updateLoading
                ? "Saving..."
                : "Save Company Section"
            }
          </Button>


        </form>

      </CardContent>

      <MediaModal
        open={mediaOpen}
        setOpen={setMediaOpen}
        onSelect={(url) => {
          handleImageChange('url', url[0])
        }}
      />
    </Card>
  );
}