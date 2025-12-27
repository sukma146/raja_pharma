<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();  // Kolom ID, yang otomatis menjadi primary key
            $table->string('name');  // Kolom untuk nama pengguna
            $table->string('username')->unique();  // Kolom untuk username yang unik
            $table->string('email')->nullable()->unique();  // Kolom untuk email (opsional)
            $table->string('password');  // Kolom untuk password
            $table->string('role');  // Kolom untuk role pengguna (misalnya: admin, kasir)
            $table->timestamp('last_login')->nullable();
            $table->rememberToken();  // Kolom untuk menyimpan token "remember me"
            $table->timestamps();  // Kolom created_at dan updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};

