import { useDispatch, useSelector } from "react-redux";
import { UserReducer } from "../../store/store";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/auth/userSlice";
import UserList from "./UserList";
import axiosInstance from "../../../axiosInstance";
import { AxiosError, AxiosResponse } from "axios";
import { addUserData } from "../../redux/profile/profileSlice";

function AdminUser() {
    const dispatch = useDispatch();
    const isAdmin: boolean | undefined = useSelector((state: UserReducer) => state.user.data?.is_admin);

    const [searchTerm, setSearchTerm] = useState<string>("");

    const navigate = useNavigate();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/login");
    };

    useEffect(() => {
        if (!isAdmin) {
            navigate("/");
        }
        axiosInstance
            .get(`/admin/users/all/?search=${searchTerm}`)
            .then((response: AxiosResponse) => {
                console.log(response.data.users, "user data");
                dispatch(addUserData(response.data.users));
            })
            .catch((err: AxiosError) => {
                console.log(err);
            });
    }, [navigate, isAdmin, searchTerm]);

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-3xl font-bold mb-4">Admin Page</h1>
            <div className="flex ">
                <Link to="/admin/add/">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 mr-2">Add User</button>
                </Link>
                <button onClick={handleLogout} className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 mr-3">
                    Logout
                </button>
                <div className="mb-4 flex items-center">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="p-2 border rounded-md"
                    />
                </div>
            </div>

            <div>
                <UserList />
            </div>
        </div>
    );
}

export default AdminUser;
