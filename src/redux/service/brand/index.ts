import {  baseApi } from "..";

export const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: () => '/brands',
      providesTags: ['Brands'],
    }),


    createBrand: builder.mutation({
      query: (newBrand) => ({
        url: '/brands',
        method: 'POST',
        body: newBrand,
      }),
      invalidatesTags: ['Brands'],
    }),


    updateBrand: builder.mutation({
      query: ({ id, ...updatedBrand }) => ({
        url: `/brands/${id}`,
        method: 'PATCH',
        body: updatedBrand,
      }),
      invalidatesTags: ['Brands'],
    }),


    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/brands/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Brands'],
    }),
  })
})


export const {useGetBrandsQuery} = brandApi;