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
        Schema::create('consultations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // ID del médico o profesional de la salud
            $table->foreignId('patient_id')->constrained()->onDelete('cascade'); // ID del paciente
            // $table->foreignId('service_id')->constrained()->onDelete('cascade'); // ID del servicio o especialidad médica
            $table->string('status')->default('pendiente'); // pendiente, confirmed, completed, cancelled
            $table->dateTime('scheduled_at')->nullable(); // Fecha y hora programada
            // $table->dateTime('completed_at')->nullable(); // Fecha y hora de finalización
            $table->text('notes')->nullable(); // Notas adicionales sobre la consulta
            $table->string('payment_status')->default('pendiente'); // pendiente, paid, refunded
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultations');
    }
};
