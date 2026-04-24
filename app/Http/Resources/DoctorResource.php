<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class DoctorResource extends JsonResource
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
            'phone' => $this->phone,
            'identification' => $this->identification,
            'specialty' => $this->specialty,
            'slug' => $this->slug,
            'created_at' => $this->created_at ? Carbon::parse($this->created_at)->format('Y-m-d H:i') : null,
        ];
    }
}
