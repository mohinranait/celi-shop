
import {  baseApi } from "..";
import { IMedia, IMediaListResponse } from "./type";

export const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMedias: builder.query<IMediaListResponse, string>({
      query: (params) => `/admin/media?${params}`,
      providesTags: ['media'],
    }),


    createMedia: builder.mutation<IMedia, FormData>({
      query: (newBrand) => ({
        url: '/admin/media',
        method: 'POST',
        body: newBrand,
      }),
      invalidatesTags: ['media'],
    }),


    // updateBrand: builder.mutation({
    //   query: ({ id, ...updatedBrand }) => ({
    //     url: `/admin/brands/${id}`,
    //     method: 'PATCH',
    //     body: updatedBrand,
    //   }),
    //   invalidatesTags: ['Brands'],
    // }),


    deleteMedia: builder.mutation({
      query: (id) => ({
        url: `/admin/media/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['media'],
    }),
  })
})


export const { useGetMediasQuery , useCreateMediaMutation, useDeleteMediaMutation  } = mediaApi;