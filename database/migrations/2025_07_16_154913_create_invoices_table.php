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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique(); // Número único de factura
            $table->date('invoice_date'); // Fecha de emisión de la factura
            $table->decimal('total_amount', 10, 2); // Monto total de la factura
            $table->text('notes')->nullable(); // Notas adicionales
            $table->foreignId('payment_method_id')->constrained()->onDelete('cascade'); // ID del método de pago utilizado
            $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade'); // Paciente al que se le factura
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
