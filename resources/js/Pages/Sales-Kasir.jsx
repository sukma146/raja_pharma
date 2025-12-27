import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import Sidebar from "../components/Sidebar"; // Impor Sidebar

import {
    Menu,
    Search,
    Package,
    ShoppingCart,
    FileText,
    Users,
    LogOut,
    ChevronDown,
    Plus,
    Minus,
    X,
    Printer,
    CreditCard,
    Filter,
    Calendar,
    Download,
    Eye,
    Edit,
    Trash,
} from "lucide-react";
import { usePage } from "@inertiajs/inertia-react";
// Mapping field dari backend Laravel ke field yang dipakai di frontend
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SalesPage = ({ products = [] }) => {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [mappedProducts, setMappedProducts] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState("penjualan");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [cart, setCart] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [cashAmount, setCashAmount] = useState("");
    const [showSummary, setShowSummary] = useState(false);
    const [transactionComplete, setTransactionComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [receipt, setReceipt] = useState({
        id: "",
        date: "",
        cashier: "", // Menambahkan properti cashier
        items: [],
        subtotal: 0,
        total: 0,
        cash: 0,
        change: 0,
    });

    console.log("Data produk dari Laravel (Inertia):", products);

    const { props } = usePage();
    useEffect(() => {
        if (props.receipt) {
            setReceipt(props.receipt);
            console.log(props.receipt);
            setShowSummary(true);
            setTransactionComplete(true);
        }
    }, [props.receipt]);

    useEffect(() => {
        // Mapping ulang saat products berubah
        const mapped = products.map((p) => ({
            id: p.id,
            name: p.nama_obat,
            category: p.kategori,
            stock: p.stok,
            price: p.harga ?? 0,
        }));
        setMappedProducts(mapped);
    }, [products]);

    // Filter berdasarkan pencarian dan kategori
    useEffect(() => {
        const filtered = mappedProducts.filter((product) => {
            const name = product.name || "";
            const category = product.category || "";
            return (
                name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (filterCategory === "" || category === filterCategory)
            );
        });
        setFilteredProducts(filtered);
    }, [searchTerm, filterCategory, mappedProducts]);

    // Mendefinisikan kategori produk
    const categories = filteredProducts.length
        ? [...new Set(filteredProducts.map((product) => product.category))]
        : [];

    // Total subtotal dan total dari keranjang belanja
    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const tax = 0;
    const total = subtotal + tax;

    // Tambah produk ke keranjang
    const addToCart = (product) => {
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
            // Mengecek apakah stok mencukupi untuk penambahan produk ke keranjang
            if (existingItem.quantity < product.stock) {
                const updatedCart = cart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
                setCart(updatedCart);
            } else {
                // Jika sudah mencapai stok maksimum, beri notifikasi atau tidak tambah
                toast.warning("Stok tidak mencukupi");
            }
        } else {
            // Mengecek jika stok mencukupi untuk produk pertama kali ditambahkan
            if (product.stock > 0) {
                setCart([...cart, { ...product, quantity: 1 }]);
            } else {
                toast.warning("Stok tidak mencukupi");
            }
        }
    };

    // Hapus produk dari keranjang
    const removeFromCart = (productId) => {
        setCart(cart.filter((item) => item.id !== productId));
    };

    // Update kuantitas produk di keranjang
    const updateQuantity = (productId, newQuantity) => {
        const product = cart.find((item) => item.id === productId);

        // Ensure the new quantity doesn't exceed stock or is negative
        if (newQuantity <= product.stock && newQuantity >= 1) {
            const updatedCart = cart.map((item) =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            );
            setCart(updatedCart);
        } else if (newQuantity > product.stock) {
            toast.warning("Jumlah yang diminta melebihi stok.");
        } else if (newQuantity < 1) {
            toast.warning("Jumlah tidak bisa kurang dari 1.");
        }
    };

    // Proses pembayaran dan kirim data transaksi ke backend
    const processPayment = () => {
        const cashValue = parseFloat(cashAmount || "0");

        if (isNaN(cashValue) || cashValue < total) {
            alert("Jumlah pembayaran tidak mencukupi");
            return;
        }

        setIsLoading(true); // Start loading

        const newReceipt = {
            items: cart.map((item) => ({
                id: item.id,
                quantity: item.quantity,
                price: item.price,
            })),
            total,
            cash: cashValue,
            change: cashValue - total,
            date: new Date().toLocaleString(),
        };

        // Save receipt to localStorage
        localStorage.setItem("transactionData", JSON.stringify(newReceipt));

        Inertia.post("/dashboard/kasir/sales", newReceipt, {
            onSuccess: (page) => {
                const receiptData = page.props.receipt;
                if (receiptData) {
                    setReceipt(receiptData);
                    setShowSummary(true);
                    setTransactionComplete(true);
                    setShowPaymentModal(false);
                    toast.success("Transaksi berhasil diproses!");
                    setIsLoading(false); // End loading
                }
            },
            onError: (errors) => {
                toast.error("Gagal memproses transaksi.");
                console.error(errors);
                setIsLoading(false); // End loading
            },
        });
    };
    useEffect(() => {
        const savedTransaction = localStorage.getItem("transactionData");
        if (savedTransaction) {
            const transactionData = JSON.parse(savedTransaction);
            setReceipt(transactionData);
            setShowSummary(true);
            setTransactionComplete(true);
        }
    }, []);

    // Memulai transaksi baru
    const startNewTransaction = () => {
        setCart([]);
        setCashAmount("");
        setShowSummary(false);
        setTransactionComplete(false);

        // Clear the saved transaction data from localStorage
        localStorage.removeItem("transactionData");
    };

    // Format uang
    const formatCurrency = (value) => {
        const number = Number(value); // konversi ke angka
        if (isNaN(number)) return "0";
        return number.toLocaleString("id-ID");
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeMenu={"sales"} // ✅ SESUAI DENGAN KASUS di Sidebar.jsx
                setActiveMenu={setActiveMenu}
                role="kasir"
            />
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-white shadow-sm z-10">
                    <div className="p-4 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Penjualan Obat
                        </h1>
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <div className="text-right">
                                    <div className="text-sm font-semibold text-gray-800">
                                        Kasir RajaPharma
                                        {/* Menampilkan nama kasir */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sales Content */}
                {showSummary ? (
                    <div className="flex-1 p-6 overflow-auto">
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Transaksi Berhasil
                                </h2>
                                <p className="text-green-600 font-semibold">
                                    Nomor Transaksi: {receipt.id}
                                </p>
                                <p className="text-gray-600">
                                    Kasir: {receipt.cashier}
                                </p>{" "}
                                <p className="text-gray-600">{receipt.date}</p>
                            </div>

                            <div className="border-t border-b py-4 my-4">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-gray-600">
                                            <th className="pb-2">Item</th>
                                            <th className="pb-2 text-right">
                                                Jumlah
                                            </th>
                                            <th className="pb-2 text-right">
                                                Harga
                                            </th>
                                            <th className="pb-2 text-right">
                                                Subtotal
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {receipt.items.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="border-b border-gray-100"
                                            >
                                                <td className="py-2">
                                                    {item.name}
                                                </td>
                                                <td className="py-2 text-right">
                                                    {item.quantity}
                                                </td>
                                                <td className="py-2 text-right">
                                                    Rp{""}
                                                    {formatCurrency(item.price)}
                                                </td>
                                                <td className="py-2 text-right">
                                                    Rp{""}
                                                    {formatCurrency(
                                                        item.price *
                                                            item.quantity
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="space-y-2 text-right">
                                <div className="flex justify-between">
                                    <span className="font-medium">Total:</span>
                                    <span className="font-bold">
                                        Rp{formatCurrency(receipt.total)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Tunai:</span>
                                    <span>
                                        Rp{formatCurrency(receipt.cash)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-green-600">
                                    <span className="font-medium">
                                        Kembalian:
                                    </span>
                                    <span className="font-bold">
                                        Rp{formatCurrency(receipt.change)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-center space-x-4">
                                <a
                                    href={`/receipt/${receipt.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-[#1A6291] text-white rounded hover:bg-[#134b73] flex items-center"
                                >
                                    <Printer size={18} className="mr-2" />
                                    Cetak Struk
                                </a>

                                <button
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    onClick={startNewTransaction}
                                >
                                    Transaksi Baru
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                        {/* Product List */}
                        <div className="w-full md:w-3/5 p-4 md:p-6 overflow-auto">
                            <div className="mb-6 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
                                <div className="relative flex-1">
                                    <Search
                                        size={20}
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Cari obat..."
                                        className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#1A6291]"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="relative w-full md:w-48">
                                    <select
                                        className="pl-4 pr-10 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1A6291] w-full bg-white"
                                        value={filterCategory}
                                        onChange={(e) =>
                                            setFilterCategory(e.target.value)
                                        }
                                    >
                                        <option value="">Semua Kategori</option>
                                        {categories.map((category) => (
                                            <option
                                                key={`cat-${category}`}
                                                value={category}
                                            >
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        size={20}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredProducts.map((product, index) => (
                                    <div
                                        key={`product-${product.id ?? index}`}
                                        className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 min-h-[140px] flex flex-col justify-between"
                                        onClick={() =>
                                            product.stock > 0 &&
                                            addToCart(product)
                                        }
                                    >
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1 pr-2">
                                                    <h3 className="font-medium text-gray-800 text-sm leading-tight">
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {product.category}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                                                        product.stock > 20
                                                            ? "bg-green-100 text-green-800"
                                                            : product.stock > 5
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    Stok: {product.stock}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mt-3">
                                            <span className="font-bold text-[#1A6291] text-sm">
                                                Rp{""}
                                                {formatCurrency(product.price)}
                                            </span>
                                            <button
                                                className={`px-2 py-1 rounded text-white text-sm ${
                                                    product.stock > 0
                                                        ? "bg-[#1A6291] hover:bg-[#134b73]"
                                                        : "bg-gray-400"
                                                }`}
                                                disabled={product.stock === 0}
                                            >
                                                Tambah
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cart */}
                        <div className="w-full md:w-2/5 bg-white border-t md:border-t-0 md:border-l border-gray-200 flex flex-col">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800">
                                    Keranjang Belanja
                                </h2>
                                <p className="text-gray-600">
                                    {cart.length} item
                                </p>
                            </div>

                            <div className="flex-1 overflow-auto p-6">
                                {cart.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                        <ShoppingCart
                                            size={48}
                                            strokeWidth={1}
                                        />
                                        <p className="mt-2">Keranjang kosong</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {cart.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-sm">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        Rp{""}
                                                        {formatCurrency(
                                                            item.price
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity -
                                                                    1
                                                            );
                                                        }}
                                                    >
                                                        <Minus size={16} />
                                                    </button>

                                                    {/* Editable quantity */}
                                                    <input
                                                        type="text"
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            // Allow the user to type in any number or clear the input
                                                            const newQuantity =
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                    10
                                                                );
                                                            if (
                                                                !isNaN(
                                                                    newQuantity
                                                                ) &&
                                                                newQuantity >= 0
                                                            ) {
                                                                updateQuantity(
                                                                    item.id,
                                                                    newQuantity
                                                                );
                                                            }
                                                        }}
                                                        onFocus={(e) =>
                                                            e.target.select()
                                                        } // Optional: Select the text when input is focused
                                                        className="w-10 text-center border rounded-md"
                                                        min="0"
                                                        max={item.stock}
                                                    />

                                                    <button
                                                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity +
                                                                    1
                                                            );
                                                        }}
                                                    >
                                                        <Plus size={16} />
                                                    </button>

                                                    <button
                                                        className="p-1 ml-2 rounded-full text-red-500 hover:bg-red-100"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeFromCart(
                                                                item.id
                                                            );
                                                        }}
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-gray-200">
                                <div className="mb-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Subtotal
                                        </span>
                                        <span>
                                            Rp{formatCurrency(subtotal)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>Rp{formatCurrency(total)}</span>
                                    </div>
                                </div>

                                <button
                                    className="w-full py-3 bg-[#1A6291] text-white rounded-lg font-medium hover:bg-[#134b73] disabled:bg-gray-400"
                                    disabled={cart.length === 0}
                                    onClick={() => setShowPaymentModal(true)}
                                >
                                    Bayar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                Pembayaran
                            </h2>
                            <button
                                className="p-1 rounded-full hover:bg-gray-200"
                                onClick={() => setShowPaymentModal(false)}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">
                                    Total Pembayaran
                                </span>
                                <span className="font-bold text-lg">
                                    Rp{formatCurrency(total)}
                                </span>
                            </div>

                            <div className="mt-4">
                                <label className="block text-gray-700 mb-2">
                                    Jumlah Tunai
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        Rp
                                    </span>
                                    <input
                                        type="text"
                                        className="pl-10 pr-4 py-3 border rounded-lg w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={cashAmount}
                                        onChange={(e) => {
                                            // Only allow numbers
                                            const value =
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                );
                                            setCashAmount(value);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mt-3">
                                {[
                                    10000, 20000, 50000, 100000, 200000, 500000,
                                ].map((amount) => (
                                    <button
                                        key={amount}
                                        className="py-2 border rounded-lg hover:bg-gray-50"
                                        onClick={() =>
                                            setCashAmount(amount.toString())
                                        }
                                    >
                                        Rp{formatCurrency(amount)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                className="flex-1 py-3 bg-gray-200 rounded-lg font-medium hover:bg-gray-300"
                                onClick={() => setShowPaymentModal(false)}
                            >
                                Batal
                            </button>
                            <button
                                className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center justify-center"
                                onClick={processPayment} // Call the payment processing function
                                disabled={isLoading} // Disable the button while loading
                            >
                                {isLoading ? (
                                    <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div> // Loading spinner
                                ) : (
                                    <>
                                        <CreditCard
                                            size={20}
                                            className="mr-2"
                                        />
                                        Proses Pembayaran
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesPage;
