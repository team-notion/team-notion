<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    protected $fillable = [
        'owner_id',
        'model',
        'type',
        'year_of_manufacture',
        'daily_price',
        'photos',
        'availability_dates',
        'rental_rules',
        'deposit',
        'deposit_percentage',
        'cutoff_hours',
    ];

    protected $casts = [
        'photos' => 'array',
        'availability_dates' => 'array',
        'deposit_percentage' => 'boolean',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function photos()
    {
        return $this->hasMany(CarPhoto::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
