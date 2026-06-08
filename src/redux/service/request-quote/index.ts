
import {  baseApi } from "..";
import { IRequestQuoteListResponse } from "./type";

export const requestQuoteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRequestQuotes: builder.query<IRequestQuoteListResponse, string>({
      query: (params) => `/admin/request-quote?${params}`,
    }),


    createQuote: builder.mutation({
      query: (payload) => ({
        url: '/admin/request-quote',
        method: 'POST',
        body: payload,
      }),
    }),


    // updateFaq: builder.mutation({
    //   query: ({ id, payload }) => ({
    //     url: `/admin/faqs/${id}`,
    //     method: 'PUT',
    //     body: payload,
    //   }),
    //   invalidatesTags: ['faqs'],
    // }),


    deleteQuote: builder.mutation({
      query: (id) => ({
        url: `/admin/request-quote/${id}`,
        method: 'DELETE',
      }),
    }),
  })
})


export const {useGetRequestQuotesQuery, useCreateQuoteMutation,useDeleteQuoteMutation} = requestQuoteApi;