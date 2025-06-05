<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nombre del método de pago (ej. Tarjeta de crédito, PayPal, etc.)
            $table->string('slug')->unique(); // Slug único para el método de pago
            $table->string('description')->nullable(); // Descripción del método de pago
            $table->boolean('active')->default(true); // Indica si el método de pago está activo
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
    }
};
