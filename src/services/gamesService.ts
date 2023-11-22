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
    getGameList: builder.mutation<any,any>({
      query: ({vendor}) => ({
        url: `/game-list?vendors=${vendor}`,
        method: 'GET'
      })
    }),
    checkUser: builder.mutation<any, any>({
      query: (body) => ({
        url: "/user/check-user",
        method: "POST",
        body,
      }),
    }),
    createTransaction: builder.mutation<any, any>({
      query: (body) => ({
        url: "/transaction",
        method: "POST",
        body,
      }),
    }),
    openGame: builder.mutation<any,any>({
      query: (body) => ({
        url: "/game/open",
        method: "POST",
        body
      })
    }),
    userInfo: builder.query<any, { id: number }>({
      query: ({ id }) => ({
        url: `/user/${id}`,
      }),
    }),
  }),
});

export const {
  useGetGamesQuery,
  useGetGameListMutation,
  useGetTransactionQuery,
  useCheckUserMutation,
  useCreateTransactionMutation,
  useUserInfoQuery,
  useOpenGameMutation
} = GamesService;
