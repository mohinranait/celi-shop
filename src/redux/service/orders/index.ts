
import {  baseApi } from "..";
import { ISoftDelete } from "@/global";
import { ICehckoutForm, IOrder, IOrderListResponse } from "./type";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOrders: builder.query<IOrderListResponse, string>({
      query: (params) => `/admin/orders?${params}`,
      providesTags: ['orders'],
    }),


    createOrder: builder.mutation<{data:IOrder}, ICehckoutForm>({
      query: (payload) => ({
        url: '/admin/orders',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['orders'],
    }),


    getOrderByTrackingNumber: builder.query<{data:IOrder}, string>({
      query: (trackNumber) => `/client/order/tracking/${trackNumber}`
    }),


    updateOrder: builder.mutation<IOrder, {id:string,payload:ICehckoutForm}>({
      query: ({ id, payload }) => ({
        url: `/admin/orders/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['orders'],
    }),

    softDeleteOrder: builder.mutation<IOrder, {id:string,payload:ISoftDelete}>({
      query: ({ id, payload }) => ({
        url: `/admin/orders/${id}/soft`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['orders'],
    }),


    deleteOrder: builder.mutation<IOrder, string>({
      query: (id) => ({
        url: `/admin/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['orders'],
    }),
  })
})


export const {useGetAdminOrdersQuery, useCreateOrderMutation, useGetOrderByTrackingNumberQuery} = orderApi;