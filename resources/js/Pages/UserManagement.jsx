import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar"; // Impor Sidebar
import { Inertia } from "@inertiajs/inertia";
import {
    Menu,
    Search,
    Users,
    Plus,
    Edit,
    Trash,
    Loader2,
    X,
    LogOut,
    Home,
    Package,
    FileText,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserManagement = ({ users = [], currentUserId }) => {
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [loading, setLoading] = useState(false);

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState("users");
    const [searchTerm, setSearchTerm] = useState("");
    const [showUserModal, setShowUserModal] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [userForm, setUserForm] = useState({
        id: null,
        name: "",
        username: "",
        password: "",
        role: "Kasir",
    });
    useEffect(() => {
        // console.log("searchTerm berubah menjadi:", searchTerm);
        if (showUserModal) setSearchTerm("");
    }, [searchTerm]);

    // Filter users based on search term
    useEffect(() => {
        // setiap kali users berubah (misal setelah reload), reset hasil filter
        const filtered = users.filter((user) => {
            return (
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.username
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                user.role.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
        setFilteredUsers(filtered);
    }, [users, searchTerm]);

    // Handle user form change
    const handleUserFormChange = (e) => {
        const { name, value } = e.target;
        setUserForm((prev) => ({ ...prev, [name]: value }));
    };

    // Save user
    const saveUser = () => {
        console.log("saveUser terpanggil", userForm);
        if (
            !userForm.name ||
            !userForm.username ||
            (!userForm.id && !userForm.password)
        ) {
            alert("Silakan lengkapi semua field");
            return;
        }

        const dataToSend = {
            name: userForm.name,
            username: userForm.username,
            role: userForm.role, // Pastikan role ada di sini
        };

        if (!userForm.id || userForm.password !== "") {
            dataToSend.password = userForm.password;
        }

        // Jika form ID ada, maka lakukan edit
        if (userForm.id) {
            Inertia.put(
                `/dashboard/admin/user-management/${userForm.id}`,
                dataToSend,
                {
                    onStart: () => setLoading(true),
                    onSuccess: () => {
                        toast.success("Pengguna berhasil diperbarui!");
                        setShowUserModal(false);
                        Inertia.reload({ only: ["users"] });
                    },
                    onError: () => {
                        toast.error("Gagal memperbarui pengguna.");
                    },
                    onFinish: () => setLoading(false),
                }
            );
        } else {
            // Jika tidak ada ID, maka tambah pengguna baru
            Inertia.post("/dashboard/admin/user-management", dataToSend, {
                onStart: () => setLoading(true),
                onSuccess: () => {
                    toast.success("Pengguna berhasil ditambahkan!");
                    setShowUserModal(false);
                    Inertia.reload({ only: ["users"] });
                },
                onError: () => {
                    toast.error("Gagal menambahkan pengguna.");
                },
                onFinish: () => setLoading(false),
            });
        }
    };

    // Edit user
    const editUser = (user) => {
        setUserForm({
            id: user.id,
            name: user.name,
            username: user.username,
            password: "",
            role: user.role,
        });
        setShowUserModal(true);
    };

    // Delete user
    const deleteUser = (user) => {
        setSelectedUser(user);
        setShowConfirmDelete(true);
    };

    const confirmDelete = () => {
        if (selectedUser) {
            Inertia.delete(
                `/dashboard/admin/user-management/${selectedUser.id}`,
                {
                    onSuccess: () => {
                        toast.success("Pengguna berhasil dihapus!");
                        setShowConfirmDelete(false);
                    },
                    onError: () => {
                        toast.error("Gagal menghapus pengguna.");
                        setShowConfirmDelete(false);
                    },
                }
            );
        }
    };

    // Reset user form
    const resetUserForm = () => {
        setUserForm({
            id: null,
            name: "",
            username: "",
            password: "",
            role: "Kasir",
        });
    };

    useEffect(() => {
        // Mengupdate status pengguna berdasarkan status di database
        const updatedUsers = users.map((user) => {
            return {
                ...user,
                status: user.status === "aktif" ? "Aktif" : "Offline", // Menggunakan status dari database
            };
        });

        setFilteredUsers(updatedUsers); // Update filteredUsers dengan status yang baru
    }, [users]); // Menjalankan setiap kali data users berubah

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
                <header className="bg-white shadow-sm">
                    <div className="flex items-center justify-between p-4">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Manajemen Pengguna
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
                </header>

                {/* Content */}
                <div className="flex-1 p-6 overflow-auto">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                        {/* Header Section */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-[#1A6291] rounded-lg">
                                        <Users
                                            size={24}
                                            className="text-white"
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">
                                            Daftar Pengguna
                                        </h2>
                                        <p className="text-gray-600">
                                            Total {filteredUsers.length}{" "}
                                            pengguna terdaftar
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
                                    <div className="relative">
                                        <Search
                                            size={20}
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Cari nama, username, atau role..."
                                            className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-[#1A6291] focus:border-transparent"
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                        />
                                    </div>

                                    <button
                                        className="px-6 py-3 bg-[#1A6291] text-white rounded-lg hover:bg-[#134b73] flex items-center justify-center font-medium transition-colors shadow-md"
                                        onClick={() => {
                                            setShowUserModal(true); // ⬅️ Baru tampilkan modal// ⬅️ Tampilkan modal
                                            setSearchTerm(""); // ⬅️ Reset pencarian dulu
                                            resetUserForm(); // ⬅️ Bersihkan form
                                        }}
                                    >
                                        <Plus size={20} className="mr-2" />
                                        Tambah Pengguna
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Users Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Nama Lengkap
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Username
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Role
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Login Terakhir
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredUsers.map((user, index) => (
                                        <tr
                                            key={user.id}
                                            className={`hover:bg-gray-50 transition-colors ${
                                                index % 2 === 0
                                                    ? "bg-white"
                                                    : "bg-gray-25"
                                            }`}
                                        >
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-[#1A6291]">
                                                    #
                                                    {user.id
                                                        .toString()
                                                        .padStart(3, "0")}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-900">
                                                    {user.name}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-700 font-medium">
                                                    @{user.username}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                        user.role === "Admin"
                                                            ? "bg-red-100 text-red-800 border border-red-200"
                                                            : "bg-green-100 text-green-800 border border-green-200"
                                                    }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-600">
                                                    {user.last_login
                                                        ? new Date(
                                                              user.last_login
                                                          ).toLocaleString(
                                                              "id-ID"
                                                          )
                                                        : "-"}
                                                </span>
                                            </td>

                                            {/* Menampilkan status berdasarkan status yang ada di database */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                        user.status === "Aktif"
                                                            ? "bg-green-100 text-green-800 border border-green-200"
                                                            : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                                    }`}
                                                >
                                                    {user.status === "Aktif"
                                                        ? "Aktif"
                                                        : "Offline"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center space-x-2">
                                                    <button
                                                        className="p-2 text-[#1A6291] hover:text-[#134b73] hover:bg-blue-50 rounded-lg transition-colors"
                                                        onClick={() =>
                                                            editUser(user)
                                                        }
                                                        title="Edit pengguna"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                                        onClick={() =>
                                                            deleteUser(user)
                                                        }
                                                        title="Hapus pengguna"
                                                    >
                                                        <Trash size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Empty State */}
                        {filteredUsers.length === 0 && (
                            <div className="text-center py-12">
                                <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                    <Users
                                        size={32}
                                        className="text-gray-400"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                    Tidak ada pengguna ditemukan
                                </h3>
                                <p className="text-gray-500">
                                    Coba ubah kata kunci pencarian atau tambah
                                    pengguna baru
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* User Modal */}
                {showUserModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            {userForm.id
                                                ? "Edit Pengguna"
                                                : "Tambah Pengguna Baru"}
                                        </h2>
                                        <p className="text-gray-600 mt-1">
                                            {userForm.id
                                                ? "Perbarui informasi pengguna"
                                                : "Masukkan data pengguna baru"}
                                        </p>
                                    </div>
                                    <button
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                        onClick={() => setShowUserModal(false)}
                                    >
                                        <X
                                            size={24}
                                            className="text-gray-500"
                                        />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-semibold">
                                            Nama Lengkap *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="px-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#1A6291] focus:border-transparent"
                                            value={userForm.name}
                                            onChange={handleUserFormChange}
                                            placeholder="Masukkan nama lengkap"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-2 font-semibold">
                                            Username *
                                        </label>
                                        <input
                                            type="text"
                                            name="username"
                                            className="px-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#1A6291] focus:border-transparent"
                                            value={userForm.username}
                                            onChange={handleUserFormChange}
                                            placeholder="Masukkan username"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-2 font-semibold">
                                            {userForm.id
                                                ? "Password (kosongkan jika tidak diubah)"
                                                : "Password *"}
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            className="px-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#1A6291] focus:border-transparent"
                                            value={userForm.password}
                                            onChange={handleUserFormChange}
                                            placeholder={
                                                userForm.id
                                                    ? "Kosongkan jika tidak diubah"
                                                    : "Masukkan password"
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-2 font-semibold">
                                            Role *
                                        </label>
                                        <select
                                            name="role"
                                            className="px-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#1A6291] focus:border-transparent"
                                            value={userForm.role}
                                            onChange={handleUserFormChange}
                                            disabled={userForm.id}
                                        >
                                            <option value="Admin">Admin</option>
                                            <option value="Kasir">Kasir</option>
                                        </select>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Admin memiliki akses penuh, Kasir
                                            hanya untuk transaksi
                                        </p>
                                    </div>
                                </div>

                                <div className="flex space-x-4 mt-8">
                                    <button
                                        className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                                        onClick={() => setShowUserModal(false)}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        className={`flex-1 py-3 rounded-lg font-semibold transition-colors shadow-md flex items-center justify-center
        ${
            loading
                ? "bg-[#134b73] cursor-not-allowed opacity-60"
                : "bg-[#1A6291] hover:bg-[#134b73] text-white"
        }`}
                                        onClick={saveUser}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                                Memproses...
                                            </>
                                        ) : userForm.id ? (
                                            "Simpan Perubahan"
                                        ) : (
                                            "Tambah Pengguna"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {showConfirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                        <h2 className="text-lg font-semibold mb-4 text-center text-gray-800">
                            Yakin ingin menghapus pengguna ini?
                        </h2>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                onClick={confirmDelete}
                            >
                                Ya, Hapus
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                onClick={() => setShowConfirmDelete(false)}
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
