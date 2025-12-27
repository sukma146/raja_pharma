<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo($request): ?string
    {
        // Jika request bukan request API dan user tidak login, redirect ke halaman login
        if (! $request->expectsJson()) {
            return route('login');
        }

        return null;
    }
}
