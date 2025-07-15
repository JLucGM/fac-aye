<?php

namespace Database\Seeders;

use App\Models\Subscription;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subscription = [
            [
                'name' => 'Funcional 1',
                'price' => 110,
                'type' => 'mensual',
                'consultations_allowed' => 8,
            ],
            [
                'name' => 'Funcional 2',
                'price' => 165,
                'type' => 'mensual',
                'consultations_allowed' => 12,
            ],
            [
                'name' => 'Funcional 3',
                'price' => 200,
                'type' => 'mensual',
                'consultations_allowed' => 16,
            ],
        ];

        foreach ($subscription as $subscriptionData) {
            Subscription::create($subscriptionData);
        }
    }
}
