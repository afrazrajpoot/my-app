import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `https://api.ridebookingapp.aamirsaeed.com/api/v1`,
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: ({ data }) => ({
        url: "/registerUser",
        method: "POST",
        body: data,
      }),
    }),
    loginUser: builder.mutation({
      query: ({ data }) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
    }),
    getAllUsers: builder.mutation({
      query: ({ data }) => ({
        url: "/getUsers",
        method: "POST",
        body: data,
      }),
    }),
    getUserLocation: builder.mutation({
      query: ({ data }) => ({
        url: "/getUserLocation",
        method: "POST",
        body: data,
      }),
    }),
    subscription: builder.mutation({
      query: ({ data }) => ({
        url: "/subscription",
        method: "PUT",
        body: data,
      }),
    }),
    jazzCash: builder.mutation({
      query: ({ data }) => ({
        url: "/jazzCash",
        method: "POST",
        body: data,
      }),
    }),
    toggleStatus: builder.mutation({
      query: ({ data, userId }) => ({
        url: "/toggleStatus",
        method: "PUT",
        body: data,
        headers: {
          'user-id': userId, // Set custom header
        },
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useGetAllUsersMutation,
  useGetUserLocationMutation,
  useLoginUserMutation,
  useToggleStatusMutation,
  useSubscriptionMutation,
  useJazzCashMutation,
} = storeApi;
