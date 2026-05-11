
import { IAppSettings } from "@/models/app-setting";
import { baseApi } from "..";


export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAppSetting: builder.query<IAppSettings, void>({
      query: () => `/admin/setting`,
      providesTags: ['setting'],
    }),

    updateAppSetting: builder.mutation<IAppSettings, any>({
      query: ( payload ) => ({
        url: `/admin/setting`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['setting'],
    }),

  })
})


export const { useGetAppSettingQuery, useUpdateAppSettingMutation } = orderApi;