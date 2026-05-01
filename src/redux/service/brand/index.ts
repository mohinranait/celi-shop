
import { TBrandInput } from "@/components/validations/brands";
import {  baseApi } from "..";
import { IBrand, IBrandResponse } from "./type";

export const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<IBrandResponse, string>({
      query: (params) => `/admin/brands?${params}`,
      providesTags: ['Brands'],
    }),


    createBrand: builder.mutation<IBrand, TBrandInput>({
      query: (newBrand) => ({
        url: '/admin/brands',
        method: 'POST',
        body: newBrand,
      }),
      invalidatesTags: ['Brands'],
    }),


    updateBrand: builder.mutation({
      query: ({ id, ...updatedBrand }) => ({
        url: `/admin/brands/${id}`,
        method: 'PATCH',
        body: updatedBrand,
      }),
      invalidatesTags: ['Brands'],
    }),


    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/admin/brands/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Brands'],
    }),
  })
})


export const {useGetBrandsQuery, useCreateBrandMutation, useUpdateBrandMutation, useDeleteBrandMutation} = brandApi;