
import { baseApi } from "@/redux/service";
import { IAnalayticsResponse } from "./type";


const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query<IAnalayticsResponse, string>({
      query: () => `/client/analytics`
    }),
  }),
});

export const { useGetDashboardAnalyticsQuery } = dashboardApi;
