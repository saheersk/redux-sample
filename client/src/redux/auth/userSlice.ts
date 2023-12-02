import { createSlice } from '@reduxjs/toolkit';

export type TokenInfo = {
    status: boolean;
    message: string;
    token: {
      access: string;
      refresh: string;
    };
    username: string
    user_id: number;
    is_admin: boolean;
};

type UserPayload = {
    payload: TokenInfo;
    type: string;
}

export type UserData = {
    data: TokenInfo | null;
    message: string;
    isLoggedIn: boolean;
}

const initialState: UserData = {
    data: (() => {
      try {
        return JSON.parse(localStorage.getItem('user_data') ?? '');
      } catch {
        return null;
      }
    })(),
    message: "",
    isLoggedIn: localStorage.getItem('user_data') ? true : false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action: UserPayload) => {
      state.isLoggedIn = true
      state.data = action.payload;
      state.message = '';
      localStorage.setItem('user_data', JSON.stringify(action.payload));
    },
    loginFailure: (state, action) => {
      state.isLoggedIn = false
      state.data = null
      state.message = action.payload.data.message;
    },
    clearMessage: (state) => {
      state.isLoggedIn = false
      state.message = '';
    },
    logoutUser: (state) => {
      state.isLoggedIn = false
      state.data = null;
      state.message = '';
      localStorage.removeItem('user_data');
    },
  },
});

export const { loginSuccess, loginFailure, clearMessage, logoutUser } = userSlice.actions;

export default userSlice.reducer;