
import {  baseApi } from "..";

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query({
      query: (params) => `/contacts?${params}`,
      providesTags: ['contacts'],
    }),


    createContact: builder.mutation({
      query: (payload) => ({
        url: '/contacts',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['contacts'],
    }),


  
  })
})


export const {useGetContactsQuery, useCreateContactMutation} = contactApi;