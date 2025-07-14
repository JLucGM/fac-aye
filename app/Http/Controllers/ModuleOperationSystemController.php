<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ModuleOperationSystemController extends Controller
{
    public function index()
    {
        return Inertia::render('ModuleOperationSystem/Index');
    }
}
