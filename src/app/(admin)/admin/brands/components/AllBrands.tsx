"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import BrandForm from "./BrandForm";
import { useGetBrandsQuery } from "@/redux/service/brand";

import { Plus } from "lucide-react";

import { DataTable } from "@/components/ui/data-table/Table";
import { columns } from "./columns";

const AllBrands = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data } = useGetBrandsQuery('');

  const brands = data?.data || [];




  return (
    <div className="max-w-7xl mx-auto  space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">All Brands</h1>
          <p className="text-muted-foreground text-sm">
            Manage your brands easily
          </p>
        </div>

        <Button onClick={() => setIsOpen(true)}>
          <Plus /> Add Brand
        </Button>
      </div>

      {/* TABLE CARD */}
      <Card className="p-0 rounded-md">
        <CardContent className="p-0">

          <DataTable columns={columns} data={brands} />


        </CardContent>
      </Card>

      {/* MODAL */}
      <BrandForm isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default AllBrands;