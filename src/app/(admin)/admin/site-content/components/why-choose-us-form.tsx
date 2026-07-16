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

import { Award, Headphones, Plus,  ShieldCheck,  Trash, Truck } from "lucide-react";

import {
  useGetSiteContentQuery,
  useUpdateSiteContentMutation,
} from "@/redux/service/site-content";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const emptyObj = {
  icon: "",
  title: "",
  description: "",
}

export default function WhyChooseUsForm() {

  const { data, isLoading } = useGetSiteContentQuery("");

  const [updateSiteData, { isLoading: updateLoading }] =
    useUpdateSiteContentMutation();


  const [title, setTitle] = useState("");
  const [heading, setHeading] = useState("");

  const [features, setFeatures] = useState([
    {
      ...emptyObj,
    },
  ]);


  const isInitialized = useRef(false)


  useEffect(() => {
    const whyChooseUs = data?.data?.whyChooseUs;
    if (whyChooseUs && !isInitialized.current) {
      setTitle(whyChooseUs.title || "");
      setHeading(whyChooseUs.heading || "");

      setFeatures(
        whyChooseUs.items?.length ? structuredClone(whyChooseUs.items) : [
          {
            ...emptyObj
          },
        ]
      )
      isInitialized.current = true
    }
  }, [data])


  // add new feature
  const addFeature = () => {
    setFeatures([
      ...features,
      {
        icon: "",
        title: "",
        description: "",
      },
    ]);
  };


  // remove feature
  const removeFeature = (index: number) => {
    setFeatures(
      features.filter((_, i) => i !== index)
    );
  };


  // handle input change
  const handleFeatureChange = (
    index: number,
    field: "icon" | "title" | "description",
    value: string
  ) => {

    const updated = [...features];

    updated[index][field] = value;

    setFeatures(updated);
  };


  // save
  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();


    const payload = {
      whyChooseUs: {
        title,
        heading,
        items: features,
      },
    };


    try {

       await updateSiteData(payload).unwrap();

      // console.log("Saved:", res);

    } catch (error) {

      console.error(error);

    }

  };


  if (isLoading) {
    return (
      <Card className="py-5">
        <CardContent className="p-6">
          Loading...
        </CardContent>
      </Card>
    );
  }


  return (

    <Card className="py-5">

      <CardHeader>
        <CardTitle>
          Why Choose Us
        </CardTitle>
      </CardHeader>


      <CardContent>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >


          {/* Section title */}
          <Input
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Section Title"
          />


          {/* Heading */}
          <Input
            value={heading}
            onChange={(e) =>
              setHeading(e.target.value)
            }
            placeholder="Heading"
          />


          <div className="space-y-4">

            {
              features.map((feature, index) => (

                <div
                  key={index}
                  className="border rounded-xl p-4 space-y-3"
                >

                  <div className="flex justify-between items-center">

                    <h3>
                      Feature {index + 1}
                    </h3>


                    {
                      features.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() =>
                            removeFeature(index)
                          }
                        >
                          <Trash size={16} />
                        </Button>
                      )
                    }


                  </div>


                  {/* <Input
                    placeholder="Icon name (ShieldCheck)"
                    value={feature.icon}
                    onChange={(e) =>
                      handleFeatureChange(
                        index,
                        "icon",
                        e.target.value
                      )
                    }
                  /> */}

                  <Select
                    value={feature.icon}
                    onValueChange={(value) =>
                      handleFeatureChange(
                        index,
                        "icon",
                        value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Icon" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="ShieldCheck">
                         <ShieldCheck /> Shield Check
                      </SelectItem>

                      <SelectItem value="Truck">
                       <Truck /> Truck
                      </SelectItem>

                      <SelectItem value="Award">
                       <Award /> Award
                      </SelectItem>

                      <SelectItem value="Headphones">
                       <Headphones /> Headphones
                      </SelectItem>
                    </SelectContent>
                  </Select>



                  <Input
                    placeholder="Feature Title"
                    value={feature.title}
                    onChange={(e) =>
                      handleFeatureChange(
                        index,
                        "title",
                        e.target.value
                      )
                    }
                  />


                  <Textarea
                    placeholder="Description"
                    value={feature.description}
                    onChange={(e) =>
                      handleFeatureChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                  />


                </div>

              ))
            }


            <Button
              type="button"
              variant="outline"
              onClick={addFeature}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Feature
            </Button>


          </div>


          <Button
            type="submit"
            disabled={updateLoading}
          >
            {
              updateLoading
                ? "Saving..."
                : "Save Why Choose Us"
            }
          </Button>


        </form>

      </CardContent>


    </Card>
  );
}