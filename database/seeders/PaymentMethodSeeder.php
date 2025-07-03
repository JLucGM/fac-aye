<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (['Ninguno','Efectivo', 'Transferencia bancaria', 'Pago móvil', 'Zelle'] as $slug) {
            PaymentMethod::create([
                'name' => ucfirst(str_replace('-', ' ', $slug)),
                'slug' => $slug,
                'active' => 1
            ]);
        }
        // PaymentMethod::create(
        //     ['name' => 'Efectivo', 'slug' => 'efectivo','active' => 1],
        //     ['name' => 'Tarjeta de crédito', 'slug' => 'tarjeta-credito','active' => 1],
        //     ['name' => 'Transferencia bancaria', 'slug' => 'transferencia-bancaria','active' => 1],
        //     ['name' => 'PayPal', 'slug' => 'paypal','active' => 1],
        //     ['name' => 'Zelle', 'slug' => 'zelle','active' => 1],
        // );

    }
}
