# Sistem Informasi Apotek Raja (RajaPharma)

Panduan instalasi dan deployment untuk **Sistem Informasi Apotek Raja** berbasis **React**, **Vite**, **Inertia.js**, dan **Laravel**.

---

## 📋 Daftar Isi

- [Prasyarat](#prasyarat)
- [Langkah Instalasi](#langkah-instalasi)
- [Pengujian](#pengujian)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## ⚙️ Prasyarat

Pastikan Anda telah menginstal:

- [Node.js](https://nodejs.org/) (versi 16 atau lebih baru)
- [PHP](https://www.php.net/downloads.php) (versi 8.0 atau lebih baru)
- [Composer](https://getcomposer.org/)
- [MySQL](https://dev.mysql.com/downloads/)

---

## 🚀 Langkah Instalasi

1. **Clone repositori proyek**
   ```bash
   git clone https://github.com/farhanhadrawi/RajaPharma.git
   cd RajaPharma
   ```

2. **Instal dependensi Laravel**
   ```bash
   composer install
   ```

3. **Salin dan edit file `.env`**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   - Sesuaikan konfigurasi Database anda di file `.env`:
     ```
     DB_DATABASE=rajapharma
     DB_USERNAME=root
     DB_PASSWORD=
     ```

4. **Migrasi dan Seeder database**
   ```bash
   php artisan migrate --seed
   ```

5. **Instal dependensi frontend**
   ```bash
   npm install
   ```

6. **Jalankan aplikasi**
   Buka dua terminal:
   - Backend:
     ```bash
     php artisan serve
     ```
   - Frontend:
     ```bash
     npm run dev
     ```

   Atau gunakan shortcut:
   ```bash
   npm run start
   ```

---

## 🧪 Pengujian

Buka browser di:

```
http://127.0.0.1:8000
```

Lakukan pengujian apakah fitur berjalan:
- Login (admin/kasir)
- Transaksi
- Manajemen stok
- Laporan PDF
- DLL

---

## 📦 Deployment

### 1. Build Frontend
```bash
npm run build
```

### 2. Deploy Laravel ke Server
- Upload semua file ke server
- Jalankan:
  ```bash
  composer install --optimize-autoloader --no-dev
  php artisan migrate --force
  php artisan config:cache
  php artisan route:cache
  php artisan view:cache
  ```

### 3. Deploy Frontend
- Salin folder `public/build` dari hasil `npm run build`
- Pastikan server web mengarah ke `public/`

---

## 🛠 Troubleshooting
- **Laravel di shared hosting tidak menampilkan halaman**:
  Pastikan root hosting diarahkan ke folder `/public` dari Laravel, bukan ke root proyek secara langsung.
  Bila tidak bisa, buat file `.htaccess` tambahan atau gunakan `index.php` sebagai redirecter manual.
  
- **Error: `vite-manifest.json` or `mix-manifest.json` not found**:
  File ini biasanya dihasilkan setelah menjalankan `npm run build`. Pastikan Anda telah menjalankan:

  ```bash
  npm run build
  ```

  Jika masih error:
  - Periksa apakah file `vite.config.js` dikonfigurasi dengan benar.
  - Pastikan direktori `public/build` atau `public/mix-manifest.json` tersedia dan tidak terhapus saat deploy.
  - Jalankan `npm install && npm run build` ulang dari awal.

- **Folder `public` tidak muncul atau tidak bisa diakses**: Pastikan Anda mengakses aplikasi melalui direktori `public`, terutama jika menggunakan Laravel di server. Jika Anda menggunakan Laravel Mix atau Vite, hasil build frontend juga harus tersedia di dalam folder `public/build`. Cek juga konfigurasi virtual host/web server agar `DocumentRoot` mengarah ke folder `public`.

- **CORS Error**: Periksa middleware CORS di Laravel
  
- **Gagal koneksi DB**: Cek `.env`, database, dan akses MySQL
  
- **Struk PDF error**: Pastikan `dompdf` sudah terinstall dan folder `storage` writeable

---


