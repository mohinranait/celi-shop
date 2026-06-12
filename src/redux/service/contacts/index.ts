
import {  baseApi } from "..";
import { IContactListResponse } from "./type";

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query<IContactListResponse, string>({
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