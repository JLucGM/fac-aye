<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_id',
        // 'service_id',
        'consultation_id',
        // 'description',
        'quantity',
        'unit_price',
        'line_total',
    ];

    /**
     * Get the invoice that owns the invoice item.
     */
    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    /**
     * Get the service that owns the invoice item.
     */
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Get the consultation that owns the invoice item.
     */
    public function consultation()
    {
        return $this->belongsTo(Consultation::class);
    }
}

