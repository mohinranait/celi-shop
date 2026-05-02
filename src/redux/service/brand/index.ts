
import { TBrandInput } from "@/components/validations/brands";
import {  baseApi } from "..";
import { IBrand, IBrandResponse } from "./type";
import { ISoftDelete } from "@/global";

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


    updateBrand: builder.mutation<IBrand, {id:string,payload:TBrandInput}>({
      query: ({ id, payload }) => ({
        url: `/admin/brands/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['Brands'],
    }),

    softDeleteBrand: builder.mutation<IBrand, {id:string,payload:ISoftDelete}>({
      query: ({ id, payload }) => ({
        url: `/admin/brands/${id}/soft`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['Brands'],
    }),


    deleteBrand: builder.mutation<IBrand, string>({
      query: (id) => ({
        url: `/admin/brands/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Brands'],
    }),
  })
})


export const {useGetBrandsQuery, useCreateBrandMutation, useUpdateBrandMutation, useSoftDeleteBrandMutation, useDeleteBrandMutation} = brandApi;