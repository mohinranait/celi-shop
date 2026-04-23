import { TLoginInputs, TRegisterInputs } from "@/validations/auth.schema";
import { baseApi } from "..";
import { AutResponse } from "./type";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AutResponse, TLoginInputs>({
      query: (payload) => ({
        url: "/auth/login",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["user"],
    }),
    register: builder.mutation<AutResponse, TRegisterInputs>({
      query: (payload) => ({
        url: "/auth/register",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["user"],
    }),
    authUser: builder.query<AutResponse, void>({
      query: () => ({
        url: "/auth/me",  
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    logout : builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",  
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useAuthUserQuery, useLogoutMutation } = authApi;
