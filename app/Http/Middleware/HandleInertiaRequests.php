<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Shared props to all Inertia responses.
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            // Share authenticated user data
            'auth' => [
                'user' => $request->user(),
            ],

            // Share toast message if exists
            'toast' => fn () => $request->session()->get('toast'),
        ]);
    }
}
