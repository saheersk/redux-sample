import { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance";
import { useNavigate, useParams } from "react-router-dom";

interface FormData {
    first_name: string;
    last_name: string;
    image: string | null;
    email: string;
    is_superuser: boolean;
    phone_number: string;
    username: string;
}

const UserEditInput = () => {
    const [formData, setFormData] = useState<FormData>({
        first_name: "",
        last_name: "",
        image: null,
        email: "",
        is_superuser: false,
        phone_number: "",
        username: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const navigate = useNavigate();
    const params = useParams();

    const validateForm = () => {
        if (
            !formData.first_name.trim() ||
            !formData.last_name.trim() ||
            !formData.username.trim() ||
            !formData.phone_number.trim()
        ) {
            setErrorMessage("All fields are required.");
            return false;
        }

        const phoneRegex = /^\+?91\d{10}$/;
        if (!phoneRegex.test(formData.phone_number)) {
            setErrorMessage("Invalid phone number format. Please enter a 10-digit number with +91.");
            return false;
        }

        return true;
    };

    const handleInputChange = (e: any) => {
        const { name, value, files } = e.target;

        if (name === "image" && files) {
            const selectedFile = files[0];
            if (selectedFile && selectedFile.type.startsWith("image/")) {
                setImageFile(selectedFile);
                console.log(imageFile, "image file");
                setErrorMessage("");
            } else {
                setImageFile(null);
                setErrorMessage("Please select a valid image file.");
            }
        } else {
            setFormData((prevUser) => ({
                ...prevUser,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const formDataProfile = new FormData();
        formDataProfile.append("first_name", formData.first_name);
        formDataProfile.append("last_name", formData.last_name);
        formDataProfile.append("email", formData.email);
        formDataProfile.append("username", formData.username);
        formDataProfile.append("is_superuser", String(formData.is_superuser));
        formDataProfile.append("phone_number", formData.phone_number);
        if (imageFile) {
            formDataProfile.append("image", imageFile);
        } else {
            console.log(imageFile, "image");
        }

        if (!validateForm()) {
            return;
        }

        axiosInstance
            .put(`/admin/user/${params.id}/`, formDataProfile)
            .then((response: AxiosResponse) => {
                console.log(response.data.data, "Add edit");
                navigate("/admin");
            })
            .catch((err: AxiosError) => {
                console.log(err);
                if ((err as any).response?.data?.message?.non_field_errors[0]) {
                    setErrorMessage((err as any).response?.data?.message?.non_field_errors[0]);
                }
            });
        console.log("Form submitted:", formData);
    };

    useEffect(() => {
        axiosInstance
            .get(`/admin/user/${params.id}/`)
            .then((response: AxiosResponse) => {
                console.log(response.data.user, "user data");
                setFormData(response.data.user);
            })
            .catch((err: AxiosError) => {
                console.log(err);
            });
    }, [imageFile]);

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-3xl font-bold mb-4">Edit Form</h1>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="mb-4">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name:
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="mt-1 p-2 border rounded-md w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name:
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="mt-1 p-2 border rounded-md w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username:
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="mt-1 p-2 border rounded-md w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 p-2 border rounded-md w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700">
                        Phone Number:
                    </label>
                    <input
                        type="text"
                        id="phonenumber"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        className="mt-1 p-2 border rounded-md w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        Image:
                    </label>
                    <span>Existing Image</span>
                    {formData.image && (
                        <img
                            src={`http://localhost:8000${formData.image}`}
                            alt="Profile"
                            className="mt-2 mb-2 w-full h-32 object-cover"
                        />
                    )}
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleInputChange}
                        accept=".jpg, .jpeg, .png"
                        className="mt-1 p-2 border rounded-md w-full"
                    />
                </div>
                <div className="mb-4 flex items-center">
                    <input
                        type="checkbox"
                        id="admin"
                        name="is_superuser"
                        checked={formData.is_superuser}
                        onChange={(e) =>
                            setFormData((prevUser) => ({
                                ...prevUser,
                                is_superuser: e.target.checked,
                            }))
                        }
                        className="mt-1 p-2 border rounded-md "
                    />
                    <label htmlFor="admin" className="block text-sm font-medium text-gray-700 ml-2">
                        IsAdmin
                    </label>
                </div>
                {errorMessage && <span>{errorMessage}</span>}
                <div className="mt-4">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserEditInput;
