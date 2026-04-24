<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class SubscriptionResource extends JsonResource
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
            'type' => $this->type,
            'consultations_allowed' => $this->consultations_allowed,
            'price' => $this->price,
            'description' => $this->description,
            'slug' => $this->slug,
            'created_at' => $this->created_at ? Carbon::parse($this->created_at)->format('Y-m-d H:i') : null,
        ];
    }
}
