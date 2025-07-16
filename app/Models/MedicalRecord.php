<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class MedicalRecord extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'patient_id',
        'consultation_id',
        'title',
        'description',
        // 'record_date',
        'anamnesis',
        'pain_behavior',
        'type',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom(['title'])
            ->saveSlugsTo('slug');
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
    public function consultation()
    {
        return $this->belongsTo(Consultation::class);
    }
}
