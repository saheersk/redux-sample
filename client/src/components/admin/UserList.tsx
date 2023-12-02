import { AxiosError, AxiosResponse } from "axios";
import { useEffect } from "react";
import axiosInstance from "../../../axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { type UserProfileData, removeUserData, addUserData } from "../../redux/profile/profileSlice";
import { ProfileReducer } from "../../store/store";
import { Link } from "react-router-dom";


function UserList() {
    const dispatch = useDispatch();
    const ProfileData: UserProfileData[] = useSelector((state: ProfileReducer) => state.profile.userData);


    const handleDelete = (userId: number) => {
        axiosInstance
            .delete(`/admin/user/${userId}/`)
            .then((response: AxiosResponse) => {
                console.log(response.data, "user data");
                dispatch(removeUserData(userId))
            })
            .catch((err: AxiosError) => {
                console.log(err);
            });
    };

    useEffect(() => {
        axiosInstance
            .get(`/admin/users/all/`)
            .then((response: AxiosResponse) => {
                console.log(response.data.users, "user data");
                dispatch(addUserData(response.data.users));
            })
            .catch((err: AxiosError) => {
                console.log(err);
            });
    }, []);

    return (
        <>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Username</th>
                        <th className="py-2 px-4 border-b">First Name</th>
                        <th className="py-2 px-4 border-b">Last Name</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">SuperUser</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {ProfileData.map((user) => (
                        <tr key={user.id}>
                            <td className="py-2 px-4 border-b">{user.id}</td>
                            <td className="py-2 px-4 border-b">{user.username}</td>
                            <td className="py-2 px-4 border-b">{user.first_name}</td>
                            <td className="py-2 px-4 border-b">{user.last_name}</td>
                            {user.is_superuser ? (
                                <td className="py-2 px-4 border-b text-green-400">Active</td>
                            ) : (
                                <td className="py-2 px-4 border-b text-red-400">DeActive</td>
                            )}
                            <td className="py-2 px-4 border-b">{user.email ? user.email : "None"}</td>
                            <td className="py-2 px-4 border-b">
                                <Link to={`/admin/edit/${user.id}`}>
                                    <button className="text-blue-500 hover:underline mr-2">Edit</button>
                                </Link>
                                <button className="text-red-500 hover:underline" onClick={() => handleDelete(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default UserList;
