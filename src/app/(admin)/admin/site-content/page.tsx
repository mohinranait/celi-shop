"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanyForm from "./components/company-form";
import WhyChooseUsForm from "./components/why-choose-us-form";
import { Navbar } from "@/components/shared/NavBar";
import { Main } from "@/components/ui/main";

export default function WebsiteContentPage() {
  return (

    <>
      <Navbar fixed></Navbar>
      <Main>
        <div className="space-y-6 max-w-7xl mx-auto">

          <div>
            <h1 className="text-3xl font-bold">
              Website Content Settings
            </h1>

            <p className="text-muted-foreground">
              Manage homepage sections.
            </p>
          </div>


          <Tabs defaultValue="company">

            <TabsList>
              <TabsTrigger value="company">
                Company Introduction
              </TabsTrigger>

              <TabsTrigger value="why">
                Why Choose Us
              </TabsTrigger>
            </TabsList>


            <TabsContent value="company">
              <CompanyForm />
            </TabsContent>


            <TabsContent value="why">
              <WhyChooseUsForm />
            </TabsContent>

          </Tabs>

        </div>
      </Main>
    </>

  );
}