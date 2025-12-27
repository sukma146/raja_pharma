<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        $users = User::select('id', 'name', 'username', 'role', 'last_login', 'status') // Tambahkan 'status' ke query
            ->orderBy('role', 'asc')   // Urutkan berdasarkan role (admin dulu, lalu kasir)
            ->orderBy('id', 'asc')     // Jika role sama, urutkan berdasarkan id
            ->get();
    
        return Inertia::render('UserManagement', [
            'users' => $users,
            'currentUserId' => auth()->user(), // Kirimkan seluruh data pengguna yang sedang login (bukan hanya ID)
        ]);
    }
    

    public function getCurrentUser()
    {
        return response()->json([
            'currentUserId' => Auth::id(), // Mengambil ID pengguna yang sedang login
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'username' => 'required|unique:users',
            'password' => 'required|min:8',
            'role' => 'required',
        ]);
    
        User::create([
            'name' => $request->name,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'role' => strtolower($request->role),

        ]);
    
        return redirect('/dashboard/admin/user-management')->with('success', 'User berhasil ditambahkan');
        
    }
    

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required',
            'username' => 'required|unique:users,username,' . $id,
            'role' => 'required',
        ]);

        $user = User::findOrFail($id);

        $user->update([
            'name' => $request->name,
            'username' => $request->username,
            'role' => strtolower($request->role),

        ]);

        if ($request->filled('password')) {
            $user->update(['password' => Hash::make($request->password)]);
        }

        return redirect('/dashboard/admin/user-management')->with('success', 'User berhasil diperbarui');    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect('/dashboard/admin/user-management')->with('success', 'User berhasil dihapus');    }
}
