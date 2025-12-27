<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id',
        'product_id',
        'name',
        'kategori',
        'quantity',
        'price',
    ];
    


// app/Models/TransactionItem.php
public function transaction()
{
    return $this->belongsTo(Transaction::class);
}

public function product()
{
    return $this->belongsTo(Obat::class, 'product_id'); // Jika kolom foreign key di tabel ini adalah `product_id`
}

}