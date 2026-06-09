
import {  baseApi } from "..";
import { IUser, IUserResponse } from "./type";
import { ISoftDelete } from "@/types/common.type";
import { TUserInput } from "@/components/validations/user.schema";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<IUserResponse, string>({
      query: (params) => `/admin/users?${params}`,
      providesTags: ['users'],
    }),


    getUserById: builder.query<{data:IUser}, string>({
      query: (params) => `/admin/users/${params}`,
      providesTags: ['users'],
    }),





    createUser: builder.mutation<IUser, TUserInput>({
      query: (newBrand) => ({
        url: '/admin/users',
        method: 'POST',
        body: newBrand,
      }),
      invalidatesTags: ['users'],
    }),


    updateUser: builder.mutation<IUser, {id:string,payload:TUserInput}>({
      query: ({ id, payload }) => ({
        url: `/admin/users/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['users'],
    }),

    softDeleteUser: builder.mutation<IUser, {id:string,payload:ISoftDelete}>({
      query: ({ id, payload }) => ({
        url: `/admin/users/${id}/soft`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['users'],
    }),


    deleteUser: builder.mutation<IUser, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['users'],
    }),
  })
})


export const {useGetUsersQuery, useGetUserByIdQuery, useUpdateUserMutation, useDeleteUserMutation} = userApi;