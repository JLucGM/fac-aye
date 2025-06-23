<?php

namespace App\Providers;

use App\Models\Setting;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    // En AppServiceProvider.php
public function boot(): void
{
    Inertia::share('logo', function () {
        $logo = Setting::with('media')->first()?->media->first();
        return $logo?->original_url; // ✅ Asegúrate de devolver `string|null`, no un objeto
    });
}

}
