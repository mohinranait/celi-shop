
import {  baseApi } from "..";
import { IFaq, IFaqListResponse } from "./type";

export const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaqs: builder.query<IFaqListResponse, string>({
      query: (params) => `/admin/faqs?${params}`,
      providesTags: ['faqs'],
    }),


    createFaq: builder.mutation({
      query: (payload) => ({
        url: '/admin/faqs',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['faqs'],
    }),


    updateFaq: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/admin/faqs/${id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['faqs'],
    }),


    deleteFaq: builder.mutation<{data: IFaq }, string>({
      query: (id) => ({
        url: `/admin/faqs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['faqs'],
    }),
  })
})


export const {useGetFaqsQuery, useCreateFaqMutation, useUpdateFaqMutation, useDeleteFaqMutation} = faqApi;