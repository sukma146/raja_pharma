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
                'kategori' => 'Analgesik & Antipiretik',
                'stok' => 92,
                'stok_minimum' => 20,
                'harga' => 3000,
                'tanggal_kedaluwarsa' => '2027-11-27',
                'supplier' => 'mas rusdi',
                'created_at' => '2025-12-28 07:27:05',
                'updated_at' => '2025-12-28 07:52:07',
            ],
            [
                'nama_obat' => 'Amoxicillin',
                'kategori' => 'Antibiotik',
                'stok' => 99,
                'stok_minimum' => 50,
                'harga' => 4000,
                'tanggal_kedaluwarsa' => '2029-10-28',
                'supplier' => 'mas amba',
                'created_at' => '2025-12-28 07:43:15',
                'updated_at' => '2025-12-28 07:52:07',
            ],
            [
                'nama_obat' => 'Dextromethorphan',
                'kategori' => 'Obat Batuk & Pilek',
                'stok' => 18,
                'stok_minimum' => 15,
                'harga' => 15000,
                'tanggal_kedaluwarsa' => '2027-02-11',
                'supplier' => 'mr. ironi',
                'created_at' => '2025-12-28 07:45:36',
                'updated_at' => '2025-12-28 08:06:56',
            ],
            [
                'nama_obat' => 'Antasida',
                'kategori' => 'Obat Pencernaan',
                'stok' => 60,
                'stok_minimum' => 20,
                'harga' => 9000,
                'tanggal_kedaluwarsa' => '2028-10-31',
                'supplier' => 'pak yesking',
                'created_at' => '2025-12-28 07:47:07',
                'updated_at' => '2025-12-28 07:47:07',
            ],
            [
                'nama_obat' => 'Vitacimin C',
                'kategori' => 'Vitamin & Suplemen',
                'stok' => 195,
                'stok_minimum' => 50,
                'harga' => 5000,
                'tanggal_kedaluwarsa' => '2029-07-25',
                'supplier' => 'ci imut',
                'created_at' => '2025-12-28 07:48:49',
                'updated_at' => '2025-12-28 08:06:56',
            ],
            [
                'nama_obat' => 'Loratadine',
                'kategori' => 'Obat Alergi (Antihistamin)',
                'stok' => 80,
                'stok_minimum' => 20,
                'harga' => 5000,
                'tanggal_kedaluwarsa' => '2026-01-10',
                'supplier' => 'mas hardin',
                'created_at' => '2025-12-28 07:50:50',
                'updated_at' => '2025-12-28 07:50:50',
            ],
            [
                'nama_obat' => 'Kalpanax',
                'kategori' => 'Obat Kulit & Salep',
                'stok' => 68,
                'stok_minimum' => 20,
                'harga' => 12000,
                'tanggal_kedaluwarsa' => '2028-08-19',
                'supplier' => 'ci lilnas',
                'created_at' => '2025-12-28 08:01:47',
                'updated_at' => '2025-12-28 08:06:56',
            ],
            [
                'nama_obat' => 'Insto',
                'kategori' => 'Obat Mata, Hidung & Telinga',
                'stok' => 15,
                'stok_minimum' => 10,
                'harga' => 17000,
                'tanggal_kedaluwarsa' => '2025-12-06',
                'supplier' => 'mas fuad',
                'created_at' => '2025-12-28 08:03:01',
                'updated_at' => '2025-12-28 08:03:01',
            ],
            [
                'nama_obat' => 'Sulfoxa',
                'kategori' => 'Obat Kronis',
                'stok' => 5,
                'stok_minimum' => 5,
                'harga' => 50000,
                'tanggal_kedaluwarsa' => '2026-12-03',
                'supplier' => 'wongireng969',
                'created_at' => '2025-12-28 08:04:35',
                'updated_at' => '2025-12-28 08:04:35',
            ],
            [
                'nama_obat' => 'Termometer',
                'kategori' => 'Alat Kesehatan',
                'stok' => 15,
                'stok_minimum' => 5,
                'harga' => 40000,
                'tanggal_kedaluwarsa' => '2033-07-07',
                'supplier' => 'sikmaboy',
                'created_at' => '2025-12-28 08:05:43',
                'updated_at' => '2025-12-28 08:05:43',
            ],
        ]);
    }
}
