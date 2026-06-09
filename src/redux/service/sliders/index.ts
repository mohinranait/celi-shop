
import { TSliderInput } from "@/components/validations/slider";
import {  baseApi } from "..";
import { ISoftDelete } from "@/types/common.type";
import { ISlider, ISliderResponse } from "./type";

export const sliderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSliders: builder.query<ISliderResponse, string>({
      query: (params) => `/admin/sliders?${params}`,
      providesTags: ['sliders'],
    }),


    createSlider: builder.mutation<ISlider, TSliderInput>({
      query: (payload) => ({
        url: '/admin/sliders',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['sliders'],
    }),


    updateSlider: builder.mutation<ISlider, {id:string,payload:TSliderInput}>({
      query: ({ id, payload }) => ({
        url: `/admin/sliders/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['sliders'],
    }),

    softDeleteSlider: builder.mutation<ISlider, {id:string,payload:ISoftDelete}>({
      query: ({ id, payload }) => ({
        url: `/admin/sliders/${id}/soft`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['sliders'],
    }),


    deleteSlider: builder.mutation<ISlider, string>({
      query: (id) => ({
        url: `/admin/sliders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['sliders'],
    }),
  })
})


export const {useGetSlidersQuery, useCreateSliderMutation, useUpdateSliderMutation, useSoftDeleteSliderMutation, useDeleteSliderMutation} = sliderApi;