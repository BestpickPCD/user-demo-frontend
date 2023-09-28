import { createApi } from "@reduxjs/toolkit/query/react";
import { ResponseType } from "@/models";
import { baseQueryWithReAuth } from "./baseQuery";
export const GamesService = createApi({
  reducerPath: "GamesService",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getGames: builder.query<
      ResponseType<{
        data: any[];
        totalItems: number;
      }>,
      void
    >({
      query: (body) => ({
        url: "/games",
      }),
    }),
    getTransaction: builder.query<
      ResponseType<{
        data: any[];
        page: number;
        size: number;
        totalItems: number;
      }>,
      any
    >({
      query: (params) => ({
        url: "/transactions",
        params,
      }),
    }),
    checkUser: builder.mutation<any, any>({
      query: (body) => ({
        url: "/user/check-user",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetGamesQuery,
  useGetTransactionQuery,
  useCheckUserMutation,
} = GamesService;
