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
            $table->string('status')->default('completado'); // pendiente, confirmed, completed, cancelled
            $table->dateTime('scheduled_at')->nullable(); // Fecha y hora programada
            $table->string('consultation_type')->default('domiciliary'); // domiciliary, office
            $table->text('services')->nullable(); // domiciliary, office
            $table->decimal('amount', 10, 2)->default(0.00); // Monto del servicio de consulta
            $table->text('notes')->nullable(); // Notas adicionales sobre la consulta
            $table->string('payment_status')->default('pendiente'); // pendiente, paid, refunded
            $table->foreignId('patient_id')->constrained()->onDelete('cascade'); // ID del paciente
            $table->foreignId('patient_subscription_id')->nullable()->constrained('patient_subscriptions')->onDelete('set null');
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
