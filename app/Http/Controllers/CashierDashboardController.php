<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Obat;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\User;
class CashierDashboardController extends Controller
{
    // Menampilkan dashboard kasir
    public function dashboard()
{
    $cashier = auth()->user()->username;
    $lowStockItems = Obat::whereColumn('stok', '<', 'stok_minimum')
        ->select('id', 'nama_obat', 'stok', 'stok_minimum')
        ->get()
        ->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->nama_obat,
                'stock' => $item->stok,
                'minStock' => $item->stok_minimum,
            ];
        });

    $expiringItems = Obat::where('tanggal_kedaluwarsa', '<=', now()->addDays(60))
        ->select('id', 'nama_obat', 'tanggal_kedaluwarsa')
        ->get()
        ->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->nama_obat,
                'expiry' => \Carbon\Carbon::parse($item->tanggal_kedaluwarsa)->translatedFormat('d F Y'),
                'remainingDays' => \Carbon\Carbon::parse($item->tanggal_kedaluwarsa)->diffInDays(now()),
            ];
        });

    return Inertia::render('DashboardKasir', [
        'lowStockItems' => $lowStockItems,
        'expiringItems' => $expiringItems,
    ]);
}


}
