import { createApi } from "@reduxjs/toolkit/query/react";
import { ResponseType } from "@/models";
import { baseQueryWithoutToken } from "./baseQuery";
export const AuthService = createApi({
  reducerPath: "AuthService",
  baseQuery: baseQueryWithoutToken,
  endpoints: (builder) => ({
    login: builder.mutation<
      ResponseType<{
        userId: string;
        username: string;
        tokens: {
          accessToken: string;
          refreshToken: string;
        };
      }>,
      {
        username: string;
        password: string;
      }
    >({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation<
      ResponseType<{
        userId: string;
        username: string;
      }>,
      {
        username: string;
        password: string;
        confirmPassword: string;
        email: string;
        lastName: string;
        firstName: string;
      }
    >({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = AuthService;
