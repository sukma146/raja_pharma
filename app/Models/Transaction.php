<?php
// app/Models/Transaction.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = ['invoice_number', 'cash', 'change', 'total_amount', 'user_id', 'created_at'];

    // Relasi dengan TransactionItem
    public function items()
    {
        return $this->hasMany(TransactionItem::class);
    }

    // Relasi dengan User (Kasir)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
