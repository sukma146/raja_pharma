<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required|min:8',
            'role' => 'required',
        ]);
    
        $user = User::where('username', $request->username)->first();
    
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Username tidak ditemukan.'
            ], 404);
        }
    
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Password salah.'
            ], 401);
        }
    
        if ($user->role !== $request->role) {
            return response()->json([
                'status' => 'error',
                'message' => 'Role tidak sesuai dengan akun.'
            ], 403);
        }
    
         
        
        // Login pengguna
        Auth::login($user);
        
    // Simpan nama kasir di session setelah login berhasil
        session(['cashier' => $user->username]);
        // Perbarui status menjadi 'aktif' setelah login
        $user->update([
            'last_login' => now(),
            'status' => 'aktif', // Update status menjadi 'aktif'
        ]);
    
        return response()->json([
            'status' => 'success',
            'message' => 'Login berhasil!',
            'user' => $user
        ]);
    }
    
    
    
    public function logout(Request $request)
{
    // Perbarui status menjadi 'offline' saat logout
    $user = Auth::user();
    $user->update([
        'status' => 'offline', // Update status menjadi 'offline'
    ]);

    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect()
        ->route('login')
        ->with('toast', 'Logout berhasil!');
}

    
}
