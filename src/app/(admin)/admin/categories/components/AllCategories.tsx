"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { Plus } from "lucide-react";

import { DataTable } from "@/components/ui/data-table/Table";
import tableColumns from "./columns";
import CategoryForm from "./CategoryForm";
import { useGetCategoriesQuery } from "@/redux/service/categories";
import Pagination from "@/components/shared/Pagination";
import Filters from "./Filters";

const AllCategories = () => {
  const [filter, setFilter] = useState<"active" | "deleted">("active");
  const [isOpen, setIsOpen] = useState(false);
   const [isParams, setIsParams] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 2 })
    const columns = tableColumns({ type: filter });

  const { data } = useGetCategoriesQuery(`page=${pagination?.page}&limit=${pagination?.limit}&isDelete=${filter === 'active' ? 'false' : "true"}&${isParams}`);

  const categories = data?.data || [];
  const meta = data?.meta;



  return (
    <div className="max-w-7xl mx-auto  space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">All Categories</h1>
          <p className="text-muted-foreground text-sm">
            Manage your categories easily
          </p>
        </div>

        <Button onClick={() => setIsOpen(true)}>
          <Plus /> Add Category
        </Button>
      </div>


      <Filters setParams={setIsParams}  />


      <div className="flex gap-2">


        <Button
          variant={filter === "active" ? "default" : "outline"}
          onClick={() => setFilter("active")}
        >
          Active
        </Button>

        <Button
          variant={filter === "deleted" ? "default" : "outline"}
          onClick={() => setFilter("deleted")}
        >
          Deleted
        </Button>
      </div>


      {/* TABLE CARD */}
      <Card className="p-0 rounded-md">
        <CardContent className="p-0">

          <DataTable columns={columns} data={categories} />


        </CardContent>
      </Card>

      <Pagination
        page={meta?.page || 1}
        totalPages={meta?.totalPages || 1}
        onPageChange={(page) =>
          setPagination((prev) => ({
            ...prev,
            page,
          }))
        }
      />

      {/* MODAL */}
      <CategoryForm isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default AllCategories;