import { createReducer } from "@reduxjs/toolkit";
const initialState = {};
export const userReducer = createReducer(initialState, {

    LoginRequest: (state) => {
        state.loading = true;
    },
    LoginSuccess: (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
    },
    LoginFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    },

    RegisterRequest: (state) => {
        state.loading = true;
    },
    RegisterSuccess: (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
    },
    RegisterFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    },

    LoadUserRequest: (state) => {
        state.loading = true;
    },
    LoadUserSuccess: (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
    },
    LoadUserFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    },
})

export const postOfFollowingReducer = createReducer(initialState, {
    PostOfFollowingRequest: (state) => {
        state.loading = true;
    },
    PostOfFollowingSuccess: (state, action) => {
        state.loading = false;
        state.posts = action.payload;
    },
    PostOfFollowingFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    clearError: (state) => {
        state.error = null;
    }
})

export const allUsersReducer = createReducer(initialState, {
    AllUsersRequest: (state) => {
        state.loading = true;
    },
    AllUserSuccess: (state, action) => {
        state.loading = false;
        state.users = action.payload;
    },
    AllUsersFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload
    },
    clearError: (state) => {
        state.error = null;
    }
})