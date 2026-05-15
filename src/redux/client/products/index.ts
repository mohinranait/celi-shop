
import { baseApi } from "@/redux/service";
import { IBrand } from "@/redux/service/brand/type";
import { IProductFilterParams } from "./type";
import { IProductListResponse } from "@/redux/service/products/type";


const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientProducts : builder.query<IProductListResponse, string>({
      query: (params) => `/client/products?${params}`
    }),
    getProductsForFilters: builder.query<IProductListResponse, IProductFilterParams>({
      query: (params) => ({
        url: "/client/products/filters",
        params,
      }),
    }),
    getBrandsByCategory: builder.query<{ data: IBrand[] }, string | undefined>({
      query: (category) => ({
        url: "client/products/brands-by-category",
        params: category ? { category } : {},
      }),
    }),
  
  }),
});

export const { useGetClientProductsQuery, useGetProductsForFiltersQuery, useGetBrandsByCategoryQuery  } = authApi;
