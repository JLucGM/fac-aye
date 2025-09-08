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
        Schema::create('patient_balance_transactions', function (Blueprint $table) {
             $table->id();
             $table->decimal('amount', 10, 2); // Monto de la transacción (positivo para pagos, negativo para deudas)
             $table->string('type'); // Tipo de transacción (e.g., 'consulta_deuda', 'suscripcion_deuda', 'pago_recibido', 'ajuste')
             $table->text('description')->nullable(); // Descripción de la transacción
             $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade');
            $table->foreignId('consultation_id')->nullable()->constrained('consultations')->onDelete('set null');
            $table->foreignId('patient_subscription_id')->nullable()->constrained('patient_subscriptions')->onDelete('set null');
            $table->foreignId('payment_id')->nullable()->constrained('payments')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_balance_transactions');
    }
};
