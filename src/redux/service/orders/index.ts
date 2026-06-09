
import { baseApi } from "..";
import { ISoftDelete } from "@/types/common.type";
import { ICehckoutForm, IOrder, IOrderListResponse } from "./type";
import { IOrderUpdaeView } from "@/app/(admin)/admin/order/components/OrderUpdateForm";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOrders: builder.query<IOrderListResponse, string>({
      query: (params) => `/admin/orders?${params}`,
      providesTags: ['orders'],
    }),


    getOrderByIdAdmin: builder.query<{ data: IOrder }, string>({
      query: (orderId) => `/admin/orders/${orderId}`
    }),


    updateOrderByIdAdmin: builder.mutation<IOrder, { id: string, payload: IOrderUpdaeView }>({
      query: ({ id, payload }) => ({
        url: `/admin/orders/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['orders'],
    }),




    createOrder: builder.mutation<{ data: IOrder }, ICehckoutForm>({
      query: (payload) => ({
        url: '/admin/orders',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['orders'],
    }),


    getOrderByTrackingNumber: builder.query<{ data: IOrder }, string>({
      query: (trackNumber) => `/client/order/tracking/${trackNumber}`
    }),




    softDeleteOrder: builder.mutation<IOrder, { id: string, payload: ISoftDelete }>({
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


export const { useGetAdminOrdersQuery, useGetOrderByIdAdminQuery, useUpdateOrderByIdAdminMutation, useCreateOrderMutation, useGetOrderByTrackingNumberQuery } = orderApi;