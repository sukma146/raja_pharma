<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Obat;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function dashboard()
    {
        $lowStockItems = Obat::whereColumn('stok', '<', 'stok_minimum')->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->nama_obat,
                'stock' => $item->stok,
                'minStock' => $item->stok_minimum,
            ];
        });
    
        $expiringItems = Obat::all()->map(function ($item) {
            $remainingDays = Carbon::parse($item->tanggal_kedaluwarsa)->diffInDays(Carbon::now());
            return [
                'id' => $item->id,
                'name' => $item->nama_obat,
                'expiry' => Carbon::parse($item->tanggal_kedaluwarsa)->translatedFormat('d F Y'),
                'remainingDays' => $remainingDays,
            ];
        });
    
        return Inertia::render('Dashboard-Admin', [
            'lowStockItems' => $lowStockItems,
            'expiringItems' => $expiringItems,
            'flash' => session('message'),
            'user' => auth()->user()
        ]);
    }
}
