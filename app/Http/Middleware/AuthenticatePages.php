<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticatePages
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()) {
            $role = Auth::user()->role;

            // Redirect user sesuai role
            return redirect()->route($role === 'admin' ? 'dashboard_admin' : 'dashboard_kasir');
        }

        return $next($request); // Lanjut ke login atau landing jika belum login
    }
}
