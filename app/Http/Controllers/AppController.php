<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Obat;

class AppController extends Controller
{
    public function landing() {
        return Inertia::render('LandingPage');
    }

    public function login() {
        return Inertia::render('LoginPage');
    }

    public function dashboard_kasir() {
        return Inertia::render('Dashboard-Kasir');
    }

    public function dashboard_admin() {
        return Inertia::render('Dashboard-Admin');
    }

    public function report_admin() {
        return Inertia::render('Report-Admin');
    }

    public function stock_management()
{
    $medications = Obat::all()->map(function ($obat) {
        return [
            'id' => $obat->id,
            'name' => $obat->nama_obat,
            'category' => $obat->kategori,
            'stock' => $obat->stok,
            'minStock' => $obat->stok_minimum,
            'price' => $obat->harga,
            'expiryDate' => $obat->tanggal_kedaluwarsa,
            'supplier' => $obat->supplier,
        ];
    });

    return Inertia::render('StockManagement', [
        'medications' => $medications,
    ]);
}

    public function user_management() {
        return Inertia::render('UserManagement');
    }

    public function sales () {
        return Inertia::render('Sales-Kasir');
    }
    public function index()
{
    // Ambil semua data obat dari database
    $medications = Obat::all(); // Pastikan 'Obat' adalah nama model yang benar

    // Kembalikan halaman StockManagement dengan data obat
    return Inertia::render('StockManagement', [
        'medications' => $medications
    ]);
}

}
