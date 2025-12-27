<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Penjualan</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #333; padding: 6px; text-align: left; }
    </style>
</head>
<body>
    <h2>Laporan Penjualan</h2>
    <p>Tanggal: {{ now()->format('d M Y H:i') }}</p>

    <table>
        <thead>
            <tr>
                <th>No Invoice</th>
                <th>Tanggal</th>
                <th>Item</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($transactions as $t)
            <tr>
                <td>{{ $t->invoice_number }}</td>
                <td>{{ $t->created_at->format('d/m/Y H:i') }}</td>
                <td>
                    @foreach($t->items as $item)
                        {{ $item->name }} (x{{ $item->quantity }})<br>
                    @endforeach
                </td>
                <td>Rp{{ number_format($t->total_amount, 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
