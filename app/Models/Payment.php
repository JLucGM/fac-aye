<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    /** @use HasFactory<\Database\Factories\PaymentFactory> */
    use HasFactory;

    protected $fillable = [
        'payment_method_id',
        'amount',
        'status',
        'reference',
        'notes',
        // 'paid_at',
    ];

    protected $attributes = [
        'status' => 'pendiente', // pendiente, completado, fallido
    ];

    // protected $casts = [
    //     'paid_at' => 'datetime',
    // ];

    public function consultations()
    {
        return $this->belongsToMany(Consultation::class);
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    public function invoices()
    {
        return $this->belongsToMany(Invoice::class, 'invoice_payments')
            ->withPivot('amount_applied') // Para acceder al campo amount_applied en la tabla pivote
            ->withTimestamps();
    }

    public function patientSubscriptions()
    {
        return $this->belongsToMany(PatientSubscription::class, 'patient_subscription_payment');
    }

}
