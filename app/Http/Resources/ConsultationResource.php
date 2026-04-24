<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class ConsultationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'consultation_type' => $this->consultation_type,
            'amount' => $this->amount,
            'amount_paid' => $this->amount_paid,
            'scheduled_at' => $this->scheduled_at ? Carbon::parse($this->scheduled_at)->format('Y-m-d H:i') : null,
            'scheduled_at_formatted' => $this->scheduled_at ? Carbon::parse($this->scheduled_at)->isoFormat('LLLL') : null,
            'created_at' => $this->created_at ? Carbon::parse($this->created_at)->format('Y-m-d H:i') : null,
            'services' => json_decode($this->services, true),
            'notes' => $this->notes,
            'patient' => [
                'id' => $this->patient->id,
                'full_name' => $this->patient->full_name,
                'slug' => $this->patient->slug,
                'identification' => $this->patient->identification,
            ],
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'lastname' => $this->user->lastname,
            ],
        ];
    }
}
