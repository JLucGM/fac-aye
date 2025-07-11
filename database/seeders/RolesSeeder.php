<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $rolSuperAdmin = Role::create(['name' => 'super-admin', 'slug' => 'super-admin']);
        $rolAdmin = Role::create(['name' => 'admin', 'slug' => 'admin']);

        Permission::create(['name' => 'admin.dashboard.charts', 'description' => 'Ver graficos del dashboard'])->syncRoles([$rolSuperAdmin, $rolAdmin]);

        Permission::create(['name' => 'admin.user.index', 'description' => 'Ver lista de usuarios'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.user.create', 'description' => 'Crear usuarios'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.user.edit', 'description' => 'Editar usuarios'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.user.delete', 'description' => 'Eliminar usuarios'])->syncRoles([$rolSuperAdmin, $rolAdmin]);

        Permission::create(['name' => 'admin.service.index', 'description' => 'Ver lista de servicios'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.service.create', 'description' => 'Crear servicios'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.service.edit', 'description' => 'Editar servicios'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.service.delete', 'description' => 'Eliminar servicios'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        
        Permission::create(['name' => 'admin.payment.index', 'description' => 'Ver lista de pago'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.payment.create', 'description' => 'Crear pago'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.payment.edit', 'description' => 'Editar pago'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.payment.delete', 'description' => 'Eliminar pago'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        
        Permission::create(['name' => 'admin.paymentmethod.index', 'description' => 'Ver lista de metodos de pago'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.paymentmethod.create', 'description' => 'Crear metodos de pago'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.paymentmethod.edit', 'description' => 'Editar metodos de pago'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.paymentmethod.delete', 'description' => 'Eliminar metodos de pago'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        
        Permission::create(['name' => 'admin.patient.index', 'description' => 'Ver lista de patiences'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.patient.create', 'description' => 'Crear patiences'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.patient.edit', 'description' => 'Editar patiences'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.patient.delete', 'description' => 'Eliminar patiences'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        
        Permission::create(['name' => 'admin.consultation.index', 'description' => 'Ver lista de consultas'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.consultation.create', 'description' => 'Crear consultas'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.consultation.edit', 'description' => 'Editar consultas'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.consultation.delete', 'description' => 'Eliminar consultas'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
  
        Permission::create(['name' => 'admin.role.index', 'description' => 'Ver lista de roles'])->syncRoles([$rolSuperAdmin]);
        Permission::create(['name' => 'admin.role.create', 'description' => 'Crear roles'])->syncRoles([$rolSuperAdmin]);
        Permission::create(['name' => 'admin.role.edit', 'description' => 'Editar roles'])->syncRoles([$rolSuperAdmin]);
        Permission::create(['name' => 'admin.role.delete', 'description' => 'Eliminar roles'])->syncRoles([$rolSuperAdmin]);
        
        Permission::create(['name' => 'admin.doctor.index', 'description' => 'Ver lista de doctors'])->syncRoles([$rolSuperAdmin]);
        Permission::create(['name' => 'admin.doctor.create', 'description' => 'Crear doctors'])->syncRoles([$rolSuperAdmin]);
        Permission::create(['name' => 'admin.doctor.edit', 'description' => 'Editar doctors'])->syncRoles([$rolSuperAdmin]);
        Permission::create(['name' => 'admin.doctor.delete', 'description' => 'Eliminar doctors'])->syncRoles([$rolSuperAdmin]);
        
        Permission::create(['name' => 'admin.subscription.index', 'description' => 'Ver lista de subscripciones'])->syncRoles([$rolSuperAdmin]);
        Permission::create(['name' => 'admin.subscription.create', 'description' => 'Crear subscripciones'])->syncRoles([$rolSuperAdmin]);
        Permission::create(['name' => 'admin.subscription.edit', 'description' => 'Editar subscripciones'])->syncRoles([$rolSuperAdmin]);
        Permission::create(['name' => 'admin.subscription.delete', 'description' => 'Eliminar subscripciones'])->syncRoles([$rolSuperAdmin]);

        Permission::create(['name' => 'admin.settings.index', 'description' => 'Ver lista de settings'])->syncRoles([$rolSuperAdmin]);
        Permission::create(['name' => 'admin.settings.create', 'description' => 'Crear settings'])->syncRoles([$rolSuperAdmin]);
        Permission::create(['name' => 'admin.settings.edit', 'description' => 'Editar settings'])->syncRoles([$rolSuperAdmin]);
        Permission::create(['name' => 'admin.settings.delete', 'description' => 'Eliminar settings'])->syncRoles([$rolSuperAdmin]);

    }
}
