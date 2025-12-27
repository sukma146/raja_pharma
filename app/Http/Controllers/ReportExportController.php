<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportExportController extends Controller
{
    public function download(Request $request)
{
    $start = $request->query('start');
    $end = $request->query('end');

    $transactions = Transaction::with('items')
        ->when($start, fn($q) => $q->whereDate('created_at', '>=', $start))
        ->when($end, fn($q) => $q->whereDate('created_at', '<=', $end))
        ->latest()
        ->get();

    // Format tanggal untuk nama file
    $filenameDate = '';
    if ($start && $end) {
        $filenameDate = date('Ymd', strtotime($start)) . '-' . date('Ymd', strtotime($end));
    } else {
        $filenameDate = now()->format('Ymd_His');
    }

    // Generate PDF
    $pdf = Pdf::loadView('pdf.laporan-penjualan', [
        'transactions' => $transactions,
        'tanggal' => ($start && $end)
            ? 'Periode: ' . date('d M Y', strtotime($start)) . ' s.d. ' . date('d M Y', strtotime($end))
            : 'Tanggal Cetak: ' . now()->format('d M Y H:i'),
    ]);

    return $pdf->download("laporan-penjualan-{$filenameDate}.pdf");
}

}
