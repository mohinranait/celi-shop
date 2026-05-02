
import { TBrandInput } from "@/components/validations/brands";
import {  baseApi } from "..";
import { ICategory, ICategoryListResponse } from "./type";
import { ISoftDelete } from "@/global";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<ICategoryListResponse, string>({
      query: (params) => `/admin/categories?${params}`,
      providesTags: ['category'],
    }),


    createCategory: builder.mutation<ICategory, TBrandInput>({
      query: (payload) => ({
        url: '/admin/categories',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['category'],
    }),


    updateCategory: builder.mutation<ICategory, {id:string,payload:TBrandInput}>({
      query: ({ id, payload }) => ({
        url: `/admin/categories/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['category'],
    }),

    softDeleteCategory: builder.mutation<ICategory, {id:string,payload:ISoftDelete}>({
      query: ({ id, payload }) => ({
        url: `/admin/categories/${id}/soft`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['category'],
    }),

    deleteCategory: builder.mutation<ICategory, string>({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['category'],
    }),
  })
})


export const {useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useSoftDeleteCategoryMutation, useDeleteCategoryMutation  } = categoryApi;