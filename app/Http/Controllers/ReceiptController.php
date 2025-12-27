<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Barryvdh\DomPDF\Facade\Pdf;

class ReceiptController extends Controller
{
    public function download($invoice)
    {    $user = auth()->user();

        if (!in_array($user->role, ['admin', 'kasir'])) {
            abort(403, 'Unauthorized');
        }
        $transaction = Transaction::with('items')->where('invoice_number', $invoice)->firstOrFail();

        $pdf = Pdf::loadView('pdf.struk-transaksi', [
            'transaction' => $transaction,
        ])->setPaper([0, 0, 226.77, 600], 'portrait'); // ukuran struk thermal ± 80mm

        return $pdf->stream("struk-{$invoice}.pdf"); // atau ->download(...) untuk unduh otomatis
    }
}
