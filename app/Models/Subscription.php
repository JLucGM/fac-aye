<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Subscription extends Model
{
    use HasFactory, HasSlug;

    protected $fillable =
    [
        'name',
        'type',
        'consultations_allowed',
        'price',
        'description',
    ];
    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'consultations_allowed' => 'integer',
        'price' => 'decimal:2',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom(['name', 'lastname'])
            ->saveSlugsTo('slug');
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    /**
     * The patients that belong to the subscription.
     */
    public function patients()
    {
        return $this->belongsToMany(Patient::class, 'patient_subscriptions')
            ->withPivot(['start_date', 'end_date', 'consultations_used', 'status']);
    }
}
