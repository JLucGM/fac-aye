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
        Schema::create('medical_records', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // Título breve del registro (ej. "Consulta General", "Revisión de Resultados")
            $table->string('slug')->unique()->nullable();
            $table->text('anamnesis')->nullable(); // Recolección de información sobre la historia clínica de un paciente
            $table->text('pain_behavior')->nullable(); // Comportamiento del dolor
            $table->text('description')->nullable(); // Descripción detallada del evento o hallazgo
            // $table->date('record_date'); // Fecha en que ocurrió el evento
            $table->enum('type', ['consulta', 'diagnostico', 'tratamiento', 'otro'])->default('consulta'); // Tipo de registro
            $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade');
            // $table->foreignId('doctor_id')->nullable()->constrained('doctors')->onDelete('set null'); // Quién creó o atendió
            $table->foreignId('consultation_id')->nullable()->constrained('consultations')->onDelete('set null'); // Si está asociado a una consulta
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_records');
    }
};
