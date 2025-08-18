<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Patient extends Model
{
    /** @use HasFactory<\Database\Factories\PatientFactory> */
    use HasFactory, HasSlug;

    protected $fillable = [
        'name',
        'lastname',
        'email',
        'address',
        'slug',
        'identification',
        'phone',
        'birthdate',
        'doctor_id',
    ];
    protected $casts = [
        'birthdate' => 'date',
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

    public function consultations()
    {
        return $this->hasMany(Consultation::class);
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(PatientSubscription::class);
    }

    public function activeSubscription()
{
    return $this->hasOne(PatientSubscription::class)
                ->where('status', 'active');
}


    public function medicalRecords()
    {
        return $this->hasMany(MedicalRecord::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function getFullNameAttribute()
    {
        return "{$this->name} {$this->lastname}";
    }
}
