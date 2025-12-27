<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ObatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('obats')->insert([
            [
                'nama_obat' => 'Paracetamol 500mg',
                'kategori' => 'Analgesik',
                'stok' => 100,
                'stok_minimum' => 10,
                'harga' => 5000,
                'tanggal_kedaluwarsa' => Carbon::now()->addMonths(12),
                'supplier' => 'PT Kimia Farma',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_obat' => 'Amoxicillin 500mg',
                'kategori' => 'Antibiotik',
                'stok' => 80,
                'stok_minimum' => 15,
                'harga' => 7000,
                'tanggal_kedaluwarsa' => Carbon::now()->addMonths(10),
                'supplier' => 'PT Dexa Medica',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_obat' => 'Ibuprofen 400mg',
                'kategori' => 'Anti Inflamasi',
                'stok' => 50,
                'stok_minimum' => 10,
                'harga' => 6000,
                'tanggal_kedaluwarsa' => Carbon::now()->addMonths(14),
                'supplier' => 'PT Kalbe Farma',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_obat' => 'Cetirizine 10mg',
                'kategori' => 'Antihistamin',
                'stok' => 120,
                'stok_minimum' => 20,
                'harga' => 8000,
                'tanggal_kedaluwarsa' => Carbon::now()->addMonths(9),
                'supplier' => 'PT Merck',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_obat' => 'Omeprazole 20mg',
                'kategori' => 'Antasid',
                'stok' => 90,
                'stok_minimum' => 10,
                'harga' => 10000,
                'tanggal_kedaluwarsa' => Carbon::now()->addMonths(6),
                'supplier' => 'PT Kimia Farma',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_obat' => 'Losartan 50mg',
                'kategori' => 'Antihipertensi',
                'stok' => 60,
                'stok_minimum' => 5,
                'harga' => 15000,
                'tanggal_kedaluwarsa' => Carbon::now()->addMonths(8),
                'supplier' => 'PT Sanbe Farma',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_obat' => 'Metformin 500mg',
                'kategori' => 'Antidiabetik',
                'stok' => 70,
                'stok_minimum' => 10,
                'harga' => 12000,
                'tanggal_kedaluwarsa' => Carbon::now()->addMonths(18),
                'supplier' => 'PT Kalbe Farma',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_obat' => 'Amlodipine 5mg',
                'kategori' => 'Antihipertensi',
                'stok' => 85,
                'stok_minimum' => 10,
                'harga' => 11000,
                'tanggal_kedaluwarsa' => Carbon::now()->addMonths(7),
                'supplier' => 'PT Sandoz',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_obat' => 'Simvastatin 20mg',
                'kategori' => 'Antikolesterol',
                'stok' => 40,
                'stok_minimum' => 5,
                'harga' => 9000,
                'tanggal_kedaluwarsa' => Carbon::now()->addMonths(15),
                'supplier' => 'PT Merck',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_obat' => 'Diphenhydramine 25mg',
                'kategori' => 'Antihistamin',
                'stok' => 130,
                'stok_minimum' => 20,
                'harga' => 7000,
                'tanggal_kedaluwarsa' => Carbon::now()->addMonths(10),
                'supplier' => 'PT Kalbe Farma',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
