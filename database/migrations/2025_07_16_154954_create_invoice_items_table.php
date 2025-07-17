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
        Schema::create('invoice_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invoice_id')->constrained('invoices')->onDelete('cascade'); // Factura a la que pertenece el ítem
            // $table->foreignId('service_id')->nullable()->constrained('services')->onDelete('set null'); // Servicio asociado (opcional)
            $table->foreignId('consultation_id')->nullable()->constrained('consultations')->onDelete('set null'); // Consulta específica de la que proviene este ítem
            // $table->string('description'); // Descripción del ítem (ej. "Consulta médica general", "Terapia física")
            $table->integer('quantity')->default(1); // Cantidad del servicio/producto
            $table->decimal('unit_price', 10, 2); // Precio unitario del servicio/producto
            $table->decimal('line_total', 10, 2); // Total por este ítem (quantity * unit_price)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_items');
    }
};
