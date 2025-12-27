<?php

namespace App\Http\Controllers;

use App\Models\Obat;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = \App\Models\Obat::all();
    
        return Inertia::render('Sales-Kasir', [
            'products' => $products ?? [],
        ]);
    }

}
