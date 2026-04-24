<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class PaymentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // El paciente puede venir directamente o a través de consultas/suscripciones
        $patient = $this->patient;
        
        if (!$patient) {
            $firstConsultation = $this->consultations->first();
            $firstSubscription = $this->patientSubscriptions->first();
            $patient = $firstConsultation ? $firstConsultation->patient : ($firstSubscription ? $firstSubscription->patient : null);
        }

        return [
            'id' => $this->id,
            'amount' => $this->amount,
            'status' => $this->status,
            'reference' => $this->reference,
            'notes' => $this->notes,
            'payment_type' => $this->payment_type,
            'created_at' => $this->created_at ? Carbon::parse($this->created_at)->format('Y-m-d H:i') : null,
            'payment_method' => [
                'id' => $this->paymentMethod->id,
                'name' => $this->paymentMethod->name,
            ],
            'patient' => $patient ? [
                'id' => $patient->id,
                'full_name' => $patient->full_name,
                'identification' => $patient->identification,
                'slug' => $patient->slug,
            ] : null,
        ];
    }
}
