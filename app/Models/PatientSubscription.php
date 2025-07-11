<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatientSubscription extends Model
{
     protected $table = 'patient_subscriptions';
    
    protected $fillable = [
        'patient_id', 
        'subscription_id', 
        'start_date', 
        'end_date',
        'consultations_used', 
        'consultations_remaining', 
        'status'
    ];
    
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
    
    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

    public function consultations()
    {
        return $this->hasMany(Consultation::class);
    }
}
