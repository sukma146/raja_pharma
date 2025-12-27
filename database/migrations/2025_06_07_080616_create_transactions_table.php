<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number');  // Nomor invoice
            $table->decimal('total_amount', 15, 2);  // Total jumlah yang harus dibayar
            $table->decimal('cash', 15, 2);  // Jumlah uang yang dibayarkan
            $table->decimal('change', 15, 2);  // Uang kembalian
            $table->timestamps();
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
