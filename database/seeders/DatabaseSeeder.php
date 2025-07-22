<?php

namespace Database\Seeders;

use App\Models\Patient;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RolesSeeder::class);
        $this->call(SettingsSeeder::class);
        $this->call(ServiceSeeder::class);
        $this->call(PaymentMethodSeeder::class);
        $this->call(DoctorSeeder::class);
        $this->call(SubscriptionSeeder::class);
        
        // User::factory(10)->create();
        Patient::factory()
            ->count(5)
            ->create();

        //     PaymentMethod::factory()
        //     ->count(3)
        //     ->create();

        //     Service::factory()
        //     ->count(5)
        //     ->create();

        User::factory()->create([
            'name' => 'User',
            'lastname' => 'Admin',
            'email' => 'test@example.com',
        ])->assignRole('super-admin');
    }
}
