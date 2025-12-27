import React from "react";
import logo from "../assets/logo1.png";
import medicine from "../assets/medicine1.png";
import { Inertia } from "@inertiajs/inertia";

// Logo component
const Logo = () => (
    <img src={logo} alt="RajaPharma Logo" className="h-24 mx-auto md:mx-10" />
);

// Landing Page Component
const LandingPage = ({ onNavigateToLogin }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <div className="w-full flex flex-col md:flex-row">
                {/* Left content */}
                <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
                    {/* <div className="mb-4">
                        <Logo />
                    </div> */}

                    <div>
                        <h1 className="text-5xl font-bold text-[#1A6291] ml-8">
                            RAJAPHARMA
                        </h1>

                        <p className="text-lg text-gray-800 ml-8 mb-4">
                            <br />
                            Ayo beralih ke Rajapharma dan jadikan
                            <br />
                            manajemen apotik Anda lebih gesit! 🚀
                            <br />
                            <br />
                        </p>

                        <button
                            onClick={() => {
                                Inertia.get(route("login"));
                            }}
                            className="bg-[#1A6291] text-white font-medium py-3 px-10 rounded-md shadow-md hover:bg-[#134b73] transition w-32 ml-8"
                        >
                            Login
                        </button>
                    </div>
                </div>

                {/* Right content with decorative image */}
                <div className="w-full md:w-1/2 relative bg-gray-50 overflow-hidden">
                    <div className="absolute inset-0 bg-blue-50 rounded-l-full opacity-80"></div>

                    {/* Medical bottles illustration */}
                    <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                        <img src={medicine} alt="Medical product" />
                    </div>

                    {/* Plus sign decorations */}
                    <div className="absolute top-32 left-24 text-blue-200 text-6xl font-thin">
                        +
                    </div>
                    <div className="absolute bottom-20 left-16 text-blue-200 text-6xl font-thin">
                        +
                    </div>
                    <div className="absolute top-1/2 right-1/3 text-blue-200 text-6xl font-thin">
                        +
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
