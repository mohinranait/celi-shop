'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table/Table';
import { Plus } from 'lucide-react';
import React, { useState } from 'react'
import tableColumns from './columns';
import { useGetProductsQuery } from '@/redux/service/products';
import { useRouter } from 'next/navigation';

const AllProducts = () => {
  const router = useRouter()
  const [filter, setFilter] = useState<"active" | "deleted">("active");
  const [isParams, setIsParams] = useState('')
  const columns = tableColumns({ type: filter });
  const { data } = useGetProductsQuery('')
  const products = data?.data || [];



  return (
    <div className="max-w-7xl mx-auto  space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">All Products</h1>
          <p className="text-muted-foreground text-sm">
            Manage your products easily
          </p>
        </div>

        <Button onClick={() => router.push('/admin/products/form')}>
          <Plus /> Add Product
        </Button>
      </div>


      {/* <Filters setParams={setIsParams}  /> */}

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

          <DataTable
            columns={columns}
            data={products}
          />



        </CardContent>
      </Card>

      {/* <Pagination
            page={meta?.page || 1}
            totalPages={meta?.totalPages || 1}
            onPageChange={(page) =>
              setPagination((prev) => ({
                ...prev,
                page,
              }))
            }
          /> */}

      {/* MODAL */}
      {/* <BrandForm isOpen={isOpen} setIsOpen={setIsOpen} /> */}
    </div>
  )
}

export default AllProducts