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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount', 10, 2); // Monto del pago
            $table->string('status')->default('pendiente'); // Estado del pago: pendiente, completado, fallido
            $table->string('reference')->nullable(); // ID de transacción proporcionado por el procesador de pagos
            $table->text('notes')->nullable(); // Notas adicionales sobre el pago
            // $table->timestamp('paid_at')->nullable(); // Fecha y hora en que se realizó el pago
            // $table->foreignId('patient_id')->constrained()->onDelete('cascade'); // ID del paciente que realiza el pago
            // $table->foreignId('consultation_id')->constrained()->onDelete('cascade'); // ID de la consulta asociada al pago
            $table->foreignId('payment_method_id')->constrained()->onDelete('cascade'); // ID del método de pago utilizado
            $table->timestamps();
        });   
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
