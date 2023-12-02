import { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import axiosInstance from "../../../axiosInstance";
import { useNavigate } from "react-router-dom";

interface FormAddData {
    first_name: string;
    last_name: string;
    image: string | null;
    email: string;
    is_superuser: boolean;
    phone_number: string;
    username: string;
    password: string;
    confirm_password: string;
}

const UserInput = () => {
    const [formData, setFormData] = useState<FormAddData>({
        first_name: "",
        last_name: "",
        image: "",
        password: "",
        confirm_password: "",
        email: "",
        is_superuser: false,
        phone_number: "",
        username: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const navigate = useNavigate(); 

    const validateForm = () => {
        if (
            !formData.first_name.trim() ||
            !formData.last_name.trim() ||
            !formData.username.trim() ||
            !formData.phone_number.trim() ||
            !formData.password.trim() ||
            !formData.confirm_password.trim()
        ) {
            setErrorMessage("All fields are required.");
            return false;
        }
    
        if (/\s/.test(formData.password)) {
            setErrorMessage("Password should not contain spaces.");
            return false;
        }

        if (formData.password !== formData.confirm_password) {
            setErrorMessage("Passwords do not match.");
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
            .post(`/admin/user/add/`, formDataProfile)
            .then((response: AxiosResponse) => {
                console.log(response.data.data, "Add edit");
                navigate("/admin")
            })
            .catch((err: AxiosError) => {
                console.log(err);
                if((err as any).response?.data?.message?.non_field_errors[0]){
                    setErrorMessage((err as any).response?.data?.message?.non_field_errors[0])
                }
            });
        console.log("Form submitted:", formData);
    };

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-3xl font-bold mb-4">Registration Form</h1>
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
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleInputChange}
                        accept=".jpg, .jpeg, .png"
                        className="mt-1 p-2 border rounded-md w-full"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="mt-1 p-2 border rounded-md w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm Password:
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleInputChange}
                        className="mt-1 p-2 border rounded-md w-full"
                        required
                    />
                </div>

                <div className="mb-4 flex items-center">
                    <input
                        type="checkbox"
                        id="admin"
                        name="is_superuser"
                        onChange={handleInputChange}
                        checked={formData.is_superuser}
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

export default UserInput;
