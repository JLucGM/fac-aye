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
        Schema::create('patient_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('consultations_used')->default(0); // se utiliza para llevar un registro de cuántas consultas ha utilizado un paciente dentro de su período de suscripción.
            $table->integer('consultations_remaining'); // Este campo indica cuántas consultas le quedan al paciente dentro de su suscripción actual.
            $table->string('status')->default('active');
            $table->string('payment_status')->default('pendiente'); // pendiente, paid, refunded
            $table->decimal('amount_paid', 8, 2)->default(0);
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subscription_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_subscriptions');
    }
};
