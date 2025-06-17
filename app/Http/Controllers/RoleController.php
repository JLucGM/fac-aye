<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:admin.role.index')->only('index');
        $this->middleware('can:admin.role.create')->only('create', 'store');
        $this->middleware('can:admin.role.edit')->only('edit', 'update');
        $this->middleware('can:admin.role.delete')->only('delete');
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = Role::all();
        return Inertia::render('Roles/Index', compact('roles'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $permissions = Permission::all();
        return Inertia::render('Roles/Create', compact('permissions'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoleRequest $request)
    {
        // dd($request->all());
        $validatedData = $request->validated();
        $role = Role::create(['name' => $validatedData['name']]);

        // Asignar permisos al rol
        if (isset($validatedData['permissions'])) {
            $role->syncPermissions($validatedData['permissions']);
        }

        return redirect()->route('roles.index');
    }


    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        return Inertia::render('roles/Show', compact('role'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
{
    $permissions = Permission::all();

    // Obtener solo los nombres de los permisos asignados
    $assignedPermissions = $role->getAllPermissions()->pluck('name')->toArray();

    // Pasar rol y permisos a Inertia
    return Inertia::render('Roles/Edit', compact('role', 'permissions', 'assignedPermissions'));
}



    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoleRequest $request, Role $role)
{
    // Actualiza el nombre del rol
    $role->update($request->validated());

    // Sincroniza los permisos
    if ($request->has('permissions')) {
        // Asumiendo que estás usando una relación de muchos a muchos
        $role->syncPermissions($request->input('permissions'));
    }

    return redirect()->route('roles.index')->with('success', 'Role actualizado con éxito.');
}


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        $role->delete();
        return redirect()->route('roles.index');
    }
}
