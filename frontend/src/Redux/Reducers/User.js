import { createReducer } from "@reduxjs/toolkit";

export const userReducer = createReducer({}, {

    LoginRequest: (state) => {
        state.loading = true;
        state.isAuthenticated = false;
    },
    LoginSuccess: (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
    },
    LoginFailure: (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = false;
    }
})