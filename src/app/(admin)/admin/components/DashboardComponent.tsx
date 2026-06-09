'use client'
"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from 'react'
import { useDashboardAnalyticsQuery, useDashboardRevenueQuery } from "@/redux/service/dashboard";
import { useGetClientProductsQuery } from "@/redux/client/products";
import { DataTable } from "@/components/ui/data-table/Table";
import tableColumns from './../products/components/columns';
import Analytics from "./Analytics";

const DashboardComponent = () => {
  const columns = tableColumns({ type: 'active' });
  const [period, setPeriod] = useState("month");
  const { data, isLoading } = useDashboardRevenueQuery(`period=${period}`);


  const { data: besSell, isLoading: bestSellLading } = useGetClientProductsQuery(`page=1&limit=6&type=bestselling`);
  const products = besSell?.data;

  const {data:dashboard} = useDashboardAnalyticsQuery(``)
  const analytics = dashboard?.data;

  


  const chartData =
    data?.data?.map((item: any) => ({
      label:
        period === "today"
          ? `${item._id.hour}:00`
          : item._id.date,
      revenue: item.revenue,
    })) || [];

  return (
    <div>
      <div className="space-y-5">
        <Analytics />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Revenue Analytics</CardTitle>

            <select
              value={period}
              onChange={(e) =>
                setPeriod(e.target.value)
              }
              className="border rounded px-3 py-2"
            >
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue",
                    color: "#2563eb",
                  },
                }}
                className="h-[350px] w-full"
              >
                <AreaChart data={chartData}>
                  <CartesianGrid vertical={false} />

                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                  />

                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    fill="var(--color-revenue)"
                    stroke="var(--color-revenue)"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {
          products?.length &&
          <Card className="p-0 rounded-md">
            <CardHeader className="flex pb-2 pt-3 flex-row items-center justify-between">
              <CardTitle>Best selling Products</CardTitle>
            </CardHeader>
            <CardContent className="p-0">

              <DataTable
                columns={columns}
                data={products}
              />



            </CardContent>
          </Card>
        }
      </div>
    </div>
  )
}

export default DashboardComponent