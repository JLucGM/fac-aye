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
        foreach (['evaluacion', 'evaluacion-seguro', 'evaluacion-tarifa-especial', 'fisioterapia', 'fisioterapia-seguro', 'fisioterapia-tarifa-especial', 'funcional-1', 'funcional-2', 'funcional-3', 'k-tape', 'k-tape-gym', 'k-tape-terapeutico', 'masaje-descarga', 'masaje-gym', 'masaje-terapeutico'] as $slug) {
            Service::create([
                'name' => ucfirst(str_replace('-', ' ', $slug)),
                'slug' => $slug,
                'price' => 10
            ]);
        }
        // Service::create(
        //     ['name' => 'Evaluación', 'slug' => 'evaluacion','price' => 10],
        //     ['name' => 'Evaluación seguro', 'slug' => 'evaluacion-seguro','price' => 10],
        //     ['name' => 'Evaluación tarida especial', 'slug' => 'evaluacion-tarifa-especial','price' => 10],
        //     ['name' => 'Fisioterapia', 'slug' => 'fisioterapia','price' => 10],
        //     ['name' => 'Fisioterapia seguro', 'slug' => 'fisioterapia-seguro','price' => 10],
        //     ['name' => 'Fisioterapia tarifa especial', 'slug' => 'fisioterapia-tarifa-especial','price' => 10],
        //     ['name' => 'Funcional #1', 'slug' => 'funcional-1','price' => 10],
        //     ['name' => 'Funcional #2', 'slug' => 'funcional-2','price' => 10],
        //     ['name' => 'Funcional #3', 'slug' => 'funcional-3','price' => 10],
        //     ['name' => 'K-Tape', 'slug' => 'k-tape','price' => 10],
        //     ['name' => 'K-Tape Gym', 'slug' => 'k-tape-gym','price' => 10],
        //     ['name' => 'K-Tape Terapéutico', 'slug' => 'k-tape-terapeutico','price' => 10],
        //     ['name' => 'Masaje Descarga', 'slug' => 'masaje-descarga','price' => 10],
        //     ['name' => 'Masaje Gym', 'slug' => 'masaje-gym','price' => 10],
        //     ['name' => 'Masaje Terapéutico', 'slug' => 'masaje-terapeutico','price' => 10]
        // );
    }
}
