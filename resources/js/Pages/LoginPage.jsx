import React, { useState } from "react";
import axios from "axios"; // pastikan axios sudah di-install
import obat from "../assets/obat.png";
import { Inertia } from "@inertiajs/inertia";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
    const [selectedRole, setSelectedRole] = useState(""); // untuk role admin atau kasir
    const [username, setUsername] = useState(""); // untuk username
    const [password, setPassword] = useState(""); // untuk password
    const [passwordVisible, setPasswordVisible] = useState(false); // untuk melihat password
    const [errorMessage, setErrorMessage] = useState(""); // untuk menampilkan pesan error

    // Login handler
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Pastikan Anda menangkap respons dengan benar
            const response = await axios.post("/login", {
                username,
                password,
                role: selectedRole,
            });

            console.log("Login Response:", response); // Verifikasi apakah respons diterima

            if (response.data.status === "success") {
                Inertia.get(
                    route("dashboard_" + selectedRole),
                    {},
                    {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true,
                        data: {
                            loginSuccessMessage: response.data.message, // Mengirim pesan berhasil login
                        },
                    }
                );
            } else {
                toast.error(response.data.message); // Tampilkan error jika login gagal
            }
        } catch (error) {
            console.error("Login error:", error); // Debug jika ada error
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Terjadi kesalahan. Silakan coba lagi.");
            }
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Decorative with gradient */}
            <div className="hidden md:block w-1/2 bg-gradient-to-b from-[#1A6291] to-blue-300 p-12 relative">
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <img src={obat} alt="Obat" className="w-80" />
                </div>
            </div>

            {/* Right side - Login form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                    <div className="mb-6 text-center">
                        <h2 className="text-sm text-gray-600">
                            Welcome to{" "}
                            <span className="text-[#1A6291] font-medium">
                                RajaPharma
                            </span>
                        </h2>
                        <h1 className="text-3xl font-bold mt-2">Login</h1>
                    </div>

                    <div>
                        {/* Role selection */}
                        <div className="mb-4">
                            <label
                                htmlFor="role"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Select your role
                            </label>
                            <select
                                id="role"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A6291] focus:border-[#1A6291] bg-white"
                                value={selectedRole}
                                onChange={(e) =>
                                    setSelectedRole(e.target.value)
                                }
                            >
                                <option value="" disabled>
                                    Choose role
                                </option>
                                <option value="admin">Admin</option>
                                <option value="kasir">Kasir</option>
                            </select>
                        </div>

                        {/* Username */}
                        <div className="mb-4">
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A6291] focus:border-[#1A6291]"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-5">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    id="password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/3 transform -translate-y-1/2 text-gray-500"
                                    onClick={() =>
                                        setPasswordVisible(!passwordVisible)
                                    }
                                >
                                    {passwordVisible ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                            <line
                                                x1="1"
                                                y1="1"
                                                x2="23"
                                                y2="23"
                                            ></line>
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="3"
                                            ></circle>
                                        </svg>
                                    )}
                                </button>
                                <p className="text-xs text-gray-500 mt-2">
                                    * Password harus minimal 8 karakter
                                </p>
                            </div>
                        </div>

                        {/* Display error message */}
                        {errorMessage && (
                            <div className="mb-4 text-red-500 text-center">
                                {errorMessage}
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            onClick={handleLogin}
                            className="w-full bg-[#1A6291] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#134b73] transition"
                        >
                            Login
                        </button>

                        {/* Back to Home */}
                        <div className="mt-2 text-center">
                            <button
                                onClick={() => Inertia.get(route("landing"))}
                                className="text-[#134b73] hover:underline text-sm"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default LoginPage;
