<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consultation extends Model
{
    /** @use HasFactory<\Database\Factories\ConsultationFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'patient_id',
        'service_id',
        'status',
        'scheduled_at',
        'completed_at',
        'notes',
        'payment_status',
    ];

    protected $attributes = [
        'status' => 'pendiente', // pendiente, confirmed, completed, cancelled
        'payment_status' => 'pendiente', // pendiente, paid, refunded
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function services()
    {
        return $this->belongsToMany(Service::class, 'consultation_service');
    }
};
