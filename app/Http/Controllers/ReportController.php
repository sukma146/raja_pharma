<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
{
    $transactions = Transaction::with(['items', 'user'])->latest()->get();

    return Inertia::render('Report-Admin', [
        'transactions' => $transactions->map(function ($t) {
            return [
                'id' => $t->invoice_number,
                'date' => $t->created_at->format('d/m/Y, H:i'),
                'cashier' => $t->user->name ?? 'Kasir',
                'items' => $t->items->map(fn ($item) => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'price' => $item->price,
                    'quantity' => $item->quantity,
                ]),
                'total' => $t->total_amount, // ⬅️ pastikan ini tidak null di DB
                
            ];
        }),
    ]);

    }
}
