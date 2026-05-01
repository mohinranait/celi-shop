import { baseApi } from "..";


export const appConfigApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConfigs: builder.query<any, void>({
      query: () => `/admin/config`,
      providesTags: ['config'],
    }),


    createConfig: builder.mutation({
      query: (payload) => ({
        url: '/admin/config',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['config'],
    }),
  })
})


export const {useGetConfigsQuery, useCreateConfigMutation} = appConfigApi;