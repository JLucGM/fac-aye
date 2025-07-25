<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:admin.settings.index')->only('index');
        $this->middleware('can:admin.settings.create')->only('create', 'store');
        $this->middleware('can:admin.settings.edit')->only('edit', 'update');
        $this->middleware('can:admin.settings.delete')->only('delete');
    }
    
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

        if ($request->hasFile('signature')) {
            // Eliminar la imagen anterior de la colección 'signature'
            $settings->clearMediaCollection('signature');

            // Agregar la nueva imagen a la colección 'signature'
            $settings->addMultipleMediaFromRequest(['signature'])
                ->each(function ($fileAdder) {
                    $fileAdder->toMediaCollection('signature');
                });
        }

         return to_route('profile.edit');
    }
}
