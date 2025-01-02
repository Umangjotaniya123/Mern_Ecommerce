import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllCartItemsResponse, MessageResponse, UpdateQuantityRequest } from "../../types/api-types";
import { CartItem } from "../../types/types";

export const cartItemsAPI = createApi({
    reducerPath: "cartItemsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/cartItems/`,
        credentials: 'include',
    }),
    tagTypes: ['cartItem'],

    endpoints: (builder) => ({
        newCartItem: builder.mutation<MessageResponse, CartItem>({
            query: (cartItem) => ({
                url: 'new',
                method: 'POST',
                body: cartItem,
            }),
            invalidatesTags: ['cartItem'],
        }),
        deleteCartItem: builder.mutation<MessageResponse, string>({
            query: (id) => ({
                url: `${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['cartItem'],
        }),
        updateQuantity: builder.mutation<MessageResponse, UpdateQuantityRequest>({
            query: ({ id, quantity }) => ({
                url: `${id}`,
                method: 'PUT',
                body: { quantity },
            }),
            invalidatesTags: ['cartItem']
        }),
        allCartItems: builder.query<AllCartItemsResponse, string>({
            query: (id) => `all?id=${id}`,
            providesTags: ['cartItem']
        }),
    })
})

export const { useNewCartItemMutation, useDeleteCartItemMutation, useUpdateQuantityMutation } = cartItemsAPI;
export const { useAllCartItemsQuery } = cartItemsAPI;