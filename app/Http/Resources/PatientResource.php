<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class PatientResource extends JsonResource
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
            'name' => $this->name,
            'lastname' => $this->lastname,
            'full_name' => "{$this->name} {$this->lastname}",
            'email' => $this->email,
            'identification' => $this->identification,
            'phone' => $this->phone,
            
            // Usamos Carbon::parse si viene como string
            'birthdate' => $this->birthdate 
                ? Carbon::parse($this->birthdate)->format('Y-m-d') 
                : null,
                
            'slug' => $this->slug,
            'balance' => $this->balance,
            'credit' => $this->credit,
            'active_subscription' => $this->whenLoaded('activeSubscription', function() {
                return [
                    'id' => $this->activeSubscription->id,
                    'status' => $this->activeSubscription->status,
                    'consultations_remaining' => $this->activeSubscription->consultations_remaining,
                    
                    // Aplicamos lo mismo para end_date
                    'end_date' => $this->activeSubscription->end_date 
                        ? Carbon::parse($this->activeSubscription->end_date)->format('Y-m-d') 
                        : null,
                ];
            }),
            
            // created_at suele ser Carbon por defecto, pero por seguridad:
            'created_at' => $this->created_at instanceof \Carbon\Carbon 
                ? $this->created_at->format('Y-m-d H:i:s') 
                : Carbon::parse($this->created_at)->format('Y-m-d H:i:s'),
        ];
    }
}