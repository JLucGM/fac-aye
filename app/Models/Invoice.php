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
        // 'due_date',
        // 'subtotal',
        // 'tax_amount',
        'total_amount',
        'status',
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

    /**
     * The payments that belong to the invoice.
     */
    public function payments()
    {
        return $this->belongsToMany(Payment::class, 'invoice_payments')
                    ->withPivot('amount_applied') // Para acceder al campo amount_applied en la tabla pivote
                    ->withTimestamps();
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

