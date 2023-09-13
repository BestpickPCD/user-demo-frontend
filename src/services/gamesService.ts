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
  }),
});

export const { useGetGamesQuery } = GamesService;