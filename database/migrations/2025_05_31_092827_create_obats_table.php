<?php

// database/migrations/xxxx_xx_xx_xxxxxx_create_obats_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateObatsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('obats', function (Blueprint $table) {
            $table->id();  // Kolom ID (auto increment)
            $table->string('nama_obat');  // Nama Obat
            $table->string('kategori');  // Kategori Obat
            $table->integer('stok');  // Stok Obat
            $table->integer('stok_minimum');  // Stok Minimum
            $table->decimal('harga', 10, 2);  // Harga Obat
            $table->date('tanggal_kedaluwarsa');  // Tanggal Kedaluwarsa
            $table->string('supplier');  // Supplier Obat
            $table->timestamps();  // Timestamp untuk created_at dan updated_at
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('obats');
    }
}