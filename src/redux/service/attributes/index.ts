
import {  baseApi } from "..";
import { IAttribute, IAttributeResponse } from "./type";
import { ISoftDelete } from "@/global";
import { TAttributeInput } from "@/components/validations/attributes";

export const attributeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttributes: builder.query<IAttributeResponse, string>({
      query: (params) => `/admin/attributes?${params}`,
      providesTags: ['attributes'],
    }),


    createAttribute: builder.mutation<IAttribute, TAttributeInput>({
      query: (payload) => ({
        url: '/admin/attributes',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['attributes'],
    }),


    updateAttribute: builder.mutation<IAttribute, {id:string,payload:TAttributeInput}>({
      query: ({ id, payload }) => ({
        url: `/admin/attributes/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['attributes'],
    }),

    softDeleteAttribute: builder.mutation<IAttribute, {id:string,payload:ISoftDelete}>({
      query: ({ id, payload }) => ({
        url: `/admin/attributes/${id}/soft`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['attributes'],
    }),


    deleteAttribute: builder.mutation<IAttribute, string>({
      query: (id) => ({
        url: `/admin/attributes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['attributes'],
    }),
  })
})


export const {useGetAttributesQuery, useCreateAttributeMutation, useUpdateAttributeMutation, useSoftDeleteAttributeMutation, useDeleteAttributeMutation} = attributeApi;