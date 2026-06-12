
import { baseApi } from "..";


export const siteContentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSiteContent: builder.query({
      query: () => `/admin/site-content`,
      providesTags: ['site-content'],
    }),

    updateSiteContent: builder.mutation({
      query: ( payload ) => ({
        url: `/admin/site-content`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['site-content'],
    }),

  })
})


export const { useGetSiteContentQuery, useUpdateSiteContentMutation } = siteContentApi;