import axiosInstance from "../../axiosInstance";

const verifyToken = (accessToken: string) => {
    axiosInstance
        .post(`/auth/token/verify/`, {
            token: accessToken,
        })
        .then((response) => {
            console.log("Token verification successful:", response.data);
        })
        .catch((error) => {
            console.error("Token verification failed:", error.response.data);
            if (error.response.status === 401) {
                localStorage.removeItem('user_data');
            }
        });
};

export default verifyToken;