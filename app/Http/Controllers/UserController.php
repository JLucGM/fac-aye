<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::all();
        return Inertia::render('Users/Index', compact('users'));
    }

    // Other methods for create, store, show, edit, update, destroy can be added here
    public function create()
    {
        // return view('users.create');
        return Inertia::render('Users/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'lastname' => 'nullable|string|max:255',
            'identification' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'active' => 'boolean',
            'phone' => 'nullable|string|max:15',
        ]);
        $user = User::create($validated);
        return redirect()->route('user.edit', compact('user'));
    }

    public function show(User $user)
    {
        return Inertia::render('Users/Show', compact('user'));
    }

    public function edit(User $user)
    {
        return Inertia::render('Users/Edit', compact('user'));
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'lastname' => 'nullable|string|max:255',
            'identification' => 'required|string|max:255|unique:users,identification,' . $user->id,
            'active' => 'boolean',
            'phone' => 'nullable|string|max:15',
        ]);

        // Solo actualiza el campo password si se proporciona
        if (!empty($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']); // Asegúrate de encriptar la contraseña
        } else {
            unset($validated['password']); // Elimina el campo password si no se proporciona
        }

        $user->update($validated);

        return redirect()->route('user.index')->with('success', 'User  updated successfully.');
    }


    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('user.index')->with('success', 'User deleted successfully.');
    }
}
