import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserReducer } from "../../store/store";

function SignUpForm() {
    const isLoggedIn: boolean = useSelector((state: UserReducer) => state.user.isLoggedIn);

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const navigate = useNavigate();

    const validateForm = () => {
        if (!firstName || !lastName || !username || !phoneNumber || !password || !confirmPassword) {
            setErrorMessage("All fields are required.");
            return false;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return false;
        }

        const phoneRegex = /^\+?91\d{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            setErrorMessage("Invalid phone number format. Please enter a 10-digit number with +91.");
            return false;
        }

        return true;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        axiosInstance
            .post(`/auth/register/`, {
                first_name: firstName,
                last_name: lastName,
                username,
                password,
                phone_number: phoneNumber,
                confirm_password: confirmPassword,
            })
            .then((response) => {
                console.log(response);
                if (response.status == 201) {
                    navigate("/login");
                }
            })
            .catch((error) => {
                console.log("Error", error.response.data.message.non_field_errors[0]);
                if(error.response?.data?.message?.non_field_errors[0]){
                    setErrorMessage(error.response?.data?.message?.non_field_errors[0])
                }
            });
    };

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="flex items-center justify-center h-screen">
            <form className="w-full max-w-md p-6 bg-white rounded-lg shadow-md" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-semibold mb-4">Sign up</h2>
                <div className="mb-4">
                    <label htmlFor="firstName" className="block text-gray-700 font-medium">
                        First Name
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={firstName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="lastName" className="block text-gray-700 font-medium">
                        Last Name
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={lastName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 font-medium">
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={username}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 font-medium">
                        PhoneNumber
                    </label>
                    <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={phoneNumber}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 font-medium">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-gray-700 font-medium">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="px-6 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
                    >
                        Sign Up
                    </button>
                </div>
                {errorMessage && <span>{errorMessage}</span>}
            </form>
        </div>
    );
}

export default SignUpForm;
