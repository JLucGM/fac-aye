<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::with('media')->first();
        return Inertia::render('settings/Index', compact('settings'));
    }
    public function update(Request $request, Setting $settings)
    {
        // dd($request->all());

        $settings->update($request->only(
            'name',
            'rif',
            'direction',
            'phone',
            'email',
            'instagram',
        ));

        if ($request->hasFile('logo')) {
            // Eliminar la imagen anterior de la colección 'logo'
            $settings->clearMediaCollection('logo');

            // Agregar la nueva imagen a la colección 'logo'
            $settings->addMultipleMediaFromRequest(['logo'])
                ->each(function ($fileAdder) {
                    $fileAdder->toMediaCollection('logo');
                });
        }

        return Inertia::render('settings/profile');
    }
}
