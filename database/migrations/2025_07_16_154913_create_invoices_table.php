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
            $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade'); // Paciente al que se le factura
            // Eliminamos consultation_id directo aquí, ya que la relación será a través de invoice_items o una tabla pivote si una factura agrupa varias consultas.
            $table->date('invoice_date'); // Fecha de emisión de la factura
            // $table->date('due_date')->nullable(); // Fecha de vencimiento del pago
            // $table->decimal('subtotal', 10, 2); // Subtotal antes de impuestos
            // $table->decimal('tax_amount', 10, 2)->default(0.00); // Monto de impuestos
            $table->decimal('total_amount', 10, 2); // Monto total de la factura
            $table->string('status')->default('pending'); // Estado de la factura (pending, paid, cancelled, overdue)
            $table->text('notes')->nullable(); // Notas adicionales
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
