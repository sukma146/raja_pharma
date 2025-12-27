import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import { AlertTriangle, Bell, Package, Clock, User } from "lucide-react";
import Sidebar from "../components/Sidebar"; // Impor Sidebar

const DashboardKasir = ({ lowStockItems, expiringItems }) => {
    const calculateRemainingDays = (expiry) => {
        const today = new Date();
        const expiryDate = new Date(expiry);
        const diffTime = expiryDate - today;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return Math.floor(diffDays);
    };
    const enrichedExpiringItems = (expiringItems || []).map((item) => ({
        ...item,
        remainingDays: calculateRemainingDays(item.expiry),
    }));

    const parsedLowStockItems = (lowStockItems || []).map((item) => ({
        ...item,
        stock: Number(item.stock),
        minStock: Number(item.minStock),
    }));

    const currentLowStockItems = parsedLowStockItems.filter(
        (item) => item.stock < item.minStock
    );

    const currentExpiringItems = (expiringItems || [])
        .filter((item) => item.remainingDays <= 60)
        .sort((a, b) => b.remainingDays - a.remainingDays);
    const expiredItems = enrichedExpiringItems
        .filter((item) => item.remainingDays < 0)
        .sort((a, b) => a.remainingDays - b.remainingDays);

    const upcomingExpiringItems = enrichedExpiringItems
        .filter((item) => item.remainingDays >= 0 && item.remainingDays <= 60)
        .sort((a, b) => a.remainingDays - b.remainingDays);

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState("dashboard");
    // Get current time for greeting
    const currentHour = new Date().getHours();
    const getGreeting = () => {
        if (currentHour < 12) return "Selamat Pagi";
        if (currentHour < 17) return "Selamat Siang";
        if (currentHour < 19) return "Selamat Sore";
        return "Selamat Malam";
    };

    const getCurrentDate = () => {
        const today = new Date();
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return today.toLocaleDateString("id-ID", options);
    };
    const { props } = usePage();
    const loginSuccessMessage = props.loginSuccessMessage;

    if (loginSuccessMessage) {
        toast.success(loginSuccessMessage); // Notifikasi berhasil
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                role="kasir" // Ini penting!
            />
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-white shadow-sm z-10 border-b border-gray-200">
                    <div className="p-4 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Dashboard Kasir
                        </h1>
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <div className="text-right">
                                    <div className="text-sm font-semibold text-gray-800">
                                        Kasir RajaPharma
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {/* Welcome Section */}
                    <div className="bg-gradient-to-r from-[#1A6291] to-[#2B7CB3] rounded-xl p-6 mb-8 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center mb-2">
                                    <User
                                        className="mr-3 text-blue-200"
                                        size={24}
                                    />
                                    <h2 className="text-2xl font-bold">
                                        Hai, {getGreeting()}!
                                    </h2>
                                </div>
                                <p className="text-blue-100 text-lg mb-1">
                                    Selamat datang di RajaPharma, Anda masuk
                                    sebagai Kasir
                                </p>
                                <div className="flex items-center mt-4 text-blue-200">
                                    <Clock className="mr-2" size={16} />
                                    <span className="text-sm">
                                        {getCurrentDate()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {" "}
                        {/* Stok Menipis */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">
                                        Stok Menipis
                                    </p>
                                    <h3 className="text-2xl font-bold text-gray-800">
                                        {currentLowStockItems.length}
                                    </h3>
                                </div>
                                <div className="bg-orange-100 p-2 rounded-md">
                                    <Package
                                        className="text-orange-500"
                                        size={24}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Obat Kedaluwarsa */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">
                                        Obat Kadaluarsa
                                    </p>
                                    <h3 className="text-2xl font-bold text-gray-800">
                                        {expiredItems.length}
                                    </h3>
                                </div>
                                <div className="bg-red-100 p-2 rounded-md">
                                    <Bell className="text-red-500" size={24} />
                                </div>
                            </div>
                        </div>
                        {/* Akan Kadaluarsa */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">
                                        Akan Kadaluarsa (≤60 hari)
                                    </p>
                                    <h3 className="text-2xl font-bold text-gray-800">
                                        {upcomingExpiringItems.length}
                                    </h3>
                                </div>
                                <div className="bg-yellow-100 p-2 rounded-md">
                                    <AlertTriangle
                                        className="text-yellow-500"
                                        size={24}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Alerts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Low Stock Items */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <div className="mb-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Stok Menipis
                                    </h2>
                                    <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                        {currentLowStockItems.length} item
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    Item yang memerlukan restok segera
                                </p>
                            </div>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {currentLowStockItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 rounded-lg hover:shadow-sm transition-shadow"
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-800">
                                                {item.name}
                                            </div>
                                            <div className="text-sm text-gray-600 mt-1">
                                                Stok:{" "}
                                                <span className="font-semibold text-red-600">
                                                    {Number(item.stock)}
                                                </span>{" "}
                                                /
                                                <span className="text-gray-500">
                                                    minimum{" "}
                                                    {Number(item.minStock)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Expiring Soon */}
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="mb-4">
                                <h2 className="text-lg font-medium text-gray-800">
                                    Obat Kedaluwarsa
                                </h2>
                            </div>

                            {/* Sudah Kadaluarsa */}
                            <div className="mb-2">
                                <h3 className="text-sm font-semibold text-red-600 mb-2">
                                    Sudah Kadaluarsa
                                </h3>
                                <div className="space-y-3 max-h-48 overflow-y-auto">
                                    {expiredItems.length === 0 && (
                                        <p className="text-sm text-gray-500">
                                            Tidak ada obat yang sudah
                                            kadaluarsa.
                                        </p>
                                    )}
                                    {expiredItems.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-red-50 border-l-4 border-red-600 rounded"
                                        >
                                            <div>
                                                <div className="font-medium text-gray-800">
                                                    {item.name}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Kedaluwarsa:{" "}
                                                    <span className="font-medium text-red-600">
                                                        {item.expiry}
                                                    </span>{" "}
                                                    (kadaluarsa{" "}
                                                    {Math.abs(
                                                        Number(
                                                            item.remainingDays
                                                        )
                                                    )}{" "}
                                                    hari lalu)
                                                </div>
                                            </div>
                                            <div className="text-sm text-red-600 font-medium">
                                                Segera tarik
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Akan Kadaluarsa */}
                            <div className="mt-6">
                                <h3 className="text-sm font-semibold text-yellow-600 mb-2">
                                    Akan Kadaluarsa (≤ 60 hari)
                                </h3>
                                <div className="space-y-3 max-h-48 overflow-y-auto">
                                    {upcomingExpiringItems.length === 0 && (
                                        <p className="text-sm text-gray-500">
                                            Tidak ada obat yang mendekati
                                            kadaluarsa.
                                        </p>
                                    )}
                                    {upcomingExpiringItems.map(
                                        (item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded"
                                            >
                                                <div>
                                                    <div className="font-medium text-gray-800">
                                                        {item.name}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        Kedaluwarsa:{" "}
                                                        <span className="font-medium text-yellow-600">
                                                            {item.expiry}
                                                        </span>{" "}
                                                        (kadaluarsa{" "}
                                                        {Number(
                                                            item.remainingDays
                                                        )}{" "}
                                                        hari lagi)
                                                    </div>
                                                </div>
                                                <div className="text-sm text-yellow-600 font-medium">
                                                    Segera jual
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardKasir;
