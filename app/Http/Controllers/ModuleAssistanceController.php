<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ModuleAssistanceController extends Controller
{
    public function index()
    {
        return Inertia::render('ModuleAssistance/Index');
    }
}
