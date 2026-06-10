
import { baseApi } from "..";
import { ICommentListResponse } from "./type";

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query<ICommentListResponse, string>({
      query: (params) => `/comments?${params}`,
      providesTags: ['comments'],
    }),


    createComment: builder.mutation({
      query: (payload) => ({
        url: '/comments',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['comments'],
    }),


    getCommentByProductId: builder.query<ICommentListResponse, {productId: string ; params: string}>({
      query: ({productId, params}) => ({
        url: `comments/${productId}?${params}`,
      }),
      providesTags: ['comments'],
    }),

    updateComment: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/comments/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['comments'],
    }),



    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['comments'],
    }),
  })
})


export const { useGetCommentsQuery, useCreateCommentMutation, useGetCommentByProductIdQuery, useUpdateCommentMutation, useDeleteCommentMutation } = commentApi;