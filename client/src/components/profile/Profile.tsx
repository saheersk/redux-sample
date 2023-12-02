import { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance";
import { Link } from "react-router-dom";

interface UserProfile {
    username: string;
    email: string;
    image: string;
    first_name: string;
    last_name: string;
}

const UserProfile = () => {
    const [user, setUser] = useState<UserProfile>({
        username: "",
        email: "",
        image: "", // Replace with the actual URL of the profile image
        first_name: "",
        last_name: "",
    });
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleEditClick = () => {
        setIsEditing((prev) => !prev);
    };

    const handleSaveClick = () => {
        const formData = new FormData();
        formData.append('username', user.username);
        formData.append('email', user.email);
        formData.append('first_name', user.first_name);
        formData.append('last_name', user.last_name);
        if (imageFile) {
            formData.append('image', imageFile);
            console.log(imageFile, "imageFile adfkads");

        }
    
        axiosInstance
            .put(`/auth/profile/`, formData)
            .then((response: AxiosResponse) => {
                console.log(response.data.data, "profile edit");
                setUser(response.data.data);
                setIsEditing(false);
            })
            .catch((err: AxiosError) => {
                if ((err as any)?.response?.status === 400) {
                    if ((err as any)?.response?.data?.message?.username) {
                        console.log((err as any).response.data.message.username);
                        setErrorMessage((err as any).response.data.message.username);
                    } else if ((err as any).response.data.message.email) {
                        setErrorMessage((err as any).response.data.message.email);
                    } else {
                        console.log((err as any).response.data.message);
                    }
            }
        });

    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        console.log("Updating", name, "to", value);

        if (name === "image" && files) {
            const selectedFile = files[0];
            if (selectedFile && selectedFile.type.startsWith("image/")) {
                setImageFile(selectedFile);
                setErrorMessage("");
            } else {
                setImageFile(null);
                setErrorMessage("Please select a valid image file.");
            }
        } else {
            setUser((prevUser) => ({
                ...prevUser,
                [name]: value,
            }));
        }
    };

    useEffect(() => {
        axiosInstance
            .get(`/auth/profile/`)
            .then((response: AxiosResponse) => {
                console.log(response.data.users, "profile");
                setUser(response.data.users);
            })
            .catch((err: AxiosError) => {
                console.log(err);
            });
    }, []);
    return (
        <div className="container mx-auto mt-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden">

                        {user?.image ? (
                            <img src={`${user?.image}`}  alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span>No image</span>
                        )}
                    </div>
                    <div className="ml-4">
                        <h1 className="text-2xl font-bold">Username: {user.username}</h1>
                        <p className="text-gray-600 mb-1">Email: {user.email}</p>
                        <p className="text-gray-600 mb-1">First Name: {user.first_name}</p>
                        <p className="text-gray-600 mb-1">Last Name: {user.last_name}</p>
                    </div>
                </div>
                <div className="border-t border-gray-300 pt-4">
                    {isEditing ? (
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                Image:
                            </label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                onChange={handleInputChange}
                                accept=".jpg, .jpeg, .png"
                                className="mt-1 p-2 border rounded-md w-full"
                            />

                            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                                First Name:
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="first_name"
                                value={user.first_name}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border rounded-md w-full"
                            />

                            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                                Last Name:
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="last_name"
                                value={user.last_name}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border rounded-md w-full"
                            />

                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username:
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={user.username}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border rounded-md w-full"
                            />

                            <label htmlFor="email" className="block mt-4 text-sm font-medium text-gray-700">
                                Email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={user.email}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border rounded-md w-full"
                            />
                            {errorMessage && <span>{errorMessage}</span>}
                            <div className="mt-4">
                                <button
                                    onClick={handleSaveClick}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleEditClick}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={handleEditClick}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                            >
                                Edit Profile
                            </button>
                            <Link to="/">
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Home</button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
