<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    /** @use HasFactory<\Database\Factories\ServiceFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'price',
        'description',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function consultations()
    {
        return $this->hasMany(Consultation::class);
    }

    public function getPriceFormattedAttribute()
    {
        return number_format($this->price, 2, ',', '.');
    }

    public function getDescriptionAttribute($value)
    {
        return $value ?: 'No description available';
    }

    
}
