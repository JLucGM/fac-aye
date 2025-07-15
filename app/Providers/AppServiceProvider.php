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
        // Obtén la primera configuración y su colección de medios
        $mediaItem = Setting::with('media')->first()?->media->firstWhere('collection_name', 'logo');
        
        // Devuelve la URL original del logo, o null si no existe
        return $mediaItem?->getUrl(); // Asegúrate de usar getUrl() para obtener la URL de la imagen
    });
}


}
