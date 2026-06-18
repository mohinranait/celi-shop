"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

import { DataTable } from "@/components/ui/data-table/Table";

import Pagination from "@/components/shared/Pagination";
import Filters from "./filters";
import { useGetRequestQuotesQuery } from "@/redux/service/request-quote";
import { columns } from "./columns";

const AllRequestQuotes = () => {
 
  const [isParams, setIsParams] = useState('')

  const [pagination, setPagination] = useState({ page: 1, limit: 20 })



  const { data, isLoading } = useGetRequestQuotesQuery(`page=${pagination?.page}&limit=${pagination?.limit}&${isParams}`);

  const requestQuotes = data?.data || [];
  const meta = data?.meta;





  return (
    <div className="max-w-7xl mx-auto  space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">All Request Quotes</h1>
          <p className="text-muted-foreground text-sm">
            Manage your request quote for custom order
          </p>
        </div>

        {/* <Button onClick={() => setIsOpen(true)}>
          <Plus /> Add Brand
        </Button> */}
      </div>


      <Filters setParams={setIsParams} />

    

      {/* TABLE CARD */}
      <Card className="p-0 rounded-md">
        <CardContent className="p-0">

          <DataTable
            columns={columns}
            data={requestQuotes}
            loading={isLoading}
          />



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

      
    </div>
  );
};

export default AllRequestQuotes;