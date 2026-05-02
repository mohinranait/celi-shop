import { API_BASE_URL } from "@/lib/envSecret";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
  }),
  tagTypes: ['user','Brands',"media","config","category","products","attributes"], 
  endpoints: () => ({}), 
});