"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import Pagination from "@/components/shared/Pagination";
import Filters from "./filters";
import { useGetContactsQuery } from "@/redux/service/contacts";
import { DataTable } from "@/components/ui/data-table/Table";
import { columns } from "./columns";

const AllContactQuery = () => {
  const [isParams, setIsParams] = useState('')
 

  const [pagination, setPagination] = useState({ page: 1, limit: 2 })


  const { data, isLoading } = useGetContactsQuery(`page=${pagination?.page}&limit=${pagination?.limit}&${isParams}`);

  const contacts = data?.data || [];
  const meta = data?.meta;






  return (
    <div className="max-w-7xl mx-auto  space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">All contact query</h1>
          <p className="text-muted-foreground text-sm">
            Manage your contact query easily
          </p>
        </div>

       
      </div>


      <Filters setParams={setIsParams} />

     

      {/* TABLE CARD */}
      <Card className="p-0 rounded-md">
        <CardContent className="p-0">

          <DataTable
            columns={columns}
            data={contacts}
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

export default AllContactQuery;