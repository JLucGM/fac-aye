<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'name' => ' FisioAthletic Care',
                'rif' => "1234567",
                'email' => "joedoe@example.com",
                'phone' => "0424-1524141",
                'direction' => "Urb. San Luis, Centro Comercial San Luis. Local FisioAthletic Care.",
                'instagram' => "@facvzla",
            ],
        ];

        foreach ($settings as $settingsData) {
            Setting::create($settingsData);
        }
    }
}
