"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

import { DataTable } from "@/components/ui/data-table/Table";

import Pagination from "@/components/shared/Pagination";
import Filters from "./filters";
import { useGetCommentsQuery } from "@/redux/service/comments";
import { columns } from "./columns";

const AllComments = () => {
  const [isParams, setIsParams] = useState('')

  const [pagination, setPagination] = useState({ page: 1, limit: 2 })



  const { data } = useGetCommentsQuery(`page=${pagination?.page}&limit=${pagination?.limit}&${isParams}`);

  const comments = data?.data || [];
  const meta = data?.meta;


  return (
    <div className="max-w-7xl mx-auto  space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">All Comments</h1>
          <p className="text-muted-foreground text-sm">
            Manage your comments easily
          </p>
        </div>

      </div>


      <Filters setParams={setIsParams} />



      {/* TABLE CARD */}
      <Card className="p-0 rounded-md">
        <CardContent className="p-0">

          <DataTable
            columns={columns}
            data={comments}
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

export default AllComments;