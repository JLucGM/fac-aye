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
        'paid_at',
    ];

    protected $attributes = [
        'status' => 'pendiente', // pendiente, completado, fallido
    ];

    protected $casts = [
        'paid_at' => 'datetime',
    ];

    public function consultations()
    {
        return $this->belongsToMany(Consultation::class);
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    // public function getStatusLabelAttribute()
    // {
    //     return match ($this->status) {
    //         'pendiente' => 'Pendiente',
    //         'completado' => 'Completado',
    //         'fallido' => 'Fallido',
    //         default => 'Desconocido',
    //     };
    // }

    // public function getPaidAtFormattedAttribute()
    // {
    //     return $this->paid_at ? $this->paid_at->format('d/m/Y H:i') : 'No pagado';
    // }

    // public function getAmountFormattedAttribute()
    // {
    //     return number_format($this->amount, 2, ',', '.');
    // }


}
