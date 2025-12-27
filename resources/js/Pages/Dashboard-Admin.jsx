import React, { useState } from "react";
import Sidebar from "../components/Sidebar"; // Impor Sidebar
import { Inertia } from "@inertiajs/inertia";
// import route from "ziggy-js";
import { usePage } from "@inertiajs/inertia-react";

import {
    Menu,
    Package,
    ShoppingCart,
    FileText,
    Users,
    LogOut,
    ChevronDown,
    AlertTriangle,
    Bell,
    Home,
    Plus,
    User,
    Calendar,
    Sun,
    Moon,
    TrendingUp,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Dashboard = ({ lowStockItems = [], expiringItems = [] }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState("dashboard");
    const [stockItems, setStockItems] = useState(lowStockItems || []);
    const [restockModal, setRestockModal] = useState({
        open: false,
        item: null,
    });
    const [restockAmount, setRestockAmount] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRestock = (item) => {
        setRestockModal({ open: true, item });
        setRestockAmount("");
    };

    const { props } = usePage();
    const loginSuccessMessage = props.loginSuccessMessage;
    if (loginSuccessMessage) {
        toast.success(loginSuccessMessage); // Notifikasi berhasil
    }

    const confirmRestock = () => {
        if (restockModal.item && restockAmount && !isProcessing) {
            setIsProcessing(true);

            // toast.success("Stok berhasil diperbarui!");
            Inertia.post(
                `/medications/${restockModal.item.id}/restock`,
                {
                    amount: parseInt(restockAmount),
                    _method: "post",
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setRestockModal({ open: false, item: null });
                        setRestockAmount("");
                        Inertia.reload({
                            only: ["lowStockItems", "expiringItems"],
                        });
                    },
                    onError: () => {
                        toast.error("Gagal memperbarui stok.");
                        console.error("Restock error:", errors);
                    },
                    onFinish: () => {
                        toast.success("Stok berhasil diperbarui!");
                        setIsProcessing(false);
                    },
                }
            );
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 11) return "Selamat Pagi";
        if (hour < 15) return "Selamat Siang";
        if (hour < 18) return "Selamat Sore";
        return "Selamat Malam";
    };

    const getCurrentDate = () => {
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return new Date().toLocaleDateString("id-ID", options);
    };

    const getGreetingIcon = () => {
        const hour = new Date().getHours();
        return hour >= 6 && hour < 18 ? Sun : Moon;
    };
    const calculateRemainingDays = (expiry) => {
        const today = new Date();
        const expiryDate = new Date(expiry);
        const diffTime = expiryDate - today;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return Math.floor(diffDays); // atau pakai Math.round
    };
    const enrichedExpiringItems = (expiringItems || []).map((item) => ({
        ...item,
        remainingDays: calculateRemainingDays(item.expiry),
    }));

    const currentLowStockItems = stockItems.filter(
        (item) => Number(item.stock) < Number(item.minStock)
    );
    console.table(stockItems); // Cek apakah stock dan minStock adalah string

    const currentExpiringItems = (expiringItems || [])
        .filter((item) => item.remainingDays <= 60)
        .sort((a, b) => b.remainingDays - a.remainingDays);

    const expiredItems = enrichedExpiringItems
        .filter((item) => item.remainingDays < 0)
        .sort((a, b) => a.remainingDays - b.remainingDays);

    const upcomingExpiringItems = enrichedExpiringItems
        .filter((item) => item.remainingDays >= 0 && item.remainingDays <= 60)
        .sort((a, b) => a.remainingDays - b.remainingDays);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
            />
            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top navigation */}
                <header className="bg-white shadow-sm border-b-2 border-[#1A6291]">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-800 font-bold">
                                Dashboard
                            </h1>{" "}
                        </div>

                        <div className="flex items-center">
                            <div className="flex items-center">
                                <div className="text-right">
                                    <div className="text-sm font-semibold text-gray-800">
                                        Administrator RajaPharma
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard content */}
                <main className="flex-1 overflow-y-auto p-4">
                    {/* Welcome Section */}
                    <div className="bg-gradient-to-br from-[#1A6291] via-[#2B7CB3] to-[#3A8CC7] rounded-2xl p-8 mb-8 text-white shadow-2xl relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-20 -translate-y-20"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full transform -translate-x-10 translate-y-10"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between flex-wrap">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center mb-3">
                                        {React.createElement(
                                            getGreetingIcon(),
                                            {
                                                className:
                                                    "mr-3 text-blue-200 animate-pulse",
                                                size: 28,
                                            }
                                        )}
                                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                                            {getGreeting()}, Administrator!
                                        </h2>
                                    </div>

                                    <p className="text-blue-100 text-lg mb-2 leading-relaxed">
                                        Selamat datang kembali di{" "}
                                        <span className="font-semibold text-white">
                                            RajaPharma
                                        </span>
                                    </p>

                                    <div className="flex items-center text-blue-200">
                                        <div className="flex items-center">
                                            <Calendar
                                                className="mr-2"
                                                size={18}
                                            />
                                            <span className="text-sm font-medium">
                                                {getCurrentDate()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

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
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="mb-4">
                                <h2 className="text-lg font-medium text-gray-800">
                                    Stok Menipis
                                </h2>
                            </div>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {currentLowStockItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-red-50 border-l-4 border-red-500 rounded"
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-800">
                                                {item.name}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Stok:{" "}
                                                <span className="font-medium text-red-600">
                                                    {item.stock}
                                                </span>{" "}
                                                / min {item.minStock}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRestock(item)}
                                            className="ml-3 group relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#1A6291] to-[#2B7CB3] rounded-lg hover:from-[#134b73] hover:to-[#246ba5] transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                                        >
                                            <TrendingUp
                                                size={14}
                                                className="mr-2 group-hover:animate-pulse"
                                            />
                                            <span>Restok</span>
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1A6291] to-[#2B7CB3] rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-200"></div>
                                        </button>
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
                                                    ( kadaluarsa{" "}
                                                    {Math.abs(
                                                        item.remainingDays
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
                                                        ( kadaluarsa{" "}
                                                        {item.remainingDays}{" "}
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

            {/* Enhanced Restock Modal */}
            {restockModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-200">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[#1A6291] to-[#2B7CB3] p-6 rounded-t-2xl">
                            <div className="flex items-center">
                                <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
                                    <TrendingUp
                                        className="text-white"
                                        size={24}
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-white">
                                    Restok Obat
                                </h3>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="mb-6">
                                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                    <p className="text-sm text-gray-600 mb-1">
                                        Nama Obat:
                                    </p>
                                    <p className="font-semibold text-gray-800 text-lg">
                                        {restockModal.item?.name}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                                        <p className="text-xs text-red-600 mb-1">
                                            Stok Saat Ini
                                        </p>
                                        <p className="font-bold text-red-700 text-xl">
                                            {restockModal.item?.stock}
                                        </p>
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                        <p className="text-xs text-blue-600 mb-1">
                                            Minimum Stok
                                        </p>
                                        <p className="font-bold text-blue-700 text-xl">
                                            {restockModal.item?.minStock}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jumlah Tambahan Stok:
                                </label>
                                <input
                                    type="number"
                                    value={restockAmount}
                                    onChange={(e) =>
                                        setRestockAmount(e.target.value)
                                    }
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A6291] focus:border-transparent transition-colors text-lg"
                                    placeholder="Masukkan jumlah..."
                                    min="1"
                                />
                                {restockAmount && (
                                    <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
                                        <p className="text-sm text-green-700">
                                            Stok setelah restok:{" "}
                                            <span className="font-bold">
                                                {Number(
                                                    restockModal.item?.stock
                                                ) +
                                                    parseInt(
                                                        restockAmount || 0
                                                    )}
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() =>
                                        setRestockModal({
                                            open: false,
                                            item: null,
                                        })
                                    }
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={confirmRestock}
                                    disabled={
                                        !restockAmount ||
                                        parseInt(restockAmount) <= 0 ||
                                        isProcessing
                                    }
                                    className={`flex-1 px-6 py-3 rounded-lg transition-all font-medium shadow-lg
    ${
        isProcessing
            ? "bg-gray-300 cursor-not-allowed text-gray-600"
            : "bg-gradient-to-r from-[#1A6291] to-[#2B7CB3] text-white hover:from-[#134b73] hover:to-[#246ba5] hover:scale-105"
    }`}
                                >
                                    {isProcessing
                                        ? "Memproses..."
                                        : "Konfirmasi Restok"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* <ToastContainer position="top-right" autoClose={5000} /> */}
        </div>
    );
};

export default Dashboard;
