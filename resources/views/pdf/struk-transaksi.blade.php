<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { 
            font-family: sans-serif; 
            font-size: 12px; 
            width: 250px; 
            margin: 0 auto; 
            text-align: center; 
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
        }
        td, th { 
            padding: 4px; 
            font-size: 12px; 
            text-align: left; 
        }
        hr { 
            border: 1px dashed #000; 
            margin: 5px 0; 
        }
        .center { 
            text-align: center; 
        }
        .line { 
            border-top: 1px dashed #000; 
            margin: 10px 0; 
        }
        .total { 
            font-weight: bold; 
        }
    </style>
</head>
<body>
    <div>
        <h2>Struk Pembelian</h2>
        <p>No. Invoice: <strong>{{ $transaction->invoice_number }}</strong></p>
        <p>Tanggal: <strong>{{ $transaction->created_at->format('d/m/Y H:i') }}</strong></p>

        <div class="line"></div>

        <table>
            <thead>
                <tr>
                    <th>Produk</th>
                    <th>Qty</th>
                    <th>Harga</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($transaction->items as $item)
                    <tr>
                        <td>{{ $item->name }}</td>
                        <td>x{{ $item->quantity }}</td>
                        <td>Rp{{ number_format($item->price, 0, ',', '.') }}</td> <!-- Hapus spasi setelah Rp -->
                        <td>Rp{{ number_format($item->price * $item->quantity, 0, ',', '.') }}</td> <!-- Hapus spasi setelah Rp -->
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div class="line"></div>

        <p class="total"><strong>Total:</strong> Rp{{ number_format($transaction->total_amount, 0, ',', '.') }}</p> <!-- Hapus spasi setelah Rp -->
        <p class="total"><strong>Tunai:</strong> Rp{{ number_format($transaction->cash, 0, ',', '.') }}</p> <!-- Hapus spasi setelah Rp -->
        <p class="total"><strong>Kembali:</strong> Rp{{ number_format($transaction->change, 0, ',', '.') }}</p> <!-- Hapus spasi setelah Rp -->

        <div class="line"></div>

        <p>------</p>
        <p>Terima Kasih!</p>
    </div>
</body>
</html>
