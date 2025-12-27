import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import Sidebar from "../components/Sidebar"; // Impor Sidebar
import { Search, Plus, Filter, Edit, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Menampilkan data dari database
const StockManagement = ({ medications }) => {
    if (!Array.isArray(medications)) {
        return <div>Loading...</div>;
    }

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState("stock");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentMedication, setCurrentMedication] = useState(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [customCategory, setCustomCategory] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        stock: "",
        minStock: "",
        price: "",
        expiryDate: "",
        supplier: "",
    });

    // Pastikan medications ada dan bukan undefined atau null
    if (!medications) {
        return <div>Loading...</div>; // Menampilkan loading jika medications masih kosong
    }

    // Mengambil kategori unik dari medications
    const categories = [...new Set(medications.map((item) => item.category))];

    // Filter medications berdasarkan search term dan kategori
    const filteredMedications = medications
        .filter((medication) => {
            return (
                medication.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) &&
                (filterCategory === "" ||
                    medication.category === filterCategory)
            );
        })
        .sort((a, b) => {
            // First, sort by name alphabetically
            const nameComparison = a.name.localeCompare(b.name);
            if (nameComparison !== 0) {
                return nameComparison;
            }
            // If names are the same, sort by category
            return a.category.localeCompare(b.category);
        });

    const handleAddMedication = () => {
        setCurrentMedication(null);
        setFormData({
            name: "",
            category: "",
            stock: "",
            minStock: "",
            price: "",
            expiryDate: "",
            supplier: "",
        });
        setShowAddModal(true);
    };

    const handleEditMedication = (medication) => {
        setCurrentMedication(medication);
        setFormData({
            name: medication.name,
            category: medication.category,
            stock: Number(medication.stock).toFixed(0),
            minStock: Number(medication.minStock).toFixed(0),
            price: Number(medication.price).toFixed(0),
            expiryDate: medication.expiryDate,
            supplier: medication.supplier,
        });

        setShowAddModal(true);
    };

    const handleDeleteMedication = (medication) => {
        setCurrentMedication(medication);
        setShowConfirmDelete(true);
    };

    const confirmDelete = () => {
        if (currentMedication) {
            // Dismiss all previous notifications
            toast.dismiss();

            Inertia.delete(route("delete_medication", currentMedication.id), {
                onSuccess: () => {
                    console.log("Obat berhasil dihapus!");
                    toast.success("Obat berhasil dihapus!", {
                        onClose: () => {
                            console.log("Notification closed");
                        },
                        autoClose: 5000,
                    });
                    setShowConfirmDelete(false);
                    Inertia.reload();
                },
                onError: () => {
                    toast.error("Gagal menghapus obat.");
                },
            });
        }
    };

    const validateForm = () => {
        const errors = [];

        if (!formData.name.trim()) errors.push("Nama obat wajib diisi.");
        if (
            formData.category === "" ||
            (formData.category === "new" && !customCategory.trim())
        )
            errors.push("Kategori wajib diisi.");
        if (!formData.stock || isNaN(formData.stock) || formData.stock < 0)
            errors.push("Stok wajib diisi dengan angka >= 0.");
        if (
            !formData.minStock ||
            isNaN(formData.minStock) ||
            formData.minStock < 0
        )
            errors.push("Stok minimum wajib diisi dengan angka >= 0.");
        if (!formData.price || isNaN(formData.price) || formData.price < 0)
            errors.push("Harga wajib diisi dengan angka >= 0.");
        if (!formData.expiryDate)
            errors.push("Tanggal kedaluwarsa wajib diisi.");
        if (!formData.supplier.trim()) errors.push("Supplier wajib diisi.");

        return errors;
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Inside handleSubmit
    const handleSubmit = () => {
        const errors = validateForm();
        if (errors.length > 0) {
            errors.forEach((err) => toast.error(err));
            return;
        }

        setIsSubmitting(true);

        const medicationData = {
            name: formData.name.trim(),
            category:
                formData.category === "new"
                    ? customCategory.trim()
                    : formData.category,
            stock: parseInt(formData.stock),
            minStock: parseInt(formData.minStock),
            price: parseInt(formData.price),
            expiryDate: formData.expiryDate,
            supplier: formData.supplier.trim(),
        };

        const method = currentMedication ? "put" : "post";
        const url = currentMedication
            ? route("update_medication", currentMedication.id)
            : route("add_medication");

        Inertia.post(
            url,
            {
                ...medicationData,
                _method: method,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.dismiss();
                    toast.success(
                        currentMedication
                            ? "Obat berhasil diperbarui!"
                            : "Obat diperbarui!",
                        {
                            autoClose: 3000, // in milliseconds
                            toastId: `update-${currentMedication?.id}`, // optional, to avoid duplicates
                        }
                    );

                    setTimeout(() => {
                        toast.dismiss();
                    }, 3000);

                    setShowAddModal(false);
                    setCurrentMedication(null);
                },
                onError: () => {
                    toast.error("Gagal menyimpan obat.");
                },
                onFinish: () => {
                    // the toast will be stay there if i didnt change something in the page,
                    // but with this, it will take 3s to close the modal
                    setIsSubmitting(false);
                },
            }
        );
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
            />

            {/* <ToastContainer position="top-right" /> */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm">
                    <div className="flex items-center justify-between p-4">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Manajemen Stok Obat
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

                <main className="flex-1 overflow-y-auto p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div className="relative w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Cari obat..."
                                className="pl-10 pr-4 py-2 w-full md:w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A6291]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search
                                className="absolute left-3 top-2.5 text-gray-400"
                                size={18}
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                            <div className="relative">
                                <select
                                    className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1A6291] w-full"
                                    value={filterCategory}
                                    onChange={(e) =>
                                        setFilterCategory(e.target.value)
                                    }
                                >
                                    <option value="">Semua Kategori</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                <Filter
                                    className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
                                    size={18}
                                />
                            </div>

                            <button
                                className="flex items-center justify-center bg-[#1A6291] text-white px-4 py-2 rounded-lg hover:bg-[#134b73] w-full md:w-auto"
                                onClick={handleAddMedication}
                                disabled={isSubmitting}
                            >
                                <Plus size={18} className="mr-2" />
                                Tambah Obat
                            </button>
                        </div>
                    </div>

                    {/* Medication table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nama Obat
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Kategori
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Stok
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Harga
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Kedaluwarsa
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Supplier
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredMedications.length > 0 ? (
                                        filteredMedications.map(
                                            (medication) => (
                                                <tr
                                                    key={medication.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {medication.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {medication.category}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {medication.stock}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        Rp{""}
                                                        {parseInt(
                                                            medication.price
                                                        ).toLocaleString(
                                                            "id-ID"
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {new Date(
                                                            medication.expiryDate
                                                        ).toLocaleDateString(
                                                            "id-ID"
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {medication.supplier}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <div className="flex justify-center space-x-1">
                                                            {/* Edit and Delete Buttons */}
                                                            <button
                                                                onClick={() =>
                                                                    handleEditMedication(
                                                                        medication
                                                                    )
                                                                }
                                                                className="p-2 text-[#1A6291] hover:text-[#134b73] hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Edit Obat"
                                                            >
                                                                <Edit
                                                                    size={16}
                                                                />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteMedication(
                                                                        medication
                                                                    )
                                                                }
                                                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Hapus Obat"
                                                            >
                                                                <Trash2
                                                                    size={16}
                                                                />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="text-center py-4 text-gray-500"
                                            >
                                                Tidak ada data obat yang sesuai
                                                dengan pencarian.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal for Add/Edit Medication */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">
                            {currentMedication
                                ? "Edit Obat"
                                : "Tambah Obat Baru"}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Obat
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A6291]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kategori
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFormData((prev) => ({
                                            ...prev,
                                            category: value,
                                        }));
                                        if (value === "Lainnya") {
                                            setCustomCategory(""); // Reset input custom jika sebelumnya pernah diisi
                                        }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A6291]"
                                >
                                    <option value="">Pilih Kategori</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                    <option value="new">
                                        + Tambah Kategori Baru
                                    </option>{" "}
                                    {/* ini value penting */}
                                </select>
                            </div>
                            {formData.category === "new" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kategori Baru
                                    </label>
                                    <input
                                        type="text"
                                        value={customCategory}
                                        onChange={(e) =>
                                            setCustomCategory(e.target.value)
                                        }
                                        placeholder="Tulis kategori baru"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A6291]"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Stok
                                    </label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A6291]"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Stok Minimum
                                    </label>
                                    <input
                                        type="number"
                                        name="minStock"
                                        value={formData.minStock}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A6291]"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Harga (Rp)
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleFormChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A6291]"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tanggal Kedaluwarsa
                                </label>
                                <input
                                    type="date"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleFormChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A6291]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Supplier
                                </label>
                                <input
                                    type="text"
                                    name="supplier"
                                    value={formData.supplier}
                                    onChange={handleFormChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A6291]"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 gap-3">
                            <button
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                onClick={() => setShowAddModal(false)}
                            >
                                Batal
                            </button>
                            <button
                                className={`px-4 py-2 rounded-md text-white ${
                                    isSubmitting
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-[#1A6291] hover:bg-[#134b73]"
                                }`}
                                disabled={isSubmitting}
                                onClick={handleSubmit}
                            >
                                {isSubmitting
                                    ? "Menyimpan..."
                                    : currentMedication
                                    ? "Simpan Perubahan"
                                    : "Tambah Obat"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showConfirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                        <h2 className="text-lg font-semibold mb-4 text-center text-gray-800">
                            Yakin ingin menghapus obat ini?
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

export default StockManagement;
