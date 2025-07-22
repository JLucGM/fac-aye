<?php

namespace Database\Seeders;

use App\Models\Doctor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DoctorSeeder extends Seeder
{
    /**
     * Run the database seeds.s
     */
    public function run(): void
    {

        $doctors = [
            [
                'name' => 'Barbra',
                'lastname' => 'Gouirand',
            ],
            [
                'name' => 'Gustavo',
                'lastname' => 'Garcia',
            ],
            [
                'name' => 'Tito',
                'lastname' => 'Barraez',
            ],
            [
                'name' => "Juliette",
                "lastname" => "Medrano",
            ],
            [
                "name" => "Carolina",
                "lastname" => "Pisanti",
            ],
            [
                'name' => 'Andres',
                'lastname' => 'Monasterios',
            ],
            [
                'name' => 'Orlando',
                'lastname' => 'Franchi',
            ],
            [
                "name" => "Carlos",
                "lastname" => "Goschenko",
            ],
            [
                "name" => "Juan",
                "lastname" => "Marsal",
            ],
            [
                "name" => "Hiram",
                "lastname" => "Padron",
            ],
            [
                "name" => "Charlotte",
                "lastname" => "Zabaleta",
            ],
            [
                'name' => 'Jose Gabriel',
                'lastname' => 'Gonzalez',
            ],
            [
                'name' => 'Carlos Eduardo',
                'lastname' => 'Marquez',
            ],
        ];

        foreach ($doctors as $doctorsData) {
            Doctor::create($doctorsData);
        }
    }
}
