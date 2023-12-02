import { configureStore } from "@reduxjs/toolkit";
import userSlice, { type UserData } from "../redux/auth/userSlice";
import profileSlice, { UserProfileData } from "../redux/profile/profileSlice";


export interface UserReducer {
    user: UserData;
}

export interface ProfileReducer {
    profile: UserProfileData;
}

const store = configureStore({
    reducer: {
        user: userSlice,
        profile: profileSlice
    }
});

export default store;