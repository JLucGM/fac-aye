<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ModuleAdministrativeController extends Controller
{
    public function index()
    {
        return Inertia::render('ModuleAdministrative/Index');
    }
}
