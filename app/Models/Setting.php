<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;


class Setting extends Model implements HasMedia
{
        use InteractsWithMedia;

    protected $fillable = [
        'name',
        'rif',
        'direction',
        'phone',
        'email',
        'instagram',
    ];

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('logo')
              ->width(368)
              ->height(232);
    }
}
