import { createSlice } from '@reduxjs/toolkit';

export type UserProfileData = {
    userData: any;
    id: number;
    image: string;
    username: string;
    email: string;
    first_name: string;
    last_name: number;
    is_superuser: boolean;
};

type SearchPayload = {
  payload: string;
  type: string;
};

type RemovePayload = {
  payload: number;
  type: string;
};

type UserProfilePayload = {
    payload: UserProfileData[];
    type: string;
}

export type UserState = {
    userData: UserProfileData[];
}

const initialState: UserState = {
    userData: [],
}

const profileSlice = createSlice({
    name: 'user data',
    initialState,
    reducers: {
      addUserData: (state, action: UserProfilePayload) => {
        state.userData = action.payload;
      },
      removeUserData: (state, action: RemovePayload) => {
        state.userData = state.userData.filter((user) => user.id !== action.payload)
      },
      searchUserData: (state, action: SearchPayload) => {
        const searchTerm = action.payload.toLowerCase();
        state.userData = state.userData.filter(
          (user) =>
            user.username.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.first_name.toLowerCase().includes(searchTerm) ||
            user.last_name.toString().toLowerCase().includes(searchTerm)
        );
      },
    },
  });
  
  export const { addUserData, removeUserData, searchUserData } = profileSlice.actions;
  
  export default profileSlice.reducer;