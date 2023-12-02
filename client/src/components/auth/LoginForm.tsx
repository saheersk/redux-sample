import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginFailure, loginSuccess } from "../../redux/auth/userSlice";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axiosInstance";
import { type UserReducer } from "../../store/store";
import verifyToken from "../../services/verify";

const LoginForm = () => {
    const dispatch = useDispatch();
    const isLoggedIn: boolean = useSelector((state: UserReducer) => state.user.isLoggedIn);
    const isAdmin: boolean | undefined = useSelector((state: UserReducer) => state.user.data?.is_admin);


    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post(`/auth/login/`, {
                username,
                password,
            });

            if (response.status === 200) {
                const data = response.data;

                dispatch(loginSuccess(data));

                if (response.data?.is_admin) {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            } else {
                console.log(response.data.data);
                dispatch(loginFailure(response.data));
            }
        } catch (error: any) {
            console.error(error.response.data);
            setErrorMessage(error.response.data.message);
            if (error.status === 400) {
                dispatch(loginFailure(error.response.data));
            }
        }

        setUsername("");
        setPassword("");
    };

    useEffect(() => {
        if(isAdmin){
            navigate("/admin");
        }
        else if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate, isAdmin]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md p-4 space-y-4 bg-white shadow-lg rounded-md">
                <h2 className="text-2xl font-semibold text-center">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="space-y-2">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="w-full p-2 border rounded-md"
                            placeholder="Your Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full p-2 border rounded-md"
                            placeholder="Your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 mt-4"
                        >
                            Login
                        </button>
                    </div>
                </form>
                {errorMessage && <p>{errorMessage}</p>}
            </div>
        </div>
    );
};

export default LoginForm;
