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
        Schema::create('patient_subscription_payment', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')->constrained('payments')->onDelete('cascade');
            $table->foreignId('patient_subscription_id')->constrained('patient_subscriptions')->onDelete('cascade');
            $table->timestamps();
            // Asegurar que una combinación de pago y suscripción de paciente sea única
            // $table->unique(['payment_id', 'patient_subscription_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_subscription_payment');
    }
};
