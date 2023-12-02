import axios, { AxiosInstance } from "axios";
import { TokenInfo } from "./src/redux/auth/userSlice";
import verifyToken from "./src/services/verify";

interface MyAxiosInstance extends AxiosInstance {}

const axiosInstance: MyAxiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1",
});

axiosInstance.interceptors.request.use(
    (config) => {
        console.log("intercepting request");
        if (localStorage.getItem("user_data")) {
            const token: TokenInfo = JSON.parse(localStorage.getItem("user_data") ?? "");
            const accessToken = token?.token?.access;
            if (accessToken) {
                config.headers["Authorization"] = `Bearer ${accessToken}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    async (response) => {
        console.log("response interceptor");

        if (response.status === 200 && response.data && response.data.access) {
            await verifyToken(response.data.access);
        }

        return response;
    },
    async (error) => {
        console.log("response error interceptor", error);

        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newAccessToken = await refreshAccessToken();
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
            }
        }

        return Promise.reject(error);
    }
);

const refreshAccessToken = async () => {
    console.log("refresh token");
    const token: TokenInfo = JSON.parse(localStorage.getItem("user_data") ?? "");
    const refreshResponse = await axiosInstance.post("/auth/token/refresh/", {
        refresh: token?.token?.refresh,
    });

    if (refreshResponse.data.access) {

        localStorage.setItem("user_data", JSON.stringify({
            ...token,
            token: {
                ...token.token,
                access: refreshResponse.data.access,
            },
        }));
    }

    return refreshResponse.data.access;
};



export default axiosInstance;
