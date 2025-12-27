import axios from "axios";
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// Ini wajib! Ambil CSRF token dari <meta name="csrf-token">
const token = document.querySelector('meta[name="csrf-token"]');
if (token) {
    axios.defaults.headers.common["X-CSRF-TOKEN"] = token.content;
} else {
    console.error("CSRF token tidak ditemukan di halaman.");
}
