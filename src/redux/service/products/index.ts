
import { ISoftDelete } from "@/global";
import {  baseApi } from "..";
import { IProduct, IProductListResponse } from "./type";


export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<IProductListResponse, string>({
      query: (params) => `/admin/products?${params}`,
      providesTags: ['products'],
    }),


    createProduct: builder.mutation<IProduct, FormData>({
      query: (payload) => ({
        url: '/admin/products',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['products'],
    }),


    updateProduct: builder.mutation<IProduct, {id:string, payload:FormData}>({
      query: ({ id, payload }) => ({
        url: `/admin/products/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['products'],
    }),

    softDeleteProduct: builder.mutation<IProduct, {id:string,payload:ISoftDelete}>({
      query: ({ id, payload }) => ({
        url: `/admin/products/${id}/soft`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['products'],
    }),


    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['products'],
    }),
  })
})


export const {useCreateProductMutation, useGetProductsQuery,useUpdateProductMutation} = productApi;