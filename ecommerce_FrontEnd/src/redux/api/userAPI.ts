import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError, MutationDefinition, QueryDefinition } from "@reduxjs/toolkit/query/react";
import { AllUsersResponse, DeleteUserRequest, MessageResponse, UpdateUserRequest, UserResponse } from "../../types/api-types";
import { User } from "../../types/types";

type MutationType<Request, Response> = UseMutation<
    MutationDefinition<
        Request,
        BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
        "users",
        Response,
        "userApi"
    >
>;

type QueryType<Response> = UseQuery<
    QueryDefinition<
        void,  // Request type (void if no request body)
        BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
        "users",  // Endpoint name
        Response,
        "userApi"
    >
>;

export const userAPI = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user/`,
        credentials: 'include',
    }),
    tagTypes: ["users"],

    endpoints: (builder) => ({
        register: builder.mutation<MessageResponse, User>({
            query: (user) => ({
                url: "new",
                method: "POST",
                body: user,
            }),
            invalidatesTags: ["users"],
        }),

        login: builder.mutation<MessageResponse, User>({
            query: (user) => ({
                url: "login",
                method: "POST",
                body: user,
                credentials: "include"
            }),
            invalidatesTags: ["users"],
        }),

        logoutUser: builder.mutation<MessageResponse, void>({
            query: () => ({
                url: 'logout',
                method: 'POST'
            }),
            invalidatesTags: ["users"]
        }),

        deleteUser: builder.mutation<MessageResponse, DeleteUserRequest>({
            query: ({ userId, adminUserId }) => ({
                url: `${userId}?id=${adminUserId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["users"],
        }),

        updateUser: builder.mutation<MessageResponse, UpdateUserRequest>({
            query: ({ userId, formData }) => ({
                url: `${userId}`,
                method: "PUT",
                body: formData,
            })
        }),

        verify: builder.query<UserResponse, void>({
            query: () => ({
                url: 'verify',
                method: 'GET',
            }),
            providesTags: ['users'],
        }),


        allUsers: builder.query<AllUsersResponse, string>({
            query: (id) => `all?id=${id}`,
            providesTags: ["users"]
        }),
    }),
});

type mutation = {
    useRegisterMutation: MutationType<User, MessageResponse>
    useLoginMutation: MutationType<User, MessageResponse>
    useLogoutUserMutation: MutationType<void, MessageResponse>
    useUpdateUserMutation: MutationType<
        UpdateUserRequest,
        MessageResponse
    >
    useDeleteUserMutation: MutationType<
        DeleteUserRequest,
        MessageResponse
    >
}

type query = {
    useVerifyQuery: QueryType<UserResponse>;
    useAllUsersQuery: QueryType<AllUsersResponse>;
}

export const { useRegisterMutation, useLoginMutation, useLogoutUserMutation, useUpdateUserMutation, useDeleteUserMutation }: mutation = userAPI;

export const { useVerifyQuery, useAllUsersQuery }: query = userAPI;
