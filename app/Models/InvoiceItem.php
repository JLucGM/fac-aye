<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_id',
        'service_name',
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

}

