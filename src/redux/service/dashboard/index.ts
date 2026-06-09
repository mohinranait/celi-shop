
import {  baseApi } from "..";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    dashboardRevenue: builder.query({
      query: (params) => `/admin/dashboard/revenue?${params}`,
    }),

    dashboardAnalytics: builder.query({
      query: (params) => `/admin/dashboard?${params}`,
    }),


  })
})


export const {useDashboardRevenueQuery,useDashboardAnalyticsQuery} = dashboardApi;