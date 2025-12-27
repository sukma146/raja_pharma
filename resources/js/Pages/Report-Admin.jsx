import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar"; // Impor Sidebar
import {
    Menu,
    Package,
    FileText,
    Users,
    LogOut,
    Calendar,
    Download,
    Eye,
    Printer,
    X,
    Home,
    CreditCard,
} from "lucide-react";
import { usePage } from "@inertiajs/inertia-react";

import { Inertia } from "@inertiajs/inertia";

const ReportAdmin = () => {
    const { transactions = [] } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState("reports");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [filteredTransactions, setFilteredTransactions] =
        useState(transactions);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showTransactionDetail, setShowTransactionDetail] = useState(false);

    // Filter transactions based on date range
    useEffect(() => {
        if (!dateRange.start && !dateRange.end) {
            setFilteredTransactions(transactions);
            return;
        }

        const startDate = dateRange.start
            ? new Date(dateRange.start)
            : new Date(0);
        const endDate = dateRange.end ? new Date(dateRange.end) : new Date();
        endDate.setHours(23, 59, 59, 999);

        const filtered = transactions.filter((transaction) => {
            const transactionDate = new Date(
                transaction.date.split(", ")[0].split("/").reverse().join("-")
            );
            return transactionDate >= startDate && transactionDate <= endDate;
        });

        setFilteredTransactions(filtered);
    }, [dateRange, transactions]);

    // Calculate sales summary
    const getSalesSummary = () => {
        const totalSales = filteredTransactions.reduce((sum, transaction) => {
            const totalValue = parseFloat(transaction.total);
            return sum + (isNaN(totalValue) ? 0 : totalValue);
        }, 0);

        const totalItems = filteredTransactions.reduce((sum, transaction) => {
            if (!Array.isArray(transaction.items)) return sum; // Pastikan items adalah array

            return (
                sum +
                transaction.items.reduce((itemSum, item) => {
                    const quantity = Number(item.quantity) || 0;
                    console.log(`Item: ${item.name}, Quantity: ${quantity}`); // Cek nilai quantity
                    return itemSum + quantity;
                }, 0)
            );
        }, 0);
        console.log("Total Items:", totalItems); // Cek hasil totalItems

        return {
            totalTransactions: filteredTransactions.length,
            totalSales,
            totalItems,
        };
    };

    // View transaction detail
    const viewTransactionDetail = (transaction) => {
        setSelectedTransaction(transaction);
        setShowTransactionDetail(true);
    };

    // Print transaction receipt
    const printTransactionReceipt = (transaction) => {
        window.open(`/receipt/${transaction.id}`, "_blank");
    };

    // Reprint transaction
    const reprintTransaction = (transaction) => {
        alert(`Mencetak ulang transaksi ${transaction.id}`);
    };

    // Format currency
    const formatCurrency = (value) => {
        const number = Number(value); // konversi ke angka
        if (isNaN(number)) return "0";
        return number.toLocaleString("id-ID");
    };
    // Generate PDF
    const generatePDF = () => {
        const params = new URLSearchParams();
        if (dateRange.start) params.append("start", dateRange.start);
        if (dateRange.end) params.append("end", dateRange.end);

        window.open(`/admin/report/pdf?${params.toString()}`, "_blank");
    };

    // Get page title based on active menu
    const getPageTitle = () => {
        switch (activeMenu) {
            case "dashboard":
                return "Dashboard";
            case "stock":
                return "Stok Obat";
            case "reports":
                return "Laporan Penjualan";
            case "users":
                return "Manajemen Pengguna";
            default:
                return "Laporan Penjualan";
        }
    };

    // Get category for item
    const getItemCategory = (itemName) => {
        if (!itemName) return "Tidak diketahui";

        if (itemName.includes("Vitamin")) return "Vitamin";
        if (
            itemName.includes("Paracetamol") ||
            itemName.includes("Ibuprofen") ||
            itemName.includes("Cetirizine")
        )
            return "Analgesik";
        if (itemName.includes("Amoxicillin")) return "Antibiotik";
        if (itemName.includes("Sirup") || itemName.includes("Inhaler"))
            return "Obat Batuk";
        if (itemName.includes("Amlodipine") || itemName.includes("Metformin"))
            return "Obat Kronis";

        return "Obat";
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-white shadow-sm z-10">
                    <div className="p-4 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Laporan Penjualan
                        </h1>
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
                </div>

                {/* Content based on active menu */}
                {activeMenu === "reports" && (
                    <div className="flex-1 p-6 overflow-auto">
                        {/* Date Range Filter */}
                        <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Filter Laporan
                            </h3>
                            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between space-y-4 lg:space-y-0 lg:space-x-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-2">
                                            Tanggal Mulai
                                        </label>
                                        <div className="relative">
                                            <Calendar
                                                size={18}
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                            />
                                            <input
                                                type="date"
                                                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
                                                value={dateRange.start}
                                                onChange={(e) =>
                                                    setDateRange((prev) => ({
                                                        ...prev,
                                                        start: e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-end">
                                        <span className="text-gray-500 font-medium mb-3 px-2">
                                            sampai
                                        </span>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-2">
                                            Tanggal Akhir
                                        </label>
                                        <div className="relative">
                                            <Calendar
                                                size={18}
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                            />
                                            <input
                                                type="date"
                                                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
                                                value={dateRange.end}
                                                onChange={(e) =>
                                                    setDateRange((prev) => ({
                                                        ...prev,
                                                        end: e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center font-medium shadow-sm"
                                    onClick={generatePDF}
                                >
                                    <Download size={18} className="mr-2" />
                                    Unduh PDF
                                </button>
                            </div>
                        </div>

                        {/* Sales Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center">
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <FileText
                                            size={24}
                                            className="text-blue-600"
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">
                                            Total Transaksi
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {
                                                getSalesSummary()
                                                    .totalTransactions
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center">
                                    <div className="p-3 bg-green-100 rounded-full">
                                        <CreditCard
                                            size={24}
                                            className="text-green-600"
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">
                                            Total Penjualan
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            Rp{""}
                                            {formatCurrency(
                                                getSalesSummary().totalSales
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center">
                                    <div className="p-3 bg-purple-100 rounded-full">
                                        <Package
                                            size={24}
                                            className="text-purple-600"
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">
                                            Total Item Terjual
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {getSalesSummary().totalItems}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transactions Table */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Riwayat Transaksi
                                </h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                No. Invoice
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tanggal & Waktu
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Kasir
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Item
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredTransactions.map(
                                            (transaction) => (
                                                <tr
                                                    key={transaction.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-medium text-gray-900">
                                                            {transaction.id}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                                        {transaction.date}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {transaction.cashier}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {
                                                            transaction.items
                                                                .length
                                                        }{" "}
                                                        item
                                                        <span className="text-gray-500 text-sm ml-1">
                                                            (
                                                            {transaction.items
                                                                .map(
                                                                    (item) =>
                                                                        item.name
                                                                )
                                                                .join(", ")
                                                                .substring(
                                                                    0,
                                                                    30
                                                                )}
                                                            {transaction.items
                                                                .map(
                                                                    (item) =>
                                                                        item.name
                                                                )
                                                                .join(", ")
                                                                .length > 30
                                                                ? "..."
                                                                : ""}
                                                            )
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-gray-900">
                                                            Rp{""}
                                                            {formatCurrency(
                                                                transaction.total
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                className="text-blue-600 hover:text-blue-900"
                                                                onClick={() =>
                                                                    viewTransactionDetail(
                                                                        transaction
                                                                    )
                                                                }
                                                                title="Lihat Detail"
                                                            >
                                                                <Eye
                                                                    size={16}
                                                                />
                                                            </button>
                                                            <button
                                                                className="text-green-600 hover:text-green-900"
                                                                onClick={() =>
                                                                    printTransactionReceipt(
                                                                        transaction
                                                                    )
                                                                }
                                                                title="Cetak Struk"
                                                            >
                                                                <Printer
                                                                    size={16}
                                                                />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {filteredTransactions.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    Tidak ada transaksi untuk periode yang
                                    dipilih
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Placeholder for other menu sections */}
                {activeMenu !== "reports" && (
                    <div className="flex-1 p-6 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <div className="text-6xl mb-4">🚧</div>
                            <h2 className="text-xl font-medium mb-2">
                                Halaman {getPageTitle()} Sedang Dikembangkan
                            </h2>
                            <p>Fitur ini akan segera tersedia</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Transaction Detail Modal */}
            {showTransactionDetail && selectedTransaction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl">
                        {/* Modal Header - Fixed */}
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex-shrink-0">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-900">
                                    Detail Transaksi {selectedTransaction.id}
                                </h3>
                                <button
                                    className="text-gray-400 hover:text-gray-600 p-1"
                                    onClick={() =>
                                        setShowTransactionDetail(false)
                                    }
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-6">
                                {/* Transaction Info */}
                                <div className="mb-6">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600 font-medium">
                                                Tanggal & Waktu
                                            </span>
                                            <p className="text-gray-900 font-semibold mt-2">
                                                {selectedTransaction.date}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600 font-medium">
                                                Kasir
                                            </span>
                                            <p className="text-gray-900 font-semibold mt-2">
                                                {selectedTransaction.cashier}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Items Table */}
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                        Daftar Produk
                                    </h4>
                                    <div className="overflow-hidden border border-gray-200 rounded-lg">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm min-w-full">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
                                                            Produk
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
                                                            Kategori
                                                        </th>
                                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
                                                            Harga
                                                        </th>
                                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
                                                            Jumlah
                                                        </th>
                                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
                                                            Subtotal
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {selectedTransaction.items.map(
                                                        (item) => (
                                                            <tr
                                                                key={item.id}
                                                                className="hover:bg-gray-50"
                                                            >
                                                                <td className="px-4 py-4 text-gray-900 font-medium">
                                                                    <div className="max-w-xs">
                                                                        <p className="font-medium text-gray-900 break-words">
                                                                            {
                                                                                item.name
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                        {getItemCategory(
                                                                            item.name
                                                                        )}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-4 text-right text-gray-900 whitespace-nowrap">
                                                                    Rp
                                                                    {formatCurrency(
                                                                        item.price
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-4 text-right text-gray-900 whitespace-nowrap">
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </td>
                                                                <td className="px-4 py-4 text-right text-gray-900 font-medium whitespace-nowrap">
                                                                    Rp
                                                                    {formatCurrency(
                                                                        item.price *
                                                                            item.quantity
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Summary Section */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                        Ringkasan Transaksi
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Jumlah Item</span>
                                            <span>
                                                {selectedTransaction.items.reduce(
                                                    (sum, item) =>
                                                        sum +
                                                        (Number(
                                                            item.quantity
                                                        ) || 0), // Pastikan item.quantity menjadi angka
                                                    0
                                                )}{" "}
                                                item
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Jenis Produk</span>
                                            <span>
                                                {
                                                    selectedTransaction.items
                                                        .length
                                                }{" "}
                                                produk
                                            </span>
                                        </div>
                                        <hr className="border-gray-200" />
                                        <div className="flex justify-between text-lg font-bold text-gray-900">
                                            <span>Total Harga</span>
                                            <span>
                                                Rp
                                                {formatCurrency(
                                                    selectedTransaction.total
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer - Fixed */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex-shrink-0">
                            <div className="flex justify-end">
                                <button
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    onClick={() =>
                                        setShowTransactionDetail(false)
                                    }
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportAdmin;
