'use client';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table/Table';
import  { useState } from 'react'

import Pagination from '@/components/shared/Pagination';
import { useGetAdminOrdersQuery } from '@/redux/service/orders';
import Filters from './filters';
import { columns } from './columns';

const AllOrders = () => {

  const [isParams, setIsParams] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 15 })

  const { data, isLoading } = useGetAdminOrdersQuery(`page=${pagination?.page}&limit=${pagination?.limit}&${isParams}`)
  const orders = data?.data || [];
  const meta = data?.meta;


  return (
    <div className="max-w-7xl mx-auto  space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">All Orders</h1>
          <p className="text-muted-foreground text-sm">
            Manage your orders easily
          </p>
        </div>

        {/* <Button onClick={() => router.push('/admin/products/form')}>
          <Plus /> Add Order
        </Button> */}
      </div>


      <Filters setParams={setIsParams} />


      {/* TABLE CARD */}
      <Card className="p-0 rounded-md">
        <CardContent className="p-0">

          <DataTable
            columns={columns}
            data={orders}
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
  )
}

export default AllOrders