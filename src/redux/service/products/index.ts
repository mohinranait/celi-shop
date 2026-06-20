
import { ISoftDelete } from "@/types/common.type";
import {  baseApi } from "..";
import { IProduct, IProductDetailsResponse, IProductListResponse } from "./type";
import { TProductFormType } from "@/components/validations/product";


export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<IProductListResponse, string>({
      query: (params) => `/admin/products?${params}`,
      providesTags: ['products'],
    }),


    createProduct: builder.mutation<{data:IProduct}, TProductFormType>({
      query: (payload) => ({
        url: '/admin/products',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['products'],
    }),


    getProductById : builder.query<IProductDetailsResponse, string>({
      query: (productId) => ({
        url: `/admin/products/${productId}`,
      }),
      providesTags: ['product'],
    }),

     getProductBySlug : builder.query<IProductDetailsResponse, string>({
      query: (productId) => ({
        url: `/client/products/${productId}`,
      }),
      providesTags: ['product'],
    }),


    updateProduct: builder.mutation<{data:IProduct}, {id:string, payload:TProductFormType}>({
      query: ({ id, payload }) => ({
        url: `/admin/products/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['products',"product"],
    }),

    softDeleteProduct: builder.mutation<{data:IProduct}, {id:string,payload:ISoftDelete}>({
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


export const {useCreateProductMutation, useGetProductsQuery, useGetProductByIdQuery, useGetProductBySlugQuery, useUpdateProductMutation, useSoftDeleteProductMutation, useDeleteProductMutation} = productApi;