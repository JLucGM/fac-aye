<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Service::create(
            ['name' => 'Evaluación', 'slug' => 'evaluacion','price' => 10],
            ['name' => 'Evaluación seguro', 'slug' => 'evaluacion-seguro','price' => 10],
            ['name' => 'Evaluación tarida especial', 'slug' => 'evaluacion-tarifa-especial','price' => 10],
            // ['name' => 'super-admin', 'slug' => 'super-admin','price' => 1],
            // ['name' => 'super-admin', 'slug' => 'super-admin','price' => 1],
            // ['name' => 'super-admin', 'slug' => 'super-admin','price' => 1],
        );
    }
}
