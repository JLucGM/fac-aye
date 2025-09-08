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
        'patient_subscription_id',
        'status',
        'scheduled_at',
        'services',
        'notes',
        'payment_status',
        'amount',
        'amount_paid',
        'consultation_type', // domiciliary, office
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

    public function invoiceItems()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function payment()
    {
        return $this->belongsToMany(Payment::class, 'consultation_payment');
    }

    public function subscription()
    {
        return $this->belongsTo(PatientSubscription::class, 'patient_subscription_id');
    }

    public function medicalRecords() // Nueva relación para el historial
    {
        return $this->hasMany(MedicalRecord::class);
    }
};
