"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {  useMemo,  useState } from "react";
import { Plus } from "lucide-react";
import CategoryForm from "./CategoryForm";
import { useGetCategoriesQuery } from "@/redux/service/categories";
import Filters from "./Filters";
import { buildCategoryTree,  } from "./BuildTree";
import { CategoryTree } from "./CategoryTree";
import { Skeleton } from "@/components/ui/skeleton";

const AllCategories = () => {
  const [filter, setFilter] = useState<"active" | "deleted">("active");
  const [isOpen, setIsOpen] = useState(false);
  const [isParams, setIsParams] = useState("");

  const { data, isLoading } = useGetCategoriesQuery(
    `page=1&limit=2000&isDelete=${filter === "active" ? "false" : "true"
    }&${isParams}`
  );

  const categories = data?.data ?? []


const tree = useMemo(() => {
  return buildCategoryTree(categories);
}, [categories]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center">
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

      <Filters setParams={setIsParams} />

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
          {
            isLoading ? <div className="w-full p-4 space-y-2">
              {[1, 2, 3, 4, 5].map(item => <div key={item} className="grid grid-cols-3 gap-2">
                <Skeleton className="h-10 " />
                <Skeleton className="h-10 " />
                <Skeleton className="h-10 " />
              </div>)}
            </div> :
              <CategoryTree
                type={filter}
                data={tree}

              />
          }

        </CardContent>
      </Card>



      {/* MODAL */}
      <CategoryForm isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default AllCategories;