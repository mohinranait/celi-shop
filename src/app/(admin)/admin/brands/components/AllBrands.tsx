"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import BrandForm from "./BrandForm";
import { useGetBrandsQuery } from "@/redux/service/brand";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
          + Add Brand
        </Button>
      </div>

      {/* TABLE CARD */}
      <Card className="p-0 rounded-md">
        <CardContent className="p-0">

         <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Crated</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              brands?.map((brand) =>  <TableRow key={brand._id}>
              <TableCell className="font-medium">{brand.name}</TableCell>
              <TableCell> 
                <Badge
                  className={
                    brand.status
                      ? "bg-green-500/10 text-green-600"
                      : "bg-red-500/10 text-red-600"
                  }
                >
                  {brand.status ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell> {new Date(brand.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                 <div className="flex justify-end items-center gap-2">
                  <Switch checked={brand.status} />

                  <Button size="sm" variant="outline">
                    Edit
                  </Button>

                  <Button size="sm" variant="destructive">
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow> )
            }
          
          </TableBody>
        </Table>

        </CardContent>
      </Card>

      {/* MODAL */}
      <BrandForm isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default AllBrands;