<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Service extends Model
{
    /** @use HasFactory<\Database\Factories\ServiceFactory> */
    use HasFactory, HasSlug;

    protected $fillable = [
        'name',
        'slug',
        'price',
        'description',
        'is_courtesy',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom(['name'])
            ->saveSlugsTo('slug');
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

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
