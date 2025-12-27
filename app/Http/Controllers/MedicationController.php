<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Obat;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
class MedicationController extends Controller
{
    // Menampilkan semua data obat dan kirim ke React via Inertia
    public function index()
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

    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string',
        'category' => 'required|string',
        'stock' => 'required|integer',
        'minStock' => 'required|integer',
        'price' => 'required|numeric',
        'expiryDate' => 'required|date',
        'supplier' => 'required|string',
    ]);

    Obat::create([
        'nama_obat' => $validated['name'],
        'kategori' => $validated['category'],
        'stok' => $validated['stock'],
        'stok_minimum' => $validated['minStock'],
        'harga' => $validated['price'],
        'tanggal_kedaluwarsa' => $validated['expiryDate'],
        'supplier' => $validated['supplier'],
    ]);

    return redirect()->route('stock_management')->with('success', 'Obat berhasil ditambah');
}

public function update(Request $request, $id)
{
    $validated = $request->validate([
        'name' => 'required|string',
        'category' => 'required|string',
        'stock' => 'required|integer',
        'minStock' => 'required|integer',
        'price' => 'required|numeric',
        'expiryDate' => 'required|date',
        'supplier' => 'required|string',
    ]);

    $medication = Obat::findOrFail($id);
    $medication->update([
        'nama_obat' => $validated['name'],
        'kategori' => $validated['category'],
        'stok' => $validated['stock'],
        'stok_minimum' => $validated['minStock'],
        'harga' => $validated['price'],
        'tanggal_kedaluwarsa' => $validated['expiryDate'],
        'supplier' => $validated['supplier'],
    ]);

    return redirect()->route('stock_management')->with('success', 'Obat berhasil diupdate');
}

public function destroy($id)
{
    $medication = Obat::findOrFail($id);
    $medication->delete();

    return redirect()->route('stock_management')->with('success', 'Obat berhasil dihapus');
}


public function dashboard()
{
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

    return Inertia::render('Dashboard-Admin', [
        'lowStockItems' => $lowStockItems,
        'expiringItems' => $expiringItems,
    ]);
}
public function restock(Request $request, $id)
{
    $validated = $request->validate([
        'amount' => 'required|integer|min:1',
    ]);

    $obat = Obat::findOrFail($id);
    $obat->stok += $validated['amount'];
    $obat->save();

    return redirect()->route('dashboard_admin')->with('success', 'Stok berhasil diperbarui.');
}

}
