<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'patient_id',
        'invoice_date',
        'payment_method_id',
        'total_amount',
        'notes',
    ];

    /**
     * Get the patient that owns the invoice.
     */
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    /**
     * Get the invoice items for the invoice.
     */
    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    // Puedes agregar métodos para calcular el saldo pendiente, etc.
    public function getAmountPaidAttribute()
    {
        return $this->payments()->sum('amount_applied');
    }

    public function getAmountDueAttribute()
    {
        return $this->total_amount - $this->getAmountPaidAttribute();
    }
}

