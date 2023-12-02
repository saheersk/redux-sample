import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/auth/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { UserReducer } from "../store/store";

function Home() {
    const dispatch = useDispatch();
    const username: string | undefined = useSelector((state: UserReducer) => state.user.data?.username);
    const isLoggedIn: boolean = useSelector((state: UserReducer) => state.user.isLoggedIn);

    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/login");
    };

    return (
        <div className=" bg-gray-100 h-[100vh] flex justify-center items-center">
            <div>
                <div className="text-center mb-3">
                    <h1 className="text-3xl font-bold">Home</h1>
                    <h6 className="text-lg text-red-500 capitalize">{username}</h6>
                    <Link to="/profile">Profile</Link>
                </div>
                <div className="">
                    {isLoggedIn ? (
                        <Link to="/login">
                            <button className="text-white bg-blue-900 text-lg p-3 rounded mr-2" onClick={handleLogout}>
                                Logout
                            </button>
                        </Link>
                    ) : (
                        <>
                            <Link to="/login">
                                <button className="text-white bg-blue-900 text-lg p-3 rounded mr-2">Login</button>
                            </Link>

                            <Link to="/sign-up">
                                <button className="text-white bg-blue-900 text-lg p-3 rounded mr-2">SignUp</button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
