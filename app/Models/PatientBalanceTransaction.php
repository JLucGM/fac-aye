<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatientBalanceTransaction extends Model
{
    protected $fillable = [
        'amount',
        'type',
        'description',
        'patient_id',
        'consultation_id',
        'patient_subscription_id',
        'payment_id',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function consultation()
    {
        return $this->belongsTo(Consultation::class);
    }

    public function patientSubscription()
    {
        return $this->belongsTo(PatientSubscription::class);
    }

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }
}
